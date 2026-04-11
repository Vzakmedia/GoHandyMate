
import { useState, useEffect } from "react";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Job, JobStatus } from "@/types/job";
import { fetchJobsData } from "./job-data/jobDataFetcher";
import { setupJobRealtimeSubscriptions } from "./job-data/jobRealtimeSubscriptions";

export const useHandymanJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const mapStatusToJobStatus = (status: string): JobStatus => {
    // Map various status values to valid JobStatus values
    switch (status) {
      case 'assigned':
        return 'assigned';
      case 'in_progress':
      case 'ongoing':
        return 'in_progress';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      case 'pending':
        return 'pending';
      default:
        return 'pending'; // Default fallback
    }
  };

  const fetchJobs = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    
    try {
      console.log('useHandymanJobs: Fetching jobs for user:', user.id);
      
      const jobsData = await fetchJobsData(user.id);
      
      // Transform JobData to Job format for compatibility
      const transformedJobs: Job[] = jobsData.map((job) => ({
        ...job,
        status: mapStatusToJobStatus(job.status),
        price: job.budget || 0,
        scheduledDate: job.preferred_schedule || job.created_at,
        customerName: job.units?.tenant_name || 'Customer',
        customerPhone: job.units?.tenant_phone || '',
        estimatedDuration: '2-3 hours',
        location: job.location,
        quote_id: job.job_type === 'custom_quote' ? job.id.replace('quote-', '') : undefined,
        quote_request_id: job.job_type === 'custom_quote' ? job.customer_id : undefined
      }));

      // Apply the custom filtering logic for assigned custom quote jobs
      const completedCustomQuoteJobs = transformedJobs
        .filter(job => job.job_type === 'custom_quote' && job.status === 'completed')
        .map(job => job.title?.replace('Quote Job: ', ''));

      const filteredJobs = transformedJobs.filter(job => {
        if (job.job_type === 'custom_quote' && job.status === 'assigned') {
          const serviceName = job.title?.replace('Custom Quote Job: ', '');
          return !completedCustomQuoteJobs.includes(serviceName);
        }
        return true;
      });
      
      console.log('useHandymanJobs: All transformed jobs:', filteredJobs);
      
      setJobs(filteredJobs);
      setLastRefresh(new Date());
    } catch (error: any) {
      console.error('useHandymanJobs: Error fetching jobs:', error);
      setError(`Failed to load jobs: ${error.message || 'Unknown error'}`);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobStatusUpdate = async (jobId: string, newStatus: string) => {
    try {
      console.log('useHandymanJobs: Updating job status:', { jobId, newStatus });
      
      const job = jobs.find(j => j.id === jobId);
      if (!job) {
        console.error('useHandymanJobs: Job not found:', jobId);
        return;
      }

      if (job.job_type === 'custom_quote') {
        console.log('useHandymanJobs: Updating quote job status');
        
        // Extract the actual quote ID from the job ID (remove 'quote-' prefix)
        const actualQuoteId = job.quote_id || jobId.replace('quote-', '');
        
        const { error } = await supabase.functions.invoke('quote-operations', {
          body: {
            action: 'update_job_status',
            job_id: actualQuoteId,
            status: newStatus,
            quote_request_id: job.quote_request_id
          }
        });

        if (error) {
          console.error('useHandymanJobs: Error updating quote status:', error);
          throw error;
        }
        console.log('useHandymanJobs: Quote status updated successfully');
      } else {
        console.log('useHandymanJobs: Updating regular job status');
        const { error } = await supabase
          .from('job_requests')
          .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', jobId);

        if (error) {
          console.error('useHandymanJobs: Error updating regular job:', error);
          throw error;
        }
        console.log('useHandymanJobs: Regular job status updated successfully');
      }

      toast.success('Job status updated successfully');
      fetchJobs(); // Refresh jobs
    } catch (error: any) {
      console.error('useHandymanJobs: Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  // Set up real-time subscription for job updates
  useEffect(() => {
    if (!user) return;

    const channel = setupJobRealtimeSubscriptions(user.id, fetchJobs);

    return () => {
      console.log('useHandymanJobs: Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [user]);

  const getJobsByStatus = (status: string) => {
    return jobs.filter(job => job.status === status);
  };

  const handleJobUpdated = () => {
    console.log('useHandymanJobs: Job updated, refreshing jobs list');
    fetchJobs();
  };

  return {
    jobs,
    loading,
    error,
    lastRefresh,
    fetchJobs,
    handleJobStatusUpdate,
    getJobsByStatus,
    handleJobUpdated
  };
};
