
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CronLog } from './admin/types/automation';
import { systemJobs } from './admin/config/systemJobs';
import { QuickActions } from './admin/automation/QuickActions';
import { SystemJobsTable } from './admin/automation/SystemJobsTable';
import { ExecutionLogs } from './admin/automation/ExecutionLogs';
import { AccessDenied } from './admin/automation/AccessDenied';
import { useAutomationActions } from '@/hooks/useAutomationActions';

export const AdminAutomationPanel = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [cronLogs, setCronLogs] = useState<CronLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const {
    triggeringJobs,
    triggerJob,
    triggerDatabaseCleanup,
    generateReports
  } = useAutomationActions();

  const isAdmin = profile?.user_role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      fetchCronLogs();
    }
  }, [isAdmin]);

  const fetchCronLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cron_job_logs')
        .select('*')
        .order('execution_time', { ascending: false })
        .limit(50);

      if (error) throw error;
      setCronLogs(data || []);
    } catch (error) {
      console.error('Error fetching cron logs:', error);
      toast({
        title: "Error",
        description: "Failed to load automation logs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerJob = async (jobName: string, functionName: string) => {
    const success = await triggerJob(jobName, functionName);
    if (success) {
      setTimeout(fetchCronLogs, 2000);
    }
  };

  const handleDatabaseCleanup = async () => {
    const success = await triggerDatabaseCleanup();
    if (success) {
      setTimeout(fetchCronLogs, 2000);
    }
  };

  const handleGenerateReports = async () => {
    const success = await generateReports();
    if (success) {
      setTimeout(fetchCronLogs, 2000);
    }
  };

  if (!isAdmin) {
    return <AccessDenied userEmail={user?.email} />;
  }

  return (
    <div className="space-y-6">
      <QuickActions
        triggeringJobs={triggeringJobs}
        onTriggerJob={handleTriggerJob}
        onTriggerDatabaseCleanup={handleDatabaseCleanup}
        onGenerateReports={handleGenerateReports}
      />

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Scheduled Jobs</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <SystemJobsTable
            jobs={systemJobs}
            triggeringJobs={triggeringJobs}
            onTriggerJob={handleTriggerJob}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <ExecutionLogs
            cronLogs={cronLogs}
            loading={loading}
            onRefresh={fetchCronLogs}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
