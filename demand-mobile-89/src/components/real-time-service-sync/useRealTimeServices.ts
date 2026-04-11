import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';
import { toast } from 'sonner';
import type { HandymanService, ServiceCategory } from './types';

export const useRealTimeServices = () => {
  const [activeServices, setActiveServices] = useState<HandymanService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate total subcategories available
  const totalSubcategories = expandedServiceCategories.reduce((total, category) => {
    return total + category.subcategories.length;
  }, 0);

  // Fetch handyman services with fallback to direct database queries
  const fetchHandymanServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('RealTimeServiceSync: Starting to fetch handyman services...');
      
      // Try edge function first
      try {
        const { data: professionalsData, error: professionalsError } = await supabase.functions.invoke('get-professionals', {
          body: {
            type: 'handyman',
            includeServicePricing: true,
            includeSkillRates: false
          }
        });

        console.log('RealTimeServiceSync: Response received:', { professionalsData, professionalsError });

        if (professionalsError) {
          throw professionalsError;
        }

        if (professionalsData && professionalsData.length > 0) {
          processHandymanData(professionalsData);
          return;
        }
      } catch (edgeFunctionError) {
        console.log('RealTimeServiceSync: Edge function failed, trying direct database query:', edgeFunctionError);
        
        // Fallback to direct database query
        await fetchHandymanServicesDirectly();
        return;
      }

      // If no data from edge function, try direct query
      await fetchHandymanServicesDirectly();

    } catch (error) {
      console.error('RealTimeServiceSync: Error in fetchHandymanServices:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load handyman services';
      setError(errorMessage);
      
      // Don't show error toast immediately, try fallback first
      await fetchHandymanServicesDirectly();
    } finally {
      setLoading(false);
    }
  };

  // Direct database query fallback
  const fetchHandymanServicesDirectly = async () => {
    try {
      console.log('RealTimeServiceSync: Fetching directly from database...');
      
      // Get active handymen with service pricing
      const { data: handymenData, error: handymenError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          average_rating,
          total_ratings,
          account_status,
          subscription_status
        `)
        .eq('user_role', 'handyman')
        .eq('account_status', 'active')
        .in('subscription_status', ['active', 'trialing']);

      if (handymenError) {
        throw handymenError;
      }

      if (!handymenData || handymenData.length === 0) {
        setActiveServices([]);
        console.log('RealTimeServiceSync: No active handymen found');
        return;
      }

      // Get service pricing for these handymen
      const handymanIds = handymenData.map(h => h.id);
      const { data: pricingData, error: pricingError } = await supabase
        .from('handyman_service_pricing')
        .select('*')
        .in('user_id', handymanIds)
        .eq('is_active', true);

      if (pricingError) {
        throw pricingError;
      }

      // Combine handyman and pricing data
      const professionalsWithPricing = handymenData.map(handyman => ({
        ...handyman,
        service_pricing: pricingData?.filter(p => p.user_id === handyman.id) || []
      }));

      processHandymanData(professionalsWithPricing);
      console.log('RealTimeServiceSync: Successfully fetched data from database');

    } catch (dbError) {
      console.error('RealTimeServiceSync: Database query failed:', dbError);
      setError('Unable to load handyman services');
      toast.error('Unable to load handyman services. Please try again later.');
    }
  };

  // Process handyman data into services
  const processHandymanData = (professionalsData: any[]) => {
    const activeServiceData: HandymanService[] = [];

    professionalsData.forEach((professional: any) => {
      if (professional.service_pricing && professional.service_pricing.length > 0) {
        professional.service_pricing.forEach((pricing: any) => {
          if (!pricing.is_active) return;

          const category = expandedServiceCategories.find(cat => cat.id === pricing.category_id);
          const subcategory = pricing.subcategory_id 
            ? category?.subcategories?.find(sub => sub.id === pricing.subcategory_id)
            : null;

          const serviceItem: HandymanService = {
            id: `${professional.id}-${pricing.category_id}-${pricing.subcategory_id || 'main'}`,
            user_id: professional.id,
            category_id: pricing.category_id,
            subcategory_id: pricing.subcategory_id,
            base_price: pricing.base_price || 0,
            custom_price: pricing.custom_price,
            same_day_multiplier: pricing.same_day_multiplier || 1.5,
            emergency_multiplier: pricing.emergency_multiplier || 2.0,
            is_active: pricing.is_active,
            handyman_name: professional.full_name || `Handyman ${professional.id.slice(0, 8)}`,
            handyman_rating: professional.average_rating || 0,
            handyman_reviews: professional.total_ratings || 0,
            category_name: category?.name || pricing.category_id,
            subcategory_name: subcategory?.name || undefined
          };

          activeServiceData.push(serviceItem);
        });
      }
    });

    setActiveServices(activeServiceData);
  };

  // Set up real-time subscription with error handling
  useEffect(() => {
    fetchHandymanServices();

    const subscription = supabase
      .channel(`handyman-service-pricing-sync-${Date.now()}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'handyman_service_pricing'
        },
        (payload) => {
          console.log('RealTimeServiceSync: Real-time update received:', payload);
          // Debounce updates to avoid too many refreshes
          setTimeout(() => {
            fetchHandymanServices();
          }, 1000);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'user_role=eq.handyman'
        },
        (payload) => {
          console.log('RealTimeServiceSync: Handyman profile update received:', payload);
          setTimeout(() => {
            fetchHandymanServices();
          }, 1000);
        }
      )
      .subscribe((status) => {
        console.log('RealTimeServiceSync: Subscription status:', status);
        if (status === 'CHANNEL_ERROR') {
          console.log('RealTimeServiceSync: Channel error, retrying...');
          setTimeout(() => {
            fetchHandymanServices();
          }, 5000);
        }
      });

    return () => {
      try {
        supabase.removeChannel(subscription);
      } catch (error) {
        console.log('RealTimeServiceSync: Error removing subscription:', error);
      }
    };
  }, []);

  // Group services by category
  const serviceCategories: ServiceCategory[] = expandedServiceCategories
    .map(category => {
      const categoryServices = activeServices.filter(service => service.category_id === category.id);
      if (categoryServices.length === 0) return null;

      const avgPrice = categoryServices.reduce((sum, s) => sum + (s.custom_price || s.base_price), 0) / categoryServices.length;

      return {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color,
        services: categoryServices,
        avgPrice: Math.round(avgPrice)
      };
    })
    .filter(Boolean) as ServiceCategory[];

  return {
    activeServices,
    serviceCategories,
    loading,
    error,
    totalSubcategories,
    fetchHandymanServices
  };
};