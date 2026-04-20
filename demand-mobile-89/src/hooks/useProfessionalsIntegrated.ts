import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional } from '@/types/professional';
import { MOCK_PROFESSIONALS } from '@/mocks/mockProfessionals';

interface UseProfessionalsIntegratedProps {
  serviceCategory?: string;
  maxResults?: number;
  userLocation?: { lat: number; lng: number } | null;
  selectedType?: 'handyman' | 'all';
}

export const useProfessionalsIntegrated = ({
  serviceCategory,
  maxResults = 20,
  userLocation,
  selectedType = 'all'
}: UseProfessionalsIntegratedProps) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasLocation, setHasLocation] = useState(false);
  const [pricingData, setPricingData] = useState<any[]>([]);

  const fetchProfessionals = useCallback(async () => {
    try {
      setLoading(true);

      console.log('useProfessionalsIntegrated - using MOCK DATA with params:', {
        serviceCategory,
        userLocation,
        maxResults,
        selectedType
      });

      // Use mock data instead of calling Supabase
      let enrichedData = [...MOCK_PROFESSIONALS];

      // Map mock data and apply distance
      enrichedData = enrichedData.map(professional => ({
        ...professional,
        distance: userLocation ? Math.random() * 10 : undefined
      }));

      // Apply type filtering
      if (selectedType !== 'all') {
        enrichedData = enrichedData.filter(p => p.user_role === selectedType);
      }

      // Apply service filtering
      if (serviceCategory && serviceCategory.trim()) {
        const query = serviceCategory.toLowerCase();
        enrichedData = enrichedData.filter(p =>
          p.service_pricing?.some(pr => pr.category_id?.toLowerCase().includes(query) || pr.subcategory_id?.toLowerCase().includes(query)) ||
          p.skill_rates?.some(s => s.skill_name?.toLowerCase().includes(query))
        );
      }

      // Extract pricing data for the whole list
      const allPricingData: any[] = [];
      enrichedData.forEach(professional => {
        if (professional.service_pricing && professional.service_pricing.length > 0) {
          professional.service_pricing.forEach(pricing => {
            if (pricing.is_active) {
              allPricingData.push({
                handyman_id: professional.id,
                handyman_name: professional.full_name,
                category_id: pricing.category_id,
                subcategory_id: pricing.subcategory_id,
                base_price: pricing.base_price,
                custom_price: pricing.custom_price,
                same_day_multiplier: 1.5,
                emergency_multiplier: 2.0,
                is_active: pricing.is_active,
                distance_miles: professional.distance || 0,
                rating: professional.rating || 0,
                reviews_count: professional.reviewCount || 0,
                availability: 'available'
              });
            }
          });
        }
      });

      setPricingData(allPricingData);

      // Sort results
      enrichedData.sort((a, b) => {
        const aHasPricing = a.service_pricing && a.service_pricing.length > 0;
        const bHasPricing = b.service_pricing && b.service_pricing.length > 0;

        if (aHasPricing && !bHasPricing) return -1;
        if (!aHasPricing && bHasPricing) return 1;

        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }

        return 0;
      });

      // Add flags
      const finalResults = enrichedData.map(p => ({
        ...p,
        hasRealtimePricing: p.service_pricing && p.service_pricing.length > 0,
        realtimePricing: p.service_pricing
      }));

      // Limit results
      const limitedResults = maxResults ? finalResults.slice(0, maxResults) : finalResults;
      setProfessionals(limitedResults);

      console.log('useProfessionalsIntegrated - mock data loaded:', limitedResults.length);

    } catch (error) {
      console.error('Error in useProfessionalsIntegrated (Mock Mode):', error);
      setProfessionals([]);
      setPricingData([]);
    } finally {
      setLoading(false);
    }
  }, [serviceCategory, maxResults, userLocation?.lat, userLocation?.lng, selectedType]);

  // Direct database query fallback
  const fetchProfessionalsDirectly = async () => {
    console.log('useProfessionalsIntegrated - fetching directly from database...');

    let query = supabase
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
        created_at,
        address,
        city,
        zip_code,
        user_role
      `)
      .eq('account_status', 'active')
      .in('subscription_status', ['active', 'trialing']);

    // Only fetch handymen (contractor role archived)
    query = query.eq('user_role', 'handyman');

    const { data: handymenData, error: handymenError } = await query;

    if (handymenError) {
      throw handymenError;
    }

    if (!handymenData || handymenData.length === 0) {
      return [];
    }

    // Get service pricing and skill rates for these handymen
    const handymanIds = handymenData.map(h => h.id);

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

    const pricingData = pricingResult.data || [];
    const skillsData = skillsResult.data || [];

    // Combine all data
    const enrichedHandymen = handymenData.map(handyman => ({
      ...handyman,
      rating: handyman.average_rating || 0,
      reviewCount: handyman.total_ratings || 0,
      experienceYears: 2, // Default fallback
      completedJobs: 0,
      isSponsored: false,
      isOnline: true,
      service_pricing: pricingData.filter(p => p.user_id === handyman.id),
      skill_rates: skillsData.filter(s => s.user_id === handyman.id),
      distance: userLocation ? Math.random() * 50 : undefined // Mock distance if location available
    }));

    // Filter by service category if specified
    if (serviceCategory && serviceCategory.trim()) {
      const filteredByService = enrichedHandymen.filter(handyman => {
        // Check service pricing
        const hasMatchingPricing = handyman.service_pricing.some(pricing =>
          pricing.category_id && pricing.category_id.toLowerCase().includes(serviceCategory.toLowerCase())
        );

        // Check skill rates
        const hasMatchingSkill = handyman.skill_rates.some(skill =>
          skill.skill_name && skill.skill_name.toLowerCase().includes(serviceCategory.toLowerCase())
        );

        return hasMatchingPricing || hasMatchingSkill;
      });

      console.log('useProfessionalsIntegrated - filtered by service:', filteredByService.length, 'of', enrichedHandymen.length);
      return filteredByService;
    }

    return enrichedHandymen;
  };

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  // Disabled real-time subscriptions to prevent network errors
  useEffect(() => {
    console.log('useProfessionalsIntegrated - real-time subscriptions disabled (Mock Mode)');
  }, []);

  // Listen for location-based refresh events
  useEffect(() => {
    const handleRefetch = () => {
      console.log('useProfessionalsIntegrated - refetching due to location change');
      fetchProfessionals();
    };

    window.addEventListener('refetch-professionals', handleRefetch);
    return () => window.removeEventListener('refetch-professionals', handleRefetch);
  }, [fetchProfessionals]);

  return {
    professionals,
    loading,
    hasLocation,
    pricingData,
    refetch: fetchProfessionals
  };
};