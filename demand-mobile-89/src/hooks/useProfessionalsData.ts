import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional } from '@/types/professional';

export const useProfessionalsData = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProfessionals = useCallback(async (
    type: 'handyman' | 'all' = 'all',
    userLocation?: { lat: number; lng: number } | null
  ) => {
    try {
      setLoading(true);
      console.log('useProfessionalsData - fetching professionals:', { type, userLocation });

      // Try edge function first
      try {
        const requestBody: any = {
          type: type, // Use the actual type instead of forcing to handyman
          includeServicePricing: true,
          includeSkillRates: true
        };

        if (userLocation && userLocation.lat && userLocation.lng) {
          requestBody.lat = userLocation.lat.toString();
          requestBody.lng = userLocation.lng.toString();
          requestBody.radius = '80';
        }

        const { data, error } = await supabase.functions.invoke('get-professionals', {
          body: requestBody
        });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          const enriched = data.map(professional => ({
            ...professional,
            hasRealtimePricing: professional.service_pricing && professional.service_pricing.length > 0,
            experienceYears: professional.handyman_data?.years_experience || 2,
            completedJobs: 0,
            isSponsored: false,
            isOnline: true
          }));

          setProfessionals(enriched);
          console.log('useProfessionalsData - edge function success:', enriched.length);
          return;
        }
      } catch (edgeFunctionError) {
        console.log('useProfessionalsData - edge function failed, using fallback:', edgeFunctionError);
      }

      // Fallback to direct database query
      await fetchProfessionalsDirectly(type, userLocation);

    } catch (error) {
      console.error('Error fetching professionals:', error);
      setProfessionals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProfessionalsDirectly = async (
    type: 'handyman' | 'all',
    userLocation?: { lat: number; lng: number } | null
  ) => {
    console.log('useProfessionalsData - fetching directly from database...');

    const userRoles = ['handyman'];

    const { data: professionalsData, error: professionalsError } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        avatar_url,
        average_rating,
        total_ratings,
        account_status,
        subscription_status,
        user_role,
        created_at,
        address,
        city,
        zip_code
      `)
      .in('user_role', userRoles)
      .eq('account_status', 'active')
      .in('subscription_status', ['active', 'trialing']);

    if (professionalsError) {
      throw professionalsError;
    }

    if (!professionalsData || professionalsData.length === 0) {
      setProfessionals([]);
      return;
    }

    // Get additional data for handymen
    const handymanIds = professionalsData.filter(p => p.user_role === 'handyman').map(p => p.id);
    
    let pricingData = [];
    let skillsData = [];

    if (handymanIds.length > 0) {
      const [pricingResult, skillsResult] = await Promise.all([
        supabase
          .from('handyman_service_pricing')
          .select('*')
          .in('user_id', handymanIds)
          .eq('is_active', true),
        supabase
          .from('handyman_skill_rates')
          .select('*')
          .in('user_id', handymanIds)
          .eq('is_active', true)
      ]);

      pricingData = pricingResult.data || [];
      skillsData = skillsResult.data || [];
    }

    // Combine all data
    const enrichedProfessionals = professionalsData.map(professional => ({
      ...professional,
      user_role: 'handyman' as const,
      rating: professional.average_rating || 0,
      reviewCount: professional.total_ratings || 0,
      experienceYears: 2, // Default fallback
      completedJobs: 0,
      isSponsored: false,
      isOnline: true,
      updated_at: professional.created_at || new Date().toISOString(),
      responseTime: '30 minutes',
      averageRate: 75,
      service_pricing: professional.user_role === 'handyman' 
        ? pricingData.filter(p => p.user_id === professional.id)
        : [],
      skill_rates: professional.user_role === 'handyman'
        ? skillsData.filter(s => s.user_id === professional.id)
        : [],
      hasRealtimePricing: professional.user_role === 'handyman' 
        ? pricingData.some(p => p.user_id === professional.id)
        : false,
      distance: userLocation ? Math.random() * 80 : undefined // Mock distance
    })) as Professional[];

    setProfessionals(enrichedProfessionals);
    console.log('useProfessionalsData - database fallback success:', enrichedProfessionals.length);
  };

  return {
    professionals,
    loading,
    fetchProfessionals
  };
};