
import { useState, useEffect } from 'react';
import { useHandymanData } from './useHandymanData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SyncStatus {
  isLoading: boolean;
  lastSync: Date | null;
  error: string | null;
  hasUnsavedChanges: boolean;
}

export const useHandymanSync = () => {
  const { data: handymanData, loading, refreshData } = useHandymanData();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isLoading: false,
    lastSync: null,
    error: null,
    hasUnsavedChanges: false
  });

  // Update sync status when data loads
  useEffect(() => {
    if (!loading && handymanData) {
      setSyncStatus(prev => ({
        ...prev,
        lastSync: new Date(),
        error: null,
        hasUnsavedChanges: false
      }));
    }
  }, [loading, handymanData]);

  const syncSkillRates = async (skillRates: any[]) => {
    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Syncing skill rates:', skillRates);
      
      const { error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'update_skill_rates', 
          skillRates: skillRates 
        }
      });

      if (error) throw error;

      await refreshData();
      setSyncStatus(prev => ({ 
        ...prev, 
        lastSync: new Date(),
        hasUnsavedChanges: false 
      }));
      
      toast.success('Skills synchronized successfully');
      return { success: true };
    } catch (error) {
      console.error('Error syncing skill rates:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSyncStatus(prev => ({ ...prev, error: errorMessage }));
      toast.error(`Failed to sync skills: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setSyncStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const syncServicePricing = async (servicePricing: any[]) => {
    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Syncing service pricing:', servicePricing);
      
      const { error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'update_service_pricing', 
          servicePricing: servicePricing 
        }
      });

      if (error) throw error;

      await refreshData();
      setSyncStatus(prev => ({ 
        ...prev, 
        lastSync: new Date(),
        hasUnsavedChanges: false 
      }));
      
      toast.success('Service pricing synchronized successfully');
      return { success: true };
    } catch (error) {
      console.error('Error syncing service pricing:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSyncStatus(prev => ({ ...prev, error: errorMessage }));
      toast.error(`Failed to sync pricing: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setSyncStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const syncWorkAreas = async (workAreas: any[]) => {
    setSyncStatus(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Syncing work areas:', workAreas);
      
      const { error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'update_work_areas', 
          areas: workAreas 
        }
      });

      if (error) throw error;

      await refreshData();
      setSyncStatus(prev => ({ 
        ...prev, 
        lastSync: new Date(),
        hasUnsavedChanges: false 
      }));
      
      toast.success('Work areas synchronized successfully');
      return { success: true };
    } catch (error) {
      console.error('Error syncing work areas:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSyncStatus(prev => ({ ...prev, error: errorMessage }));
      toast.error(`Failed to sync work areas: ${errorMessage}`);
      return { success: false, error: errorMessage };
    } finally {
      setSyncStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  const markUnsavedChanges = () => {
    setSyncStatus(prev => ({ ...prev, hasUnsavedChanges: true }));
  };

  const clearError = () => {
    setSyncStatus(prev => ({ ...prev, error: null }));
  };

  const forceRefresh = async () => {
    setSyncStatus(prev => ({ ...prev, isLoading: true }));
    try {
      await refreshData();
      setSyncStatus(prev => ({ 
        ...prev, 
        lastSync: new Date(),
        error: null 
      }));
      toast.success('Data refreshed successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh data';
      setSyncStatus(prev => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setSyncStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  return {
    handymanData,
    loading: loading || syncStatus.isLoading,
    syncStatus,
    syncSkillRates,
    syncServicePricing,
    syncWorkAreas,
    markUnsavedChanges,
    clearError,
    forceRefresh,
    refreshData
  };
};
