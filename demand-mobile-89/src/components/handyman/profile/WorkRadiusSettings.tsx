
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { GoogleMapView } from '@/components/maps/GoogleMapView';
import { useAuth } from '@/features/auth';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ServiceAreaSettings } from './ServiceAreaSettings';

interface WorkSettings {
  work_radius_miles: number;
  center_latitude: number;
  center_longitude: number;
  same_day_available: boolean;
  emergency_available: boolean;
  instant_booking: boolean;
  advance_booking_days: number;
  travel_fee_enabled: boolean;
  travel_fee_per_mile: number;
  minimum_job_amount: number;
  preferred_job_types: string[];
}

export const WorkRadiusSettings = ({ isEditing }: { isEditing: boolean }) => {
  const { user } = useAuth();
  const { currentLocation } = useLocationTracking();
  const [settings, setSettings] = useState<WorkSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { action: 'get_work_settings' }
      });

      if (error) throw error;

      if (data.settings) {
        setSettings(data.settings);
      } else {
        // Initialize with default settings using current location
        const defaultSettings: WorkSettings = {
          work_radius_miles: 25,
          center_latitude: currentLocation?.latitude || 40.7128,
          center_longitude: currentLocation?.longitude || -74.0060,
          same_day_available: false,
          emergency_available: false,
          instant_booking: false,
          advance_booking_days: 30,
          travel_fee_enabled: true,
          travel_fee_per_mile: 0.50,
          minimum_job_amount: 50.00,
          preferred_job_types: []
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error fetching work settings:', error);
      toast.error('Failed to load work settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user || !settings) return;

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'update_work_settings',
          settings
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Work settings updated successfully!');
      }
    } catch (error) {
      console.error('Error saving work settings:', error);
      toast.error('Failed to save work settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <div className="animate-pulse p-6">Loading work settings...</div>;
  }

  const getMapCenter = () => ({
    latitude: settings.center_latitude,
    longitude: settings.center_longitude
  });

  return (
    <div className="space-y-6">
      {/* Enhanced Service Area Settings */}
      <ServiceAreaSettings isEditing={isEditing} />

      {/* Basic Work Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="w-5 h-5" />
            <span>General Work Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Same Day Available</Label>
                <Switch
                  checked={settings.same_day_available}
                  onCheckedChange={(checked) => setSettings({...settings, same_day_available: checked})}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Emergency Services</Label>
                <Switch
                  checked={settings.emergency_available}
                  onCheckedChange={(checked) => setSettings({...settings, emergency_available: checked})}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Instant Booking</Label>
                <Switch
                  checked={settings.instant_booking}
                  onCheckedChange={(checked) => setSettings({...settings, instant_booking: checked})}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Advance Booking Days</Label>
                <Input
                  type="number"
                  value={settings.advance_booking_days}
                  onChange={(e) => setSettings({...settings, advance_booking_days: parseInt(e.target.value) || 30})}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Minimum Job Amount ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.minimum_job_amount}
                  onChange={(e) => setSettings({...settings, minimum_job_amount: parseFloat(e.target.value) || 50})}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Travel Fee Settings */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label>Enable Travel Fees</Label>
              <Switch
                checked={settings.travel_fee_enabled}
                onCheckedChange={(checked) => setSettings({...settings, travel_fee_enabled: checked})}
                disabled={!isEditing}
              />
            </div>
            
            {settings.travel_fee_enabled && (
              <div>
                <Label>Travel Fee per Mile ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={settings.travel_fee_per_mile}
                  onChange={(e) => setSettings({...settings, travel_fee_per_mile: parseFloat(e.target.value) || 0.50})}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {isEditing && (
            <Button onClick={saveSettings} disabled={saving} className="w-full">
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
