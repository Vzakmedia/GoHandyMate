
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { JobRequest, Unit, JobCounts } from './types';

export const useJobsData = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobRequest[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    if (!user) return;

    try {
      // First fetch jobs with units
      const { data: jobsData, error: jobsError } = await supabase
        .from('job_requests')
        .select(`
          *,
          units (
            unit_number,
            unit_name,
            property_address
          )
        `)
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;

      // If there are jobs with assigned users, fetch their profiles separately
      const jobsWithAssignedUsers = jobsData?.filter(job => job.assigned_to_user_id) || [];
      
      let profilesData: any[] = [];
      if (jobsWithAssignedUsers.length > 0) {
        const assignedUserIds = jobsWithAssignedUsers.map(job => job.assigned_to_user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', assignedUserIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Combine the data and ensure proper typing
      const enrichedJobs: JobRequest[] = jobsData?.map(job => ({
        ...job,
        status: job.status as 'pending' | 'in_progress' | 'completed' | 'cancelled',
        priority: job.priority as 'low' | 'medium' | 'high' | 'urgent',
        profiles: job.assigned_to_user_id 
          ? profilesData.find(profile => profile.id === job.assigned_to_user_id)
          : null
      })) || [];

      setJobs(enrichedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    }
  };

  const fetchUnits = async () => {
    if (!user) return;

    try {
      const { data: unitsData, error } = await supabase
        .from('units')
        .select('id, unit_number, unit_name, property_address')
        .eq('manager_id', user.id)
        .order('unit_number');

      if (error) throw error;
      setUnits(unitsData || []);
    } catch (error) {
      console.error('Error fetching units:', error);
      toast.error('Failed to load units');
    } finally {
      setLoading(false);
    }
  };

  const updateJobStatus = async (jobId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (error) throw error;

      toast.success('Job status updated successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error updating job status:', error);
      toast.error('Failed to update job status');
    }
  };

  const getJobCounts = (): JobCounts => {
    return {
      all: jobs.length,
      pending: jobs.filter(job => job.status === 'pending').length,
      in_progress: jobs.filter(job => job.status === 'in_progress').length,
      completed: jobs.filter(job => job.status === 'completed').length,
      cancelled: jobs.filter(job => job.status === 'cancelled').length
    };
  };

  useEffect(() => {
    fetchJobs();
    fetchUnits();
  }, [user]);

  return {
    jobs,
    units,
    loading,
    fetchJobs,
    updateJobStatus,
    getJobCounts
  };
};
