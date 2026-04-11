
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from '@/features/auth';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchJobsData } from "./job-data/jobDataFetcher";
import { calculateJobMetrics } from "./job-data/jobCalculations";
import { setupJobRealtimeSubscriptions } from "./job-data/jobRealtimeSubscriptions";
import type { JobData, UseJobDataReturn } from "./job-data/types";

// Cache for job data
const jobsCache = new Map<string, { data: JobData[]; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for more frequent updates

export const useOptimizedJobData = (): UseJobDataReturn => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchPromiseRef = useRef<Promise<JobData[]> | null>(null);

  const cacheKey = useMemo(() => user?.id || '', [user?.id]);

  const refreshJobs = useCallback(async (force = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    // Check cache first
    const cached = jobsCache.get(cacheKey);
    const now = Date.now();
    
    if (!force && cached && (now - cached.timestamp) < CACHE_DURATION) {
      setJobs(cached.data);
      setLoading(false);
      return;
    }

    // Prevent duplicate requests
    if (fetchPromiseRef.current) {
      try {
        const result = await fetchPromiseRef.current;
        setJobs(result);
        return;
      } catch {
        // Continue with new request if existing one failed
      }
    }

    setLoading(true);
    setError(null);
    
    try {
      const fetchPromise = fetchJobsData(user.id);
      fetchPromiseRef.current = fetchPromise;
      
      const jobsData = await fetchPromise;
      
      // Update cache
      jobsCache.set(cacheKey, { data: jobsData, timestamp: now });
      
      setJobs(jobsData);
    } catch (error: any) {
      console.error('useOptimizedJobData: Error fetching jobs:', error);
      setError(`Failed to load jobs: ${error.message || 'Unknown error'}`);
      
      if (force || !cached) {
        toast.error('Failed to load jobs');
      }
    } finally {
      setLoading(false);
      fetchPromiseRef.current = null;
    }
  }, [user?.id, cacheKey]);

  // Set up real-time subscriptions with debouncing
  useEffect(() => {
    if (!user) return;

    let timeoutId: NodeJS.Timeout;
    const debouncedRefresh = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => refreshJobs(true), 500);
    };

    const channel = setupJobRealtimeSubscriptions(user.id, debouncedRefresh);

    return () => {
      clearTimeout(timeoutId);
      console.log('useOptimizedJobData: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, refreshJobs]);

  useEffect(() => {
    refreshJobs();
  }, [refreshJobs]);

  // Memoize calculated metrics to prevent recalculation on every render
  const metrics = useMemo(() => calculateJobMetrics(jobs), [jobs]);

  return useMemo(() => ({
    jobs,
    loading,
    error,
    refreshJobs: () => refreshJobs(true),
    ...metrics
  }), [jobs, loading, error, refreshJobs, metrics]);
};
