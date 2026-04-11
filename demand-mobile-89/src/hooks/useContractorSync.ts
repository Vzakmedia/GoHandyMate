import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

interface ContractorStats {
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  pendingJobs: number;
}

export const useContractorSync = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const syncData = useCallback(async (operation: string, data?: any) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to perform this action.",
        variant: "destructive",
      });
      return null;
    }

    setLoading(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('contractor-sync', {
        body: {
          operation,
          data,
          contractorId: user.id
        }
      });

      if (error) {
        console.error('Contractor sync error:', error);
        throw error;
      }

      return result;
    } catch (error) {
      console.error('Contractor sync error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateProfile = async (data: {
    ownerName?: string;
    businessName?: string;
    profileImage?: string;
  }) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      console.log('Updating contractor profile:', data);

      // First update the profiles table directly
      const profileUpdateData: any = {
        updated_at: new Date().toISOString()
      };

      if (data.ownerName) {
        profileUpdateData.full_name = data.ownerName;
      }

      if (data.profileImage) {
        profileUpdateData.avatar_url = data.profileImage;
      }

      // Update owner name and profile image in profiles table
      // Business name will be handled in business_profiles table

      console.log('Updating profiles table with:', profileUpdateData);

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error(`Profile update failed: ${profileError.message}`);
      }

      console.log('Profile table updated successfully');

      // Now handle business name in business_profiles table
      if (data.businessName) {
        console.log('Updating business profile with business name:', data.businessName);
        const { error: businessError } = await supabase
          .from('business_profiles')
          .upsert({
            user_id: user.id,
            business_name: data.businessName,
            contact_email: user.email || 'contact@business.com',
            updated_at: new Date().toISOString()
          });

        if (businessError) {
          console.warn('Business profile update warning:', businessError);
        } else {
          console.log('Business profile updated successfully');
        }
      }

      // Also call the contractor sync function for additional processing
      try {
        const { data: result, error: syncError } = await supabase.functions.invoke('contractor-sync', {
          body: { 
            operation: 'update_profile',
            data: {
              ownerName: data.ownerName,
              businessName: data.businessName,
              profileImage: data.profileImage,
            }
          }
        });

        if (syncError) {
          console.warn('Contractor sync warning (profile still updated):', syncError);
        } else {
          console.log('Contractor sync completed:', result);
        }
      } catch (syncError) {
        console.warn('Contractor sync failed (profile still updated):', syncError);
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating contractor profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createQuote = async (quoteData: any) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('contractor-sync', {
        body: { 
          operation: 'create_quote',
          data: quoteData
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const syncProjects = async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('contractor-sync', {
        body: { 
          operation: 'sync_projects'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error syncing projects:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStatistics = async () => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('contractor-sync', {
        body: { 
          operation: 'get_statistics'
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAvailability = useCallback(async (availabilityData: any) => {
    if (!availabilityData || !availabilityData.availability) {
      toast({
        title: "Validation Error",
        description: "Availability data is required.",
        variant: "destructive",
      });
      return { success: false, error: "Missing availability data" };
    }
    return await syncData('update_availability', availabilityData);
  }, [syncData, toast]);

  const saveMaterialsEstimate = useCallback(async (materialsData: any) => {
    return await syncData('save_materials_estimate', materialsData);
  }, [syncData]);

  const addTeamMember = useCallback(async (memberData: any) => {
    if (!memberData || !memberData.name || !memberData.role) {
      toast({
        title: "Validation Error",
        description: "Name and role are required for team members.",
        variant: "destructive",
      });
      return { success: false, error: "Missing required fields" };
    }
    return await syncData('add_team_member', memberData);
  }, [syncData, toast]);

  const updateTeamMember = useCallback(async (memberId: string, memberData: any) => {
    if (!memberId) {
      toast({
        title: "Validation Error",
        description: "Member ID is required.",
        variant: "destructive",
      });
      return { success: false, error: "Missing member ID" };
    }
    return await syncData('update_team_member', { id: memberId, ...memberData });
  }, [syncData, toast]);

  const removeTeamMember = useCallback(async (memberId: string) => {
    if (!memberId) {
      toast({
        title: "Validation Error",
        description: "Member ID is required.",
        variant: "destructive",
      });
      return { success: false, error: "Missing member ID" };
    }
    return await syncData('remove_team_member', { id: memberId });
  }, [syncData, toast]);

  const getTeamMembers = useCallback(async () => {
    return await syncData('get_team_members');
  }, [syncData]);

  const addProject = useCallback(async (projectData: any) => {
    if (!projectData || !projectData.title || !projectData.client || !projectData.startDate) {
      toast({
        title: "Validation Error",
        description: "Title, client, and start date are required.",
        variant: "destructive",
      });
      return { success: false, error: "Missing required fields" };
    }
    return await syncData('add_project', projectData);
  }, [syncData, toast]);

  const getProjects = useCallback(async () => {
    return await syncData('get_projects');
  }, [syncData]);

  const addSafetyIncident = useCallback(async (incidentData: any) => {
    if (!incidentData || !incidentData.type || !incidentData.description || !incidentData.location) {
      toast({
        title: "Validation Error",
        description: "Type, description, and location are required.",
        variant: "destructive",
      });
      return { success: false, error: "Missing required fields" };
    }
    return await syncData('add_safety_incident', incidentData);
  }, [syncData, toast]);

  const getSafetyIncidents = useCallback(async () => {
    return await syncData('get_safety_incidents');
  }, [syncData]);

  const updateChecklistProgress = useCallback(async (progressData: any) => {
    return await syncData('update_checklist_progress', progressData);
  }, [syncData]);

  return {
    updateProfile,
    createQuote,
    syncProjects,
    getStatistics,
    updateAvailability,
    saveMaterialsEstimate,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    getTeamMembers,
    addProject,
    getProjects,
    addSafetyIncident,
    getSafetyIncidents,
    updateChecklistProgress,
    loading
  };
};
