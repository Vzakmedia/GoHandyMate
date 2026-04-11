import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Pause,
  Settings,
  Users,
  TrendingUp,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Integration {
  id: string;
  provider: string;
  user_id: string;
  external_user_id: string;
  integration_data: any;
  sync_status: string;
  last_sync_at: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

interface SystemConfig {
  id: string;
  config_key: string;
  config_value: any;
  description: string;
}

const PROVIDERS = [
  {
    id: 'taskrabbit',
    name: 'TaskRabbit',
    description: 'Connect with TaskRabbit for enhanced job opportunities',
    color: 'bg-green-500',
    features: ['Job Sync', 'Profile Sync', 'Review Sync', 'Payment Sync']
  },
  {
    id: 'thumbtack',
    name: 'Thumbtack',
    description: 'Integrate with Thumbtack for lead generation',
    color: 'bg-blue-500',
    features: ['Lead Sync', 'Quote Sync', 'Customer Sync', 'Analytics']
  },
  {
    id: 'angie',
    name: "Angie's List",
    description: 'Connect with Angie for customer reviews and leads',
    color: 'bg-purple-500',
    features: ['Review Sync', 'Lead Sync', 'Profile Sync']
  },
  {
    id: 'homeadvisor',
    name: 'HomeAdvisor',
    description: 'Integrate with HomeAdvisor for project opportunities',
    color: 'bg-orange-500',
    features: ['Project Sync', 'Lead Sync', 'Background Check Sync']
  }
];

export const ExternalIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [integrationsResult, configsResult] = await Promise.all([
        supabase
          .from('external_integrations')
          .select(`
            *,
            profiles:user_id (full_name, email)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('system_config')
          .select('*')
          .in('config_key', ['taskrabbit_sync', 'thumbtack_sync', 'angie_sync', 'homeadvisor_sync'])
      ]);

      if (integrationsResult.error) throw integrationsResult.error;
      if (configsResult.error) throw configsResult.error;

      setIntegrations((integrationsResult.data as any) || []);
      setSystemConfigs(configsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch integration data');
    } finally {
      setLoading(false);
    }
  };

  const triggerSync = async (provider: string) => {
    setSyncingProvider(provider);
    try {
      // Here you would typically call an edge function to trigger sync
      const { data, error } = await supabase.functions.invoke('sync-external-provider', {
        body: { provider }
      });

      if (error) throw error;
      
      toast.success(`${provider} sync triggered successfully`);
      await fetchData();
    } catch (error) {
      console.error('Error triggering sync:', error);
      toast.error(`Failed to sync with ${provider}`);
    } finally {
      setSyncingProvider(null);
    }
  };

  const updateProviderStatus = async (provider: string, enabled: boolean) => {
    try {
      const configKey = `${provider}_sync`;
      const existingConfig = systemConfigs.find(c => c.config_key === configKey);
      
      if (existingConfig) {
        const updatedConfig = {
          ...existingConfig.config_value,
          enabled
        };

        const { error } = await supabase
          .from('system_config')
          .update({
            config_value: updatedConfig,
            updated_by: (await supabase.auth.getUser()).data.user?.id
          })
          .eq('id', existingConfig.id);

        if (error) throw error;
      }

      toast.success(`${provider} integration ${enabled ? 'enabled' : 'disabled'}`);
      await fetchData();
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast.error('Failed to update provider status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'paused':
        return <Pause className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getProviderStats = (provider: string) => {
    const providerIntegrations = integrations.filter(i => i.provider === provider);
    const activeCount = providerIntegrations.filter(i => i.sync_status === 'active').length;
    const totalCount = providerIntegrations.length;
    
    return {
      total: totalCount,
      active: activeCount,
      percentage: totalCount > 0 ? (activeCount / totalCount) * 100 : 0
    };
  };

  const getProviderConfig = (provider: string) => {
    return systemConfigs.find(c => c.config_key === `${provider}_sync`);
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
      <div className="flex items-center gap-2">
        <ExternalLink className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold">External Integrations</h3>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Integrations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROVIDERS.map(provider => {
              const stats = getProviderStats(provider.id);
              const config = getProviderConfig(provider.id);
              const isEnabled = config?.config_value?.enabled ?? true;

              return (
                <Card key={provider.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${provider.color} rounded-lg flex items-center justify-center`}>
                        <ExternalLink className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant={isEnabled ? 'default' : 'secondary'}>
                        {isEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{provider.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{provider.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Users</span>
                        <span>{stats.active}/{stats.total}</span>
                      </div>
                      <Progress value={stats.percentage} className="h-2" />
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => triggerSync(provider.id)}
                        disabled={!isEnabled || syncingProvider === provider.id}
                      >
                        {syncingProvider === provider.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Syncing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Sync
                          </>
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant={isEnabled ? "destructive" : "default"}
                        onClick={() => updateProviderStatus(provider.id, !isEnabled)}
                      >
                        {isEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4">
            {integrations.map(integration => (
              <Card key={integration.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(integration.sync_status)}
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {integration.profiles?.full_name || 'Unknown User'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {integration.profiles?.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">
                          {PROVIDERS.find(p => p.id === integration.provider)?.name}
                        </Badge>
                        <Badge variant={
                          integration.sync_status === 'active' ? 'default' :
                          integration.sync_status === 'error' ? 'destructive' :
                          integration.sync_status === 'paused' ? 'secondary' : 'outline'
                        }>
                          {integration.sync_status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          Last sync: {integration.last_sync_at 
                            ? format(new Date(integration.last_sync_at), 'MMM dd, HH:mm')
                            : 'Never'
                          }
                        </span>
                      </div>
                      <div>
                        External ID: {integration.external_user_id}
                      </div>
                    </div>
                  </div>
                  
                  {integration.integration_data && Object.keys(integration.integration_data).length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Integration Data:</p>
                      <pre className="text-xs text-muted-foreground overflow-x-auto">
                        {JSON.stringify(integration.integration_data, null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4">
            {systemConfigs.map(config => (
              <Card key={config.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    {config.config_key.replace('_sync', '').replace(/\b\w/g, l => l.toUpperCase())} Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{config.description}</p>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {JSON.stringify(config.config_value, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};