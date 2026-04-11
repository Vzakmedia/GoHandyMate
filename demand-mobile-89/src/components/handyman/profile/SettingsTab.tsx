
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Settings, Bell, Clock, Save } from 'lucide-react';
import { UnifiedNotificationSettings } from '@/components/notifications/UnifiedNotificationSettings';
import { NotificationTester } from '@/components/notifications/NotificationTester';

interface WorkSettings {
  advance_booking_days: number;
  instant_booking: boolean;
  emergency_available: boolean;
  same_day_available: boolean;
  blackout_dates: string[];
}

export const SettingsTab = () => {
  const { user, profile } = useAuth();
  const [settings, setSettings] = useState<WorkSettings>({
    advance_booking_days: 30,
    instant_booking: false,
    emergency_available: false,
    same_day_available: false,
    blackout_dates: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [accountStats, setAccountStats] = useState({
    jobsThisMonth: 0,
    totalJobs: 0,
    memberSince: null as string | null
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
      fetchAccountStats();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      console.log('Fetching work settings...');
      const { data, error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { action: 'get_work_settings' }
      });

      if (error) {
        console.error('Error from function:', error);
        throw error;
      }
      
      console.log('Settings response:', data);
      
      if (data?.settings) {
        setSettings({
          advance_booking_days: data.settings.advance_booking_days || 30,
          instant_booking: data.settings.instant_booking || false,
          emergency_available: data.settings.emergency_available || false,
          same_day_available: data.settings.same_day_available || false,
          blackout_dates: data.settings.blackout_dates || []
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccountStats = async () => {
    if (!user) return;

    try {
      // Get member since date from profile creation
      if (profile?.created_at) {
        const memberSince = new Date(profile.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        });
        setAccountStats(prev => ({ ...prev, memberSince }));
      }

      // For now, we'll use basic stats from the handyman table
      // Future enhancement: create a jobs table with proper structure
      setAccountStats(prev => ({
        ...prev,
        totalJobs: 0,
        jobsThisMonth: 0
      }));
    } catch (error) {
      console.error('Error fetching account stats:', error);
    }
  };

  const updateSetting = (field: keyof WorkSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const saveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      console.log('Saving settings:', settings);
      
      const { data, error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'update_work_settings',
          settings: settings
        }
      });

      if (error) {
        console.error('Error from function:', error);
        throw error;
      }
      
      console.log('Save response:', data);
      
      if (data?.success) {
        toast.success('Settings updated successfully!');
        setIsEditing(false);
        // Refresh the settings to get the latest data
        await fetchSettings();
      } else {
        toast.error(data?.error || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <UnifiedNotificationSettings />
      
      <NotificationTester />
      
      {/* General Settings */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              <Settings className="w-5 h-5" />
              <span>Work Preferences</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={saveSettings}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700 text-sm md:text-base"
                    size="sm"
                  >
                    <Save className="w-4 h-4 mr-1 md:mr-2" />
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    size="sm"
                    className="text-sm md:text-base"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} size="sm" className="text-sm md:text-base">
                  Edit Settings
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Booking Settings */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-base md:text-lg font-semibold flex items-center space-x-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5" />
              <span>Booking Preferences</span>
            </h3>
            
            <div>
              <Label htmlFor="advance-booking" className="text-sm">Advance Booking Days</Label>
              <Select 
                value={settings.advance_booking_days.toString()}
                onValueChange={(value) => updateSetting('advance_booking_days', parseInt(value))}
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.instant_booking}
                  onCheckedChange={(checked) => updateSetting('instant_booking', checked)}
                  disabled={!isEditing}
                />
                <Label className="text-sm">Allow instant booking</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.same_day_available}
                  onCheckedChange={(checked) => updateSetting('same_day_available', checked)}
                  disabled={!isEditing}
                />
                <Label className="text-sm">Accept same-day requests</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.emergency_available}
                  onCheckedChange={(checked) => updateSetting('emergency_available', checked)}
                  disabled={!isEditing}
                />
                <Label className="text-sm">Available for emergency calls</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
            <span>Notification Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-2">
                <Label className="text-sm font-medium">New job requests</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Get notified when customers request your services</p>
              </div>
              <Switch defaultChecked disabled={!isEditing} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-2">
                <Label className="text-sm font-medium">Job updates</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Updates on accepted jobs and schedule changes</p>
              </div>
              <Switch defaultChecked disabled={!isEditing} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-2">
                <Label className="text-sm font-medium">Customer messages</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Direct messages from customers</p>
              </div>
              <Switch defaultChecked disabled={!isEditing} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex-1 pr-2">
                <Label className="text-sm font-medium">Payment notifications</Label>
                <p className="text-xs md:text-sm text-muted-foreground">Payment confirmations and reminders</p>
              </div>
              <Switch defaultChecked disabled={!isEditing} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div>
              <Label className="text-sm font-medium">Account Status</Label>
              <p className={`font-medium text-sm md:text-base ${
                profile?.account_status === 'active' ? 'text-green-600' :
                profile?.account_status === 'pending' ? 'text-yellow-600' :
                profile?.account_status === 'rejected' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {profile?.account_status ? 
                  profile.account_status.charAt(0).toUpperCase() + profile.account_status.slice(1) : 
                  'Unknown'
                }
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Member Since</Label>
              <p className="text-muted-foreground text-sm md:text-base">
                {accountStats.memberSince || 'Loading...'}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Subscription Plan</Label>
              <p className={`font-medium text-sm md:text-base ${
                profile?.subscription_plan === 'pro' ? 'text-blue-600' :
                profile?.subscription_plan === 'premium' ? 'text-purple-600' :
                'text-gray-600'
              }`}>
                {profile?.subscription_plan ? 
                  profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1) + ' Plan' : 
                  'Basic Plan'
                }
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Jobs This Month</Label>
              <p className="text-purple-600 font-medium text-sm md:text-base">
                {accountStats.jobsThisMonth} jobs
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
