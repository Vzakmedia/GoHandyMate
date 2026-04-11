
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, Clock, AlertCircle, CheckCircle, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SyncLog {
  id: string;
  sync_type: string;
  operation: string;
  status: string;
  error_message?: string;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

interface SyncConfig {
  id: string;
  sync_type: string;
  api_endpoint: string;
  sync_enabled: boolean;
  last_sync_at?: string;
  sync_interval_minutes: number;
}

export const ApiSyncMonitor = () => {
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [syncConfigs, setSyncConfigs] = useState<SyncConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSyncData();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('sync-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'api_sync_logs'
      }, () => {
        fetchSyncData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSyncData = async () => {
    try {
      const [logsResponse, configsResponse] = await Promise.all([
        supabase
          .from('api_sync_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('api_sync_config')
          .select('*')
          .order('sync_type')
      ]);

      if (logsResponse.error) throw logsResponse.error;
      if (configsResponse.error) throw configsResponse.error;

      setSyncLogs(logsResponse.data || []);
      setSyncConfigs(configsResponse.data || []);
    } catch (error) {
      console.error('Error fetching sync data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sync data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const triggerManualSync = async (syncType: string = 'all') => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('api-sync', {
        body: { syncType }
      });

      if (error) throw error;

      toast({
        title: "Sync Started",
        description: `Manual sync triggered for ${syncType}`,
      });

      // Refresh data after a short delay
      setTimeout(fetchSyncData, 2000);
    } catch (error) {
      console.error('Error triggering sync:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to trigger manual sync",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'retrying':
        return <RefreshCw className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'retrying':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
          <span className="ml-2">Loading sync data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">API Sync Monitor</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => triggerManualSync('job_requests')}
            disabled={syncing}
            variant="outline"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Sync Jobs
          </Button>
          <Button 
            onClick={() => triggerManualSync('contractor_data')}
            disabled={syncing}
            variant="outline"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Sync Contractors
          </Button>
          <Button 
            onClick={() => triggerManualSync('all')}
            disabled={syncing}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            {syncing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Sync All
          </Button>
        </div>
      </div>

      {/* Sync Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {syncConfigs.map((config) => (
              <div key={config.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium capitalize">{config.sync_type.replace('_', ' ')}</h3>
                  <Badge variant={config.sync_enabled ? "default" : "secondary"}>
                    {config.sync_enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>Interval: {config.sync_interval_minutes} minutes</div>
                  <div>Endpoint: {config.api_endpoint}</div>
                  {config.last_sync_at && (
                    <div>Last sync: {new Date(config.last_sync_at).toLocaleString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Sync Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncLogs.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No sync activity yet</p>
            ) : (
              syncLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(log.status)}
                    <div>
                      <div className="font-medium capitalize">
                        {log.sync_type.replace('_', ' ')} - {log.operation}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                      {log.error_message && (
                        <div className="text-sm text-red-600 mt-1">
                          {log.error_message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {log.retry_count > 0 && (
                      <span className="text-xs text-gray-500">
                        Retry: {log.retry_count}
                      </span>
                    )}
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
