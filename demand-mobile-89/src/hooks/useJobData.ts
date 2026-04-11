
import { useState, useEffect } from "react";
import { useAuth } from '@/features/auth';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchJobsData } from "./job-data/jobDataFetcher";
import { calculateJobMetrics } from "./job-data/jobCalculations";
import { setupJobRealtimeSubscriptions } from "./job-data/jobRealtimeSubscriptions";
import type { JobData, UseJobDataReturn } from "./job-data/types";

export const useJobData = (): UseJobDataReturn => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshJobs = async () => {
    if (!user) {
      console.log('useJobData: No user, setting loading to false');
      setLoading(false);
      return;
    }

    console.log('useJobData: Starting job refresh for user:', user.id);
    setLoading(true);
    setError(null);
    
    try {
      const jobsData = await fetchJobsData(user.id);
      console.log('useJobData: Jobs fetched successfully:', jobsData.length);
      setJobs(jobsData);
    } catch (error: any) {
      console.error('useJobData: Error fetching jobs:', error);
      const errorMessage = `Failed to load jobs: ${error.message || 'Unknown error'}`;
      setError(errorMessage);
      
      // Show a more user-friendly error toast
      toast.error('Unable to load jobs', {
        description: 'Please check your connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('useJobData: Setting up real-time subscriptions for user:', user.id);
    const channel = setupJobRealtimeSubscriptions(user.id, refreshJobs);

    return () => {
      console.log('useJobData: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    console.log('useJobData: Initial job fetch triggered');
    refreshJobs();
  }, [user]);

  // Calculate metrics
  const metrics = calculateJobMetrics(jobs);

  return {
    jobs,
    loading,
    error,
    refreshJobs,
    ...metrics
  };
};
