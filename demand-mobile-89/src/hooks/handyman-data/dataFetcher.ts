
import { supabase } from '@/integrations/supabase/client';
import type { HandymanData } from './types';

export const fetchHandymanData = async (userId: string): Promise<HandymanData> => {
  console.log('fetchHandymanData: Starting fetch for user:', userId);

  if (!userId) {
    console.warn('fetchHandymanData: No userId provided');
    throw new Error('User ID is required');
  }

  try {
    console.log('fetchHandymanData: Making parallel queries...');
    
    // Make queries with proper error handling and retry logic
    const [skillRatesResponse, servicePricingResponse, workAreasResponse, workSettingsResponse, availabilitySlotsResponse] = await Promise.allSettled([
      supabase
        .from('handyman_skill_rates')
        .select('*')
        .eq('user_id', userId)
        .then(response => {
          console.log('fetchHandymanData: Skill rates query response:', response);
          if (response.error) {
            console.error('fetchHandymanData: Skill rates error:', response.error);
          }
          return response;
        }),
      
      supabase
        .from('handyman_service_pricing')
        .select('*')
        .eq('user_id', userId)
        .then(response => {
          console.log('fetchHandymanData: Service pricing query response:', response);
          if (response.error) {
            console.error('fetchHandymanData: Service pricing error:', response.error);
          }
          return response;
        }),
        
      supabase
        .from('handyman_work_areas')
        .select('*')
        .eq('user_id', userId)
        .then(response => {
          console.log('fetchHandymanData: Work areas query response:', response);
          if (response.error) {
            console.error('fetchHandymanData: Work areas error:', response.error);
          }
          return response;
        }),
        
      supabase
        .from('handyman_work_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
        .then(response => {
          console.log('fetchHandymanData: Work settings query response:', response);
          if (response.error) {
            console.error('fetchHandymanData: Work settings error:', response.error);
          }
          return response;
        }),
        
      supabase
        .from('handyman_availability_slots')
        .select('*')
        .eq('user_id', userId)
        .then(response => {
          console.log('fetchHandymanData: Availability slots query response:', response);
          if (response.error) {
            console.error('fetchHandymanData: Availability slots error:', response.error);
          }
          return response;
        })
    ]);

    // Process settled promises and extract data
    const cleanData: HandymanData = {
      skillRates: [],
      servicePricing: [],
      workAreas: [],
      workSettings: null,
      availabilitySlots: []
    };

    // Process skill rates
    if (skillRatesResponse.status === 'fulfilled' && skillRatesResponse.value.data) {
      cleanData.skillRates = skillRatesResponse.value.data;
    } else if (skillRatesResponse.status === 'rejected') {
      console.error('fetchHandymanData: Skill rates query failed:', skillRatesResponse.reason);
    }

    // Process service pricing
    if (servicePricingResponse.status === 'fulfilled' && servicePricingResponse.value.data) {
      cleanData.servicePricing = servicePricingResponse.value.data;
    } else if (servicePricingResponse.status === 'rejected') {
      console.error('fetchHandymanData: Service pricing query failed:', servicePricingResponse.reason);
    }

    // Process work areas
    if (workAreasResponse.status === 'fulfilled' && workAreasResponse.value.data) {
      cleanData.workAreas = workAreasResponse.value.data;
    } else if (workAreasResponse.status === 'rejected') {
      console.error('fetchHandymanData: Work areas query failed:', workAreasResponse.reason);
    }

    // Process work settings
    if (workSettingsResponse.status === 'fulfilled' && workSettingsResponse.value.data) {
      cleanData.workSettings = workSettingsResponse.value.data;
    } else if (workSettingsResponse.status === 'rejected') {
      console.error('fetchHandymanData: Work settings query failed:', workSettingsResponse.reason);
    }

    // Process availability slots
    if (availabilitySlotsResponse.status === 'fulfilled' && availabilitySlotsResponse.value.data) {
      cleanData.availabilitySlots = availabilitySlotsResponse.value.data;
    } else if (availabilitySlotsResponse.status === 'rejected') {
      console.error('fetchHandymanData: Availability slots query failed:', availabilitySlotsResponse.reason);
    }

    console.log('fetchHandymanData: Final assembled data:', {
      userId,
      skillRatesCount: cleanData.skillRates.length,
      servicePricingCount: cleanData.servicePricing.length,
      workAreasCount: cleanData.workAreas.length,
      hasWorkSettings: !!cleanData.workSettings,
      availabilitySlotsCount: cleanData.availabilitySlots.length,
      totalActiveServices: cleanData.servicePricing.filter(s => s.is_active).length + cleanData.skillRates.filter(s => s.is_active).length
    });

    // Log service details if available
    if (cleanData.servicePricing.length > 0) {
      console.log('fetchHandymanData: Service pricing details:', cleanData.servicePricing.map(s => ({
        categoryId: s.category_id,
        subcategoryId: s.subcategory_id,
        isActive: s.is_active,
        basePrice: s.base_price,
        customPrice: s.custom_price
      })));
    }

    if (cleanData.skillRates.length > 0) {
      console.log('fetchHandymanData: Skill rates details:', cleanData.skillRates.map(s => ({
        skillName: s.skill_name,
        isActive: s.is_active,
        hourlyRate: s.hourly_rate,
        experienceLevel: s.experience_level
      })));
    }

    return cleanData;

  } catch (error) {
    console.error('fetchHandymanData: Unexpected error:', error);
    throw new Error(`Failed to fetch handyman data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
