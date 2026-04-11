import { useState, useEffect, useMemo } from 'react';
import { useHandymanData } from '@/hooks/useHandymanData';
import { useProfile } from '../../../handyman/profile/ProfileProvider';
import { toast } from 'sonner';
import { ProcessedSkillsData, SkillsAndPricingState } from '../types';

export const useSkillsAndPricingData = () => {
  const { isEditing, setIsEditing } = useProfile();
  const { data: handymanData, loading, refreshData } = useHandymanData();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncingToCustomer, setSyncingToCustomer] = useState(false);

  // Load data on component mount and set sync time
  useEffect(() => {
    if (!loading && handymanData) {
      setLastSyncTime(new Date());
      setSyncError(null);
    }
  }, [loading, handymanData]);

  // Process skills and services data
  const processedData: ProcessedSkillsData = useMemo(() => {
    const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
    
    const activeCategoryServices = handymanData.servicePricing?.filter(service => 
      service.is_active && !service.subcategory_id
    ) || [];
    
    const allActiveServices = handymanData.servicePricing?.filter(service => service.is_active) || [];
    
    const skillsByLevel = activeSkills.reduce((acc, skill) => {
      const level = skill.experience_level || 'Intermediate';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      activeSkills: activeSkills.map(skill => ({
        categoryId: 'skill',
        skillName: skill.skill_name,
        experienceLevel: (skill.experience_level || 'Intermediate') as 'Beginner' | 'Intermediate' | 'Expert',
        isActive: skill.is_active
      })),
      activeCategoryServices: activeCategoryServices.map(service => ({
        categoryId: service.category_id,
        subcategoryId: service.subcategory_id,
        basePrice: service.base_price,
        customPrice: service.custom_price,
        isActive: service.is_active,
        sameDayMultiplier: service.same_day_multiplier,
        emergencyMultiplier: service.emergency_multiplier
      })),
      allActiveServices: allActiveServices.map(service => ({
        categoryId: service.category_id,
        subcategoryId: service.subcategory_id,
        basePrice: service.base_price,
        customPrice: service.custom_price,
        isActive: service.is_active,
        sameDayMultiplier: service.same_day_multiplier,
        emergencyMultiplier: service.emergency_multiplier
      })),
      skillsByLevel
    };
  }, [handymanData]);

  // Event handlers
  const handleRefresh = () => {
    refreshData();
    toast.success('Data refreshed successfully');
  };

  const handleDiscardChanges = () => {
    refreshData();
    setIsEditing(false);
    setSyncError(null);
    toast.info('Changes discarded');
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast.success('Changes saved successfully');
  };

  const state: SkillsAndPricingState = {
    activeTab,
    setActiveTab,
    lastSyncTime,
    setLastSyncTime,
    syncError,
    setSyncError,
    syncingToCustomer,
    setSyncingToCustomer
  };

  return {
    // Data
    handymanData,
    loading,
    processedData,
    
    // State
    ...state,
    isEditing,
    setIsEditing,
    
    // Actions
    handleRefresh,
    handleDiscardChanges,
    handleSaveChanges,
    refreshData
  };
};