import { supabase } from '@/integrations/supabase/client';

/**
 * Centralized utility for customer app data synchronization
 * Handles fallbacks when edge functions are unavailable
 */

export const fetchProfessionalsWithFallback = async (params: {
  type?: 'handyman' | 'contractor' | 'all';
  serviceName?: string;
  lat?: string;
  lng?: string;
  radius?: string;
  includeServicePricing?: boolean;
  includeSkillRates?: boolean;
}) => {
  console.log('fetchProfessionalsWithFallback: Starting with params:', params);
  
  // Try edge function first
  try {
    const { data, error } = await supabase.functions.invoke('get-professionals', {
      body: params
    });

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      console.log('fetchProfessionalsWithFallback: Edge function success:', data.length, 'professionals');
      return data;
    }
  } catch (edgeFunctionError) {
    console.log('fetchProfessionalsWithFallback: Edge function failed, using database fallback:', edgeFunctionError);
  }

  // Fallback to direct database query
  return await fetchProfessionalsFromDatabase(params);
};

const fetchProfessionalsFromDatabase = async (params: {
  type?: 'handyman' | 'contractor' | 'all';
  serviceName?: string;
  includeServicePricing?: boolean;
  includeSkillRates?: boolean;
}) => {
  console.log('fetchProfessionalsFromDatabase: Fetching directly from database...');

  const userRoles = params.type === 'all' 
    ? ['handyman', 'contractor'] 
    : [params.type || 'handyman'];

  // Get professionals
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
    return [];
  }

  // Get additional data for handymen if requested
  const handymanIds = professionalsData.filter(p => p.user_role === 'handyman').map(p => p.id);
  
  let pricingData = [];
  let skillsData = [];

  if (handymanIds.length > 0 && (params.includeServicePricing || params.includeSkillRates)) {
    const queries = [];

    if (params.includeServicePricing) {
      queries.push(
        supabase
          .from('handyman_service_pricing')
          .select('*')
          .in('user_id', handymanIds)
          .eq('is_active', true)
      );
    }

    if (params.includeSkillRates) {
      queries.push(
        supabase
          .from('handyman_skill_rates')
          .select('*')
          .in('user_id', handymanIds)
          .eq('is_active', true)
      );
    }

    const results = await Promise.all(queries);
    
    if (params.includeServicePricing) {
      pricingData = results[0]?.data || [];
    }
    
    if (params.includeSkillRates) {
      const skillIndex = params.includeServicePricing ? 1 : 0;
      skillsData = results[skillIndex]?.data || [];
    }
  }

  // Combine all data
  const enrichedProfessionals = professionalsData.map(professional => {
    const serviceData = professional.user_role === 'handyman' 
      ? pricingData.filter(p => p.user_id === professional.id)
      : [];
    
    const skillData = professional.user_role === 'handyman'
      ? skillsData.filter(s => s.user_id === professional.id)
      : [];

    return {
      ...professional,
      rating: professional.average_rating || 0,
      reviewCount: professional.total_ratings || 0,
      experienceYears: 2,
      completedJobs: 0,
      isSponsored: false,
      isOnline: true,
      service_pricing: serviceData,
      skill_rates: skillData,
      hasRealtimePricing: serviceData.length > 0
    };
  });

  // Filter by service if specified
  if (params.serviceName && params.serviceName.trim()) {
    const serviceFilter = params.serviceName.toLowerCase().trim();
    return enrichedProfessionals.filter(professional => {
      // Check service pricing
      const hasMatchingPricing = professional.service_pricing?.some(pricing => 
        pricing.category_id?.toLowerCase().includes(serviceFilter)
      );
      
      // Check skill rates
      const hasMatchingSkill = professional.skill_rates?.some(skill =>
        skill.skill_name?.toLowerCase().includes(serviceFilter)
      );
      
      return hasMatchingPricing || hasMatchingSkill;
    });
  }

  console.log('fetchProfessionalsFromDatabase: Success:', enrichedProfessionals.length, 'professionals');
  return enrichedProfessionals;
};

export const submitBookingWithFallback = async (bookingData: any) => {
  console.log('submitBookingWithFallback: Starting booking submission:', bookingData);

  // Try edge function first
  try {
    const { data, error } = await supabase.functions.invoke('booking-request', {
      body: bookingData
    });

    if (error) {
      throw error;
    }

    if (data && data.success) {
      console.log('submitBookingWithFallback: Edge function booking successful');
      return data;
    }
  } catch (edgeFunctionError) {
    console.log('submitBookingWithFallback: Edge function failed, using direct database insert:', edgeFunctionError);
  }

  // Fallback to direct database insertion
  const { data, error } = await supabase
    .from('job_requests')
    .insert(bookingData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  console.log('submitBookingWithFallback: Database fallback successful');
  return { success: true, data };
};

export const setupRealtimeSubscriptionWithErrorHandling = (
  channelName: string,
  tableName: string,
  filter: string,
  callback: (payload: any) => void
) => {
  const channel = supabase
    .channel(`${channelName}-${Date.now()}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
        filter
      },
      callback
    )
    .subscribe((status) => {
      console.log(`Real-time subscription ${channelName} status:`, status);
      
      if (status === 'CHANNEL_ERROR') {
        console.log(`Real-time subscription ${channelName} error, will retry automatically`);
        // The subscription will automatically retry
      }
    });

  return channel;
};