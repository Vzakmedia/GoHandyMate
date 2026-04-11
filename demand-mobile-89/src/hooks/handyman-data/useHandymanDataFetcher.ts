
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HandymanDataResult, HandymanServicePricing, HandymanSkillRate, HandymanWorkArea, HandymanWorkSettings, HandymanAvailabilitySlot } from './types';

export const useHandymanDataFetcher = (userId: string): HandymanDataResult => {
  // Always call all hooks at the top level - never conditionally
  const [data, setData] = useState<{
    servicePricing: HandymanServicePricing[];
    skillRates: HandymanSkillRate[];
    workAreas: HandymanWorkArea[];
    workSettings: HandymanWorkSettings | null;
    availabilitySlots: HandymanAvailabilitySlot[];
  }>({
    servicePricing: [],
    skillRates: [],
    workAreas: [],
    workSettings: null,
    availabilitySlots: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only proceed if we have a valid userId
    if (!userId) {
      setLoading(false);
      setError(null);
      return;
    }

    const fetchHandymanData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('useHandymanDataFetcher: Fetching data for userId:', userId);

        // Get ALL service pricing (both active and inactive) to ensure we have complete data
        const servicePricingResult = await supabase
          .from('handyman_service_pricing')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        console.log('useHandymanDataFetcher: Service pricing query result:', servicePricingResult);

        if (servicePricingResult.error) {
          console.error('useHandymanDataFetcher: Service pricing error:', servicePricingResult.error);
          throw servicePricingResult.error;
        }

        // Get ALL skill rates (both active and inactive) to ensure we have complete data
        const skillRatesResult = await supabase
          .from('handyman_skill_rates')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        console.log('useHandymanDataFetcher: Skill rates query result:', skillRatesResult);

        if (skillRatesResult.error) {
          console.error('useHandymanDataFetcher: Skill rates error:', skillRatesResult.error);
          throw skillRatesResult.error;
        }

        // Fetch all other data in parallel
        const [workAreasResult, workSettingsResult, availabilitySlotsResult] = await Promise.all([
          supabase
            .from('handyman_work_areas')
            .select('*')
            .eq('user_id', userId),
          
          supabase
            .from('handyman_work_settings')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle(),
          
          supabase
            .from('handyman_availability_slots')
            .select('*')
            .eq('user_id', userId)
        ]);

        // Check for errors
        if (workAreasResult.error) throw workAreasResult.error;
        if (workSettingsResult.error) throw workSettingsResult.error;
        if (availabilitySlotsResult.error) throw availabilitySlotsResult.error;

        const fetchedData = {
          servicePricing: servicePricingResult.data || [],
          skillRates: skillRatesResult.data || [],
          workAreas: workAreasResult.data || [],
          workSettings: workSettingsResult.data || null,
          availabilitySlots: availabilitySlotsResult.data || []
        };

        console.log('useHandymanDataFetcher: Final assembled data with actual pricing:', {
          userId,
          servicePricingCount: fetchedData.servicePricing.length,
          skillRatesCount: fetchedData.skillRates.length,
          workAreasCount: fetchedData.workAreas.length,
          hasWorkSettings: !!fetchedData.workSettings,
          availabilitySlotsCount: fetchedData.availabilitySlots.length,
          activePricingCount: fetchedData.servicePricing.filter(s => s.is_active).length,
          activeSkillsCount: fetchedData.skillRates.filter(s => s.is_active).length,
          servicePricingDetails: fetchedData.servicePricing.map(s => ({
            categoryId: s.category_id,
            subcategoryId: s.subcategory_id,
            isActive: s.is_active,
            basePrice: s.base_price,
            customPrice: s.custom_price,
            actualPrice: s.custom_price || s.base_price
          })),
          skillRatesDetails: fetchedData.skillRates.map(s => ({
            skillName: s.skill_name,
            isActive: s.is_active,
            hourlyRate: s.hourly_rate,
            experienceLevel: s.experience_level
          }))
        });

        setData(fetchedData);

      } catch (err) {
        console.error('useHandymanDataFetcher: Error fetching handyman data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch handyman data');
      } finally {
        setLoading(false);
      }
    };

    fetchHandymanData();
  }, [userId]);

  return { data, loading, error };
};
