import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';

interface NotificationPreferences {
  audio_enabled: boolean;
  volume: number;
  job_notifications: boolean;
  quote_notifications: boolean;
  message_notifications: boolean;
  emergency_notifications: boolean;
  maintenance_notifications: boolean;
  payment_notifications: boolean;
  system_notifications: boolean;
}

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    audio_enabled: true,
    volume: 0.7,
    job_notifications: true,
    quote_notifications: true,
    message_notifications: true,
    emergency_notifications: true,
    maintenance_notifications: true,
    payment_notifications: true,
    system_notifications: true,
  });
  const [loading, setLoading] = useState(true);

  // Load preferences from database
  const loadPreferences = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔔 Loading notification preferences from database');
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading notification preferences:', error);
        // Fall back to localStorage
        const storageKey = `notification_preferences_${user.id}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          try {
            setPreferences(JSON.parse(stored));
          } catch (parseError) {
            console.error('Error parsing localStorage preferences:', parseError);
          }
        }
      } else if (data) {
        console.log('✅ Loaded preferences from database:', data);
        setPreferences(data);
        // Also save to localStorage as backup
        const storageKey = `notification_preferences_${user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
      } else {
        // No preferences found, create default ones
        console.log('🔔 Creating default notification preferences');
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Error in loadPreferences:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create default preferences in database
  const createDefaultPreferences = async () => {
    if (!user) return;

    const defaultPrefs = {
      user_id: user.id,
      audio_enabled: true,
      volume: 0.7,
      job_notifications: true,
      quote_notifications: true,
      message_notifications: true,
      emergency_notifications: true,
      maintenance_notifications: true,
      payment_notifications: true,
      system_notifications: true,
    };

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert(defaultPrefs)
        .select()
        .single();

      if (error) {
        console.error('Error creating default preferences:', error);
        setPreferences(defaultPrefs);
      } else {
        console.log('✅ Created default preferences:', data);
        setPreferences(data);
      }
    } catch (error) {
      console.error('Error in createDefaultPreferences:', error);
      setPreferences(defaultPrefs);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const getPreferences = (): NotificationPreferences => {
    return preferences;
  };

  const savePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) return false;

    try {
      console.log('🔔 Saving notification preferences to database');
      const updatedPrefs = { ...preferences, ...newPreferences };
      
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          ...updatedPrefs
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving notification preferences:', error);
        // Fall back to localStorage
        const storageKey = `notification_preferences_${user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(updatedPrefs));
        setPreferences(updatedPrefs);
        return false;
      } else {
        console.log('✅ Saved preferences to database:', data);
        setPreferences(data);
        // Also save to localStorage as backup
        const storageKey = `notification_preferences_${user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(data));
        return true;
      }
    } catch (error) {
      console.error('Error in savePreferences:', error);
      return false;
    }
  };

  const shouldPlayNotification = useCallback((type: string): boolean => {
    const currentPrefs = getPreferences();
    
    console.log(`🔔 Checking if should play ${type} notification:`, {
      audio_enabled: currentPrefs.audio_enabled,
      type_enabled: currentPrefs[`${type}_notifications` as keyof NotificationPreferences],
      preferences: currentPrefs
    });
    
    if (!currentPrefs.audio_enabled) {
      console.log(`🔔 Audio disabled, skipping ${type} notification`);
      return false;
    }

    switch (type) {
      case 'job_request':
      case 'job_assignment':
        return currentPrefs.job_notifications;
      case 'quote':
      case 'quote_request':
      case 'quote_submission':
        return currentPrefs.quote_notifications;
      case 'message':
        return currentPrefs.message_notifications;
      case 'emergency':
        return currentPrefs.emergency_notifications;
      case 'maintenance':
        return currentPrefs.maintenance_notifications;
      case 'payment':
        return currentPrefs.payment_notifications;
      case 'system':
        return currentPrefs.system_notifications;
      default:
        console.log(`🔔 Unknown notification type: ${type}, allowing by default`);
        return true;
    }
  }, [preferences]);

  return {
    preferences,
    loading,
    getPreferences,
    savePreferences,
    shouldPlayNotification,
    refetch: loadPreferences
  };
};