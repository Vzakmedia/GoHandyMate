import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Settings, Plus, Edit, Save, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface SystemConfig {
  id: string;
  config_key: string;
  config_value: any;
  description: string;
  is_public: boolean;
  updated_at: string;
}

const DEFAULT_CONFIGS = [
  {
    key: 'point_values',
    value: {
      job_completion: 100,
      referral: 500,
      review: 50,
      profile_complete: 200,
      first_job: 300,
      monthly_bonus: 1000
    },
    description: 'Point values for different user actions',
    isPublic: false
  },
  {
    key: 'tier_thresholds',
    value: {
      silver: 1000,
      gold: 5000,
      platinum: 15000,
      diamond: 50000
    },
    description: 'Point thresholds for tier levels',
    isPublic: true
  },
  {
    key: 'commission_rates',
    value: {
      handyman: 0.15,
      // contractor: 0.12, — archived (contractor role removed)
      // property_manager: 0.10, — archived (property_manager role removed)
      emergency_multiplier: 1.5
    },
    description: 'Commission rates by user type',
    isPublic: false
  },
  {
    key: 'app_settings',
    value: {
      maintenance_mode: false,
      registration_enabled: true,
      email_notifications: true,
      sms_notifications: true,
      push_notifications: true
    },
    description: 'General application settings',
    isPublic: true
  },
  {
    key: 'payment_settings',
    value: {
      stripe_enabled: true,
      paypal_enabled: false,
      escrow_enabled: true,
      auto_release_days: 7,
      dispute_timeout_days: 14
    },
    description: 'Payment system configuration',
    isPublic: false
  },
  {
    key: 'job_limits',
    value: {
      handyman: {
        starter: 15,
        pro: 40,
        elite: -1
      }
      // contractor job limits removed — contractor role archived
    },
    description: 'Job limits by subscription plan',
    isPublic: true
  }
];

export const SystemConfiguration = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [formData, setFormData] = useState({
    config_key: '',
    config_value: '{}',
    description: '',
    is_public: false
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const { data, error } = await supabase
        .from('system_config')
        .select('*')
        .order('config_key');

      if (error) throw error;
      setConfigs(data || []);
    } catch (error) {
      console.error('Error fetching configs:', error);
      toast.error('Failed to fetch system configurations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let configValue;
      try {
        configValue = JSON.parse(formData.config_value);
      } catch {
        toast.error('Invalid JSON format');
        return;
      }

      const configData = {
        config_key: formData.config_key,
        config_value: configValue,
        description: formData.description,
        is_public: formData.is_public,
        updated_by: (await supabase.auth.getUser()).data.user?.id
      };

      if (editingConfig) {
        const { error } = await supabase
          .from('system_config')
          .update(configData)
          .eq('id', editingConfig.id);

        if (error) throw error;
        toast.success('Configuration updated successfully');
      } else {
        const { error } = await supabase
          .from('system_config')
          .insert(configData);

        if (error) throw error;
        toast.success('Configuration created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchConfigs();
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    }
  };

  const resetForm = () => {
    setEditingConfig(null);
    setFormData({
      config_key: '',
      config_value: '{}',
      description: '',
      is_public: false
    });
  };

  const handleEdit = (config: SystemConfig) => {
    setEditingConfig(config);
    setFormData({
      config_key: config.config_key,
      config_value: JSON.stringify(config.config_value, null, 2),
      description: config.description,
      is_public: config.is_public
    });
    setIsDialogOpen(true);
  };

  const initializeDefaultConfigs = async () => {
    try {
      const existingKeys = configs.map(c => c.config_key);
      const missingConfigs = DEFAULT_CONFIGS.filter(c => !existingKeys.includes(c.key));

      if (missingConfigs.length === 0) {
        toast.info('All default configurations already exist');
        return;
      }

      const configsToInsert = missingConfigs.map(config => ({
        config_key: config.key,
        config_value: config.value,
        description: config.description,
        is_public: config.isPublic,
        updated_by: null
      }));

      const { error } = await supabase
        .from('system_config')
        .insert(configsToInsert);

      if (error) throw error;
      
      toast.success(`Added ${missingConfigs.length} default configurations`);
      fetchConfigs();
    } catch (error) {
      console.error('Error initializing configs:', error);
      toast.error('Failed to initialize default configurations');
    }
  };

  const formatConfigValue = (value: any) => {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">System Configuration</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={initializeDefaultConfigs}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Initialize Defaults
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Configuration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingConfig ? 'Edit Configuration' : 'Add New Configuration'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="config_key">Configuration Key</Label>
                  <Input
                    id="config_key"
                    value={formData.config_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, config_key: e.target.value }))}
                    placeholder="e.g., app_settings"
                    required
                    disabled={!!editingConfig}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter configuration description"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="config_value">Configuration Value (JSON)</Label>
                  <Textarea
                    id="config_value"
                    value={formData.config_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, config_value: e.target.value }))}
                    placeholder='{"key": "value"}'
                    className="font-mono text-sm min-h-[200px]"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                  />
                  <Label htmlFor="is_public">Public (visible to users)</Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingConfig ? 'Update' : 'Create'} Configuration
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {configs.map(config => (
          <Card key={config.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{config.config_key}</CardTitle>
                  <p className="text-sm text-muted-foreground">{config.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {config.is_public && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Public
                    </span>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleEdit(config)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
                  {formatConfigValue(config.config_value)}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Last updated: {new Date(config.updated_at).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};