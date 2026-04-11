import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAudioNotifications } from '@/hooks/useAudioNotifications';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { 
  Volume2, 
  VolumeX, 
  Bell, 
  MessageSquare, 
  Briefcase, 
  DollarSign, 
  AlertTriangle,
  Home,
  Wrench,
  Save
} from 'lucide-react';

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

export const UnifiedNotificationSettings = () => {
  const { user, profile } = useAuth();
  const {
    playJobRequestTone,
    playQuoteNotificationTone,
    playMessageTone,
    isEnabled,
    setIsEnabled,
    volume,
    setVolume
  } = useAudioNotifications();

  const {
    preferences,
    loading,
    savePreferences: savePrefsToDb
  } = useNotificationPreferences();

  const [localPrefs, setLocalPrefs] = useState<NotificationPreferences>(preferences);
  const [saving, setSaving] = useState(false);

  // Sync local state with database preferences
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  // Save preferences to database
  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedPreferences = {
        ...localPrefs,
        audio_enabled: isEnabled,
        volume: volume,
      };

      const success = await savePrefsToDb(updatedPreferences);
      if (success) {
        toast.success('Notification settings saved successfully');
      } else {
        toast.error('Failed to save to database, using local storage backup');
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean | number) => {
    setLocalPrefs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    updatePreference('volume', vol);
    
    // Play a test sound to provide immediate feedback
    if (isEnabled && vol > 0) {
      setTimeout(() => playMessageTone(), 100); // Small delay to ensure volume is updated
    }
  };

  const testSound = (type: 'job' | 'quote' | 'message') => {
    switch (type) {
      case 'job':
        playJobRequestTone();
        break;
      case 'quote':
        playQuoteNotificationTone();
        break;
      case 'message':
        playMessageTone();
        break;
    }
  };

  const getRoleSpecificSettings = () => {
    if (!profile) return [];

    const baseSettings = [
      {
        key: 'message_notifications' as const,
        label: 'Message Notifications',
        description: 'Get notified when you receive new messages',
        icon: MessageSquare,
        testAction: () => testSound('message'),
        testLabel: 'Test Message Sound'
      },
      {
        key: 'system_notifications' as const,
        label: 'System Notifications',
        description: 'Important system updates and announcements',
        icon: Bell,
        testAction: null,
        testLabel: null
      }
    ];

    switch (profile.user_role) {
      case 'handyman':
        return [
          ...baseSettings,
          {
            key: 'job_notifications' as const,
            label: 'Job Request Notifications',
            description: 'Get notified when new handyman jobs are posted',
            icon: Briefcase,
            testAction: () => testSound('job'),
            testLabel: 'Test Job Sound'
          },
          {
            key: 'quote_notifications' as const,
            label: 'Quote Request Notifications',
            description: 'Get notified when customers request quotes',
            icon: DollarSign,
            testAction: () => testSound('quote'),
            testLabel: 'Test Quote Sound'
          },
          {
            key: 'emergency_notifications' as const,
            label: 'Emergency Job Notifications',
            description: 'High priority emergency job alerts',
            icon: AlertTriangle,
            testAction: () => testSound('job'),
            testLabel: 'Test Emergency Sound'
          }
        ];

      case 'contractor':
        return [
          ...baseSettings,
          {
            key: 'job_notifications' as const,
            label: 'Project Notifications',
            description: 'Get notified when new contractor projects are posted',
            icon: Home,
            testAction: () => testSound('job'),
            testLabel: 'Test Project Sound'
          },
          {
            key: 'quote_notifications' as const,
            label: 'Quote Request Notifications',
            description: 'Get notified when clients request contractor quotes',
            icon: DollarSign,
            testAction: () => testSound('quote'),
            testLabel: 'Test Quote Sound'
          }
        ];

      case 'customer':
        return [
          ...baseSettings,
          {
            key: 'quote_notifications' as const,
            label: 'Quote Response Notifications',
            description: 'Get notified when professionals respond to your quote requests',
            icon: DollarSign,
            testAction: () => testSound('quote'),
            testLabel: 'Test Quote Sound'
          },
          {
            key: 'job_notifications' as const,
            label: 'Job Status Updates',
            description: 'Get notified about job progress and completion',
            icon: Briefcase,
            testAction: () => testSound('job'),
            testLabel: 'Test Update Sound'
          },
          {
            key: 'payment_notifications' as const,
            label: 'Payment Notifications',
            description: 'Payment confirmations and billing updates',
            icon: DollarSign,
            testAction: null,
            testLabel: null
          }
        ];

      case 'property_manager':
        return [
          ...baseSettings,
          {
            key: 'maintenance_notifications' as const,
            label: 'Maintenance Request Notifications',
            description: 'Get notified about new maintenance requests',
            icon: Wrench,
            testAction: () => testSound('job'),
            testLabel: 'Test Maintenance Sound'
          },
          {
            key: 'emergency_notifications' as const,
            label: 'Emergency Notifications',
            description: 'Critical emergency alerts for properties',
            icon: AlertTriangle,
            testAction: () => testSound('job'),
            testLabel: 'Test Emergency Sound'
          },
          {
            key: 'job_notifications' as const,
            label: 'Job Status Notifications',
            description: 'Updates on ongoing maintenance and repairs',
            icon: Briefcase,
            testAction: () => testSound('job'),
            testLabel: 'Test Job Sound'
          }
        ];

      default:
        return baseSettings;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading notification settings...</div>
        </CardContent>
      </Card>
    );
  }

  const roleSettings = getRoleSpecificSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({profile?.user_role || 'user'})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Audio Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Audio Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable sound notifications
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <Switch
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
            </div>
          </div>

          {/* Volume Control */}
          {isEnabled && (
            <div className="space-y-2">
              <Label className="text-sm">Volume: {Math.round(volume * 100)}%</Label>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Role-specific notification types */}
        <div className="space-y-4">
          <Label className="text-base font-medium">
            Notification Types for {profile?.user_role?.replace('_', ' ').toUpperCase()}
          </Label>
          {roleSettings.map((setting) => {
            const IconComponent = setting.icon;
            return (
              <div key={setting.key} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <IconComponent className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="space-y-1 min-w-0">
                      <div className="font-medium text-sm leading-tight">{setting.label}</div>
                      <p className="text-xs text-muted-foreground leading-tight">
                        {setting.description}
                      </p>
                    </div>
                  </div>
                   <div className="flex items-center gap-2 flex-shrink-0">
                     <Switch
                       checked={localPrefs[setting.key] as boolean}
                       onCheckedChange={(checked) => updatePreference(setting.key, checked)}
                     />
                   </div>
                </div>
                {setting.testAction && isEnabled && (
                  <div className="pl-7">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={setting.testAction}
                      className="text-xs h-7 px-2 w-full"
                    >
                      {setting.testLabel}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Separator />

        {/* Save Button */}
        <Button 
          onClick={savePreferences} 
          disabled={saving}
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>

        {/* Info */}
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">Notification System:</p>
          <ul className="space-y-1">
            <li>• Settings are customized for your role as {profile?.user_role?.replace('_', ' ')}</li>
            <li>• Audio notifications require browser permission</li>
            <li>• Different sounds play for different notification types</li>
            <li>• Settings are saved to the database and synced across devices</li>
            <li>• Real-time notifications work when the app is active</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};