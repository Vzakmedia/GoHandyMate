import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

export interface BusinessSettings {
  id?: string;
  business_name: string;
  business_logo_url?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  business_website?: string;
  license_number?: string;
  insurance_number?: string;
  tax_id?: string;
  payment_terms: string;
  terms_conditions: string;
  quote_footer: string;
  default_labor_rate: number;
  default_markup_percentage: number;
  auto_quote_expiry_days: number;
}

export const useBusinessSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      } else {
        // Create default settings
        const defaultSettings: Partial<BusinessSettings> = {
          business_name: '',
          payment_terms: 'Net 30',
          terms_conditions: 'Payment is due within 30 days of invoice date.',
          quote_footer: 'Thank you for your business!',
          default_labor_rate: 50.00,
          default_markup_percentage: 20.00,
          auto_quote_expiry_days: 30,
        };
        setSettings(defaultSettings as BusinessSettings);
      }
    } catch (error) {
      console.error('Error fetching business settings:', error);
      toast.error('Failed to load business settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: Partial<BusinessSettings>) => {
    if (!user) return false;

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from('business_settings')
        .upsert({
          user_id: user.id,
          ...newSettings,
        })
        .select()
        .single();

      if (error) throw error;

      setSettings(data);
      toast.success('Business settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving business settings:', error);
      toast.error('Failed to save business settings');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/logo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-photos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('project-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
      return null;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('business-settings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_settings',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Business settings changed:', payload);
          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            setSettings(payload.new as BusinessSettings);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    settings,
    loading,
    saving,
    saveSettings,
    uploadLogo,
    refreshSettings: fetchSettings,
  };
};