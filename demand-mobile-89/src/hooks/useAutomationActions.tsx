
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { invokeEdgeFunction, fetchFromSupabase, insertToSupabase } from '@/utils/apiUtils';
import { getUserFriendlyMessage } from '@/utils/errorHandling';

export const useAutomationActions = () => {
  const { toast } = useToast();
  const [triggeringJobs, setTriggeringJobs] = useState<Set<string>>(new Set());

  const triggerJob = async (jobName: string, functionName: string) => {
    setTriggeringJobs(prev => new Set(prev).add(jobName));
    try {
      const response = await invokeEdgeFunction(functionName);
      
      if (!response.success) {
        throw response.error;
      }

      toast({
        title: "Success",
        description: `${jobName} triggered successfully.`,
      });

      return true;
    } catch (error: any) {
      const errorMessage = getUserFriendlyMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setTriggeringJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobName);
        return newSet;
      });
    }
  };

  const triggerDatabaseCleanup = async () => {
    setTriggeringJobs(prev => new Set(prev).add('database-cleanup'));
    try {
      const cleanupPromises = [
        invokeEdgeFunction('admin-cleanup-notifications'),
        invokeEdgeFunction('admin-cleanup-expired-ads')
      ];

      const results = await Promise.all(cleanupPromises);
      
      // Check if any cleanup failed
      const failedCleanups = results.filter(result => !result.success);
      if (failedCleanups.length > 0) {
        throw new Error('Some cleanup operations failed');
      }

      toast({
        title: "Success",
        description: "Database cleanup completed successfully.",
      });
      return true;
    } catch (error: any) {
      const errorMessage = getUserFriendlyMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setTriggeringJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete('database-cleanup');
        return newSet;
      });
    }
  };

  const generateReports = async () => {
    setTriggeringJobs(prev => new Set(prev).add('generate-reports'));
    try {
      const userStatsResponse = await fetchFromSupabase(
        supabase
          .from('profiles')
          .select('user_role, account_status')
          .not('user_role', 'is', null)
      );

      const jobStatsResponse = await fetchFromSupabase(
        supabase
          .from('job_requests')
          .select('status, created_at')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      );

      if (!userStatsResponse.success || !jobStatsResponse.success) {
        throw new Error('Failed to fetch report data');
      }

      const reportData = {
        timestamp: new Date().toISOString(),
        user_stats: userStatsResponse.data,
        job_stats: jobStatsResponse.data,
        total_users: userStatsResponse.data?.length || 0,
        total_jobs_30_days: jobStatsResponse.data?.length || 0
      };

      const insertResponse = await insertToSupabase('cron_job_logs', {
        job_name: 'generate-reports',
        status: 'completed',
        details: reportData
      });

      if (!insertResponse.success) {
        throw insertResponse.error;
      }

      toast({
        title: "Success",
        description: "Reports generated successfully.",
      });
      return true;
    } catch (error: any) {
      const errorMessage = getUserFriendlyMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setTriggeringJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete('generate-reports');
        return newSet;
      });
    }
  };

  return {
    triggeringJobs,
    triggerJob,
    triggerDatabaseCleanup,
    generateReports
  };
};
