
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PreviousTechnician } from './types';

export const usePreviousTechnicians = () => {
  const { user } = useAuth();
  const [previousTechnicians, setPreviousTechnicians] = useState<PreviousTechnician[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPreviousTechnicians = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching previous technicians for user:', user.id);
      
      // Get job requests where this customer worked with technicians
      const { data: jobRequests, error: jobError } = await supabase
        .from('job_requests')
        .select('*')
        .eq('customer_id', user.id)
        .not('assigned_to_user_id', 'is', null)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false });

      if (jobError) {
        console.error('Error fetching job requests:', jobError);
        throw jobError;
      }

      console.log('Job requests found:', jobRequests?.length || 0);

      if (!jobRequests || jobRequests.length === 0) {
        console.log('No completed job requests found');
        setPreviousTechnicians([]);
        setLoading(false);
        return;
      }

      // Get unique technician IDs
      const technicianIds = [...new Set(jobRequests.map(job => job.assigned_to_user_id).filter(Boolean))];
      console.log('Unique technician IDs:', technicianIds);

      if (technicianIds.length === 0) {
        console.log('No technician IDs found');
        setPreviousTechnicians([]);
        setLoading(false);
        return;
      }

      // Fetch profiles and handyman data
      const { data: allProfiles, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, user_role')
        .in('id', technicianIds);

      // Use secure function to get handyman data (without personal contact info)
      const { data: handymanData, error: handymanError } = await supabase
        .rpc('get_public_handyman_profiles')
        .then(result => ({
          data: result.data?.filter((h: any) => technicianIds.includes(h.user_id)),
          error: result.error
        }));

      console.log('Profiles:', allProfiles, 'Handyman data:', handymanData);

      // Create technician objects from available data
      const technicianMap = new Map();
      
      jobRequests.forEach((job: any) => {
        const techId = job.assigned_to_user_id;
        if (!techId) return;

        const profile = allProfiles?.find(p => p.id === techId);
        const handymanInfo = handymanData?.find(h => h.user_id === techId);
        const technicianName = profile?.full_name || handymanInfo?.full_name || `Technician ${techId.slice(0, 8)}`;
        const skills = handymanInfo?.skills || [];

        if (!technicianMap.has(techId)) {
          technicianMap.set(techId, {
            id: techId,
            full_name: technicianName,
            avatar_url: profile?.avatar_url || null,
            rating: 4.5 + Math.random() * 0.5,
            last_service: job.title || 'Service',
            last_service_date: job.updated_at,
            total_jobs: 1,
            skills: skills,
            jobs: [job]
            // Note: email no longer exposed for security reasons
          });
        } else {
          const existing = technicianMap.get(techId);
          existing.total_jobs += 1;
          existing.jobs.push(job);
          if (new Date(job.updated_at) > new Date(existing.last_service_date)) {
            existing.last_service = job.title || 'Service';
            existing.last_service_date = job.updated_at;
          }
        }
      });

      // Convert to array and add recommendation logic
      const technicians = Array.from(technicianMap.values()).map((tech: any) => ({
        ...tech,
        isRecommended: tech.total_jobs >= 2 && tech.rating >= 4.5
      }));

      // Sort by total jobs and rating
      technicians.sort((a, b) => {
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        return b.total_jobs - a.total_jobs || b.rating - a.rating;
      });

      console.log('Final technicians list:', technicians);
      setPreviousTechnicians(technicians);
    } catch (error) {
      console.error('Error fetching previous technicians:', error);
      toast.error('Failed to load previous technicians');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousTechnicians();
  }, [user]);

  return { previousTechnicians, loading };
};
