import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

interface Job {
  id: string;
  title: string;
  property: string;
  unit: string;
  technician: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'pending';
  created_at: string;
  budget: number;
  category: string;
  description: string;
}

interface JobTrackingData {
  jobs: Job[];
  properties: string[];
  loading: boolean;
}

export const usePropertyJobTracking = (): JobTrackingData => {
  const { user } = useAuth();
  const [data, setData] = useState<JobTrackingData>({
    jobs: [],
    properties: [],
    loading: true,
  });

  const fetchJobs = async () => {
    if (!user) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      console.log('Fetching property manager job tracking data for user:', user.id);

      // Fetch jobs with units for this property manager
      const { data: jobData, error: jobError } = await supabase
        .from('job_requests')
        .select(`
          id,
          title,
          job_type,
          description,
          status,
          priority,
          created_at,
          updated_at,
          preferred_schedule,
          assigned_to_user_id,
          unit_id,
          units (
            unit_number,
            unit_name,
            property_address
          )
        `)
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false });

      if (jobError) {
        console.error('Error fetching jobs:', jobError);
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      // Fetch user profiles for assigned technicians
      const assignedUserIds = jobData?.map(job => job.assigned_to_user_id).filter(Boolean) || [];
      
      let userProfiles: Record<string, string> = {};
      
      if (assignedUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', assignedUserIds);

        userProfiles = profiles?.reduce((acc, profile) => {
          acc[profile.id] = profile.full_name || 'Unknown';
          return acc;
        }, {} as Record<string, string>) || {};
      }

      // Transform the data to match the Job interface
      const transformedJobs: Job[] = (jobData || []).map((job: any) => {
        const propertyAddress = job.units?.property_address || 'Unknown Property';
        const unitNumber = job.units?.unit_number || job.units?.unit_name || 'Unknown Unit';
        
        return {
          id: job.id,
          title: job.title || 'Service Request',
          property: propertyAddress,
          unit: unitNumber,
          technician: job.assigned_to_user_id ? (userProfiles[job.assigned_to_user_id] || 'Unknown Technician') : 'Unassigned',
          status: job.status === 'in_progress' ? 'in_progress' : 
                  job.status === 'completed' ? 'completed' :
                  job.status === 'assigned' ? 'scheduled' : 'pending',
          created_at: job.created_at,
          budget: 0, // No budget field in job_requests, could be added later
          category: job.job_type || 'General',
          description: job.description || '',
        };
      });

      // Extract unique properties from the jobs
      const uniqueProperties = Array.from(new Set(
        transformedJobs.map(job => job.property).filter(property => property !== 'Unknown Property')
      ));

      setData({
        jobs: transformedJobs,
        properties: uniqueProperties,
        loading: false,
      });

      console.log('Property job tracking data loaded:', {
        jobsCount: transformedJobs.length,
        propertiesCount: uniqueProperties.length
      });

    } catch (error) {
      console.error('Error in usePropertyJobTracking:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchJobs();

    // Set up real-time subscription
    const channel = supabase
      .channel('property-job-tracking')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_requests' }, fetchJobs)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return data;
};