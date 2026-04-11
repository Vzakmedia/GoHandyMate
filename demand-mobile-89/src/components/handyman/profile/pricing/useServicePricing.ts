
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useHandymanData } from '@/hooks/useHandymanData';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';
import { ServicePricing } from '../types/pricing';

export const useServicePricing = () => {
  const { user } = useAuth();
  const { refreshData } = useHandymanData();
  const [servicePricing, setServicePricing] = useState<ServicePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadServicePricing();
    }
  }, [user]);

  const loadServicePricing = async () => {
    try {
      console.log('ServiceCategoryPricing: Loading service pricing via direct query...');
      
      // Use direct Supabase query instead of edge function
      const { data, error } = await supabase
        .from('handyman_service_pricing')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('ServiceCategoryPricing: Error loading pricing:', error);
        throw error;
      }

      console.log('ServiceCategoryPricing: Raw data received:', data);

      // Initialize with default pricing from categories
      const initialPricing: ServicePricing[] = [];
      
      expandedServiceCategories.forEach(category => {
        // Add category pricing
        const existingCategoryPricing = data?.find(
          (p: any) => p.category_id === category.id && !p.subcategory_id
        );
        
        initialPricing.push({
          categoryId: category.id,
          basePrice: existingCategoryPricing?.base_price || 100,
          isActive: existingCategoryPricing ? Boolean(existingCategoryPricing.is_active) : false,
          customPrice: existingCategoryPricing?.custom_price ? Number(existingCategoryPricing.custom_price) : undefined,
          sameDayMultiplier: existingCategoryPricing?.same_day_multiplier || 1.5,
          emergencyMultiplier: existingCategoryPricing?.emergency_multiplier || 2.0
        });

        // Add subcategory pricing
        category.subcategories.forEach(subcategory => {
          const existingSubPricing = data?.find(
            (p: any) => p.category_id === category.id && p.subcategory_id === subcategory.id
          );
          
          initialPricing.push({
            categoryId: category.id,
            subcategoryId: subcategory.id,
            basePrice: existingSubPricing?.base_price || 50,
            isActive: existingSubPricing ? Boolean(existingSubPricing.is_active) : false,
            customPrice: existingSubPricing?.custom_price ? Number(existingSubPricing.custom_price) : undefined,
            sameDayMultiplier: existingSubPricing?.same_day_multiplier || 1.5,
            emergencyMultiplier: existingSubPricing?.emergency_multiplier || 2.0
          });
        });
      });

      console.log('ServiceCategoryPricing: Setting initial pricing:', initialPricing);
      setServicePricing(initialPricing);
    } catch (error) {
      console.error('ServiceCategoryPricing: Error loading service pricing:', error);
      toast.error('Failed to load service pricing');
    } finally {
      setLoading(false);
    }
  };

  const saveServicePricing = async () => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }
    
    setSaving(true);
    console.log('ServiceCategoryPricing: Starting save operation...');
    console.log('ServiceCategoryPricing: Current servicePricing state:', servicePricing);
    
    try {
      // Filter only active services and prepare data with proper value handling
      const activeServices = servicePricing
        .filter(service => service.isActive)
        .map(service => {
          // Ensure customPrice is properly handled - convert to number or null
          let customPriceValue = null;
          if (service.customPrice !== undefined && service.customPrice !== null && !isNaN(Number(service.customPrice))) {
            customPriceValue = Number(service.customPrice);
          }

          return {
            category_id: service.categoryId,
            subcategory_id: service.subcategoryId || null,
            base_price: Number(service.basePrice) || 0,
            custom_price: customPriceValue,
            is_active: service.isActive,
            same_day_multiplier: Number(service.sameDayMultiplier) || 1.5,
            emergency_multiplier: Number(service.emergencyMultiplier) || 2.0,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        });
      
      console.log('ServiceCategoryPricing: Sending active services:', activeServices);
      
      // First, delete existing records
      const { error: deleteError } = await supabase
        .from('handyman_service_pricing')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('ServiceCategoryPricing: Delete error:', deleteError);
        throw deleteError;
      }

      // Then insert new records if there are any
      if (activeServices.length > 0) {
        const { data, error } = await supabase
          .from('handyman_service_pricing')
          .insert(activeServices)
          .select();

        console.log('ServiceCategoryPricing: Save response:', { data, error });

        if (error) {
          console.error('ServiceCategoryPricing: Save error:', error);
          throw error;
        }
      }

      console.log('ServiceCategoryPricing: Save successful');
      toast.success('Service pricing updated successfully!');
      
      // Refresh the handyman data to sync with other components
      refreshData();
    } catch (error) {
      console.error('ServiceCategoryPricing: Error saving service pricing:', error);
      toast.error(`Failed to save service pricing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const updateServicePricing = (categoryId: string, subcategoryId: string | undefined, field: keyof ServicePricing, value: any) => {
    console.log('ServiceCategoryPricing: Updating pricing:', { categoryId, subcategoryId, field, value });
    
    setServicePricing(prev => {
      const updated = prev.map(service => {
        if (service.categoryId === categoryId && service.subcategoryId === subcategoryId) {
          let processedValue = value;
          
          // Special handling for customPrice to ensure it's a number or undefined
          if (field === 'customPrice') {
            if (value === null || value === undefined || value === '') {
              processedValue = undefined;
            } else {
              const numValue = Number(value);
              processedValue = isNaN(numValue) ? undefined : numValue;
            }
          }
          
          const updatedService = { ...service, [field]: processedValue };
          console.log('ServiceCategoryPricing: Service updated:', updatedService);
          return updatedService;
        }
        return service;
      });
      console.log('ServiceCategoryPricing: Full pricing state after update:', updated);
      return updated;
    });
  };

  const getCategoryPricing = (categoryId: string) => {
    return servicePricing.find(s => s.categoryId === categoryId && !s.subcategoryId);
  };

  const getSubcategoryPricing = (categoryId: string, subcategoryId: string) => {
    return servicePricing.find(s => s.categoryId === categoryId && s.subcategoryId === subcategoryId);
  };

  const getActiveServicesCount = () => {
    return servicePricing.filter(s => s.isActive).length;
  };

  const getCurrentPrice = (pricing: ServicePricing) => {
    return pricing.customPrice || pricing.basePrice;
  };

  return {
    servicePricing,
    loading,
    saving,
    saveServicePricing,
    updateServicePricing,
    getCategoryPricing,
    getSubcategoryPricing,
    getActiveServicesCount,
    getCurrentPrice
  };
};
