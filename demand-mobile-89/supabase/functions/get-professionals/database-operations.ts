
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

interface RequestBody {
  type?: string;
  lat?: string;
  lng?: string;
  radius?: string;
  serviceName?: string;
  userId?: string;
  includeServicePricing?: boolean;
}

export const fetchNearbyProfessionals = async (userLat: number, userLng: number, radius: number, userType: string) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  console.log('[DB] Fetching nearby subscribed professionals:', {
    userLat,
    userLng,
    radius,
    userType
  })

  try {
    let profiles = [];
    let profileError = null;

    if (userType === 'handyman') {
      // For handymen, use location-based search with handyman_locations
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          handyman_locations!inner(
            latitude,
            longitude,
            is_active,
            last_updated
          )
        `)
        .eq('user_role', 'handyman')
        .eq('account_status', 'active')
        .in('subscription_status', ['active', 'trialing'])
        .eq('handyman_locations.is_active', true);
      
      profiles = data;
      profileError = error;

      if (profiles) {
        // Filter by distance for handymen
        profiles = profiles.filter(profile => {
          if (!profile.handyman_locations?.[0]) return false;
          
          const location = profile.handyman_locations[0];
          const lat1 = userLat * Math.PI / 180;
          const lat2 = location.latitude * Math.PI / 180;
          const deltaLat = (location.latitude - userLat) * Math.PI / 180;
          const deltaLng = (location.longitude - userLng) * Math.PI / 180;

          const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = 3959 * c; // Distance in miles

          return distance <= radius;
        });
      }
    } else {
      // For 'all', fetch handymen only
      const handymenResult = await supabase
        .from('profiles')
        .select(`
          *,
          handyman_locations!inner(
            latitude,
            longitude,
            is_active,
            last_updated
          )
        `)
        .eq('user_role', 'handyman')
        .eq('account_status', 'active')
        .in('subscription_status', ['active', 'trialing'])
        .eq('handyman_locations.is_active', true);

      if (handymenResult.error) {
        profileError = handymenResult.error;
      } else {
        let handymen = handymenResult.data || [];
        handymen = handymen.filter(profile => {
          if (!profile.handyman_locations?.[0]) return false;
          const location = profile.handyman_locations[0];
          const lat1 = userLat * Math.PI / 180;
          const lat2 = location.latitude * Math.PI / 180;
          const deltaLat = (location.latitude - userLat) * Math.PI / 180;
          const deltaLng = (location.longitude - userLng) * Math.PI / 180;
          const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                    Math.cos(lat1) * Math.cos(lat2) *
                    Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const distance = 3959 * c;
          return distance <= radius;
        });
        profiles = handymen;
      }
    }

    if (profileError) {
      console.log('[DB] Error fetching location-based professionals:', profileError)
      return await fetchProfilesData(userType)
    }

    console.log(`[DB] Found ${profiles?.length || 0} nearby professionals within ${radius} miles`)
    return { data: profiles || [], error: null }

  } catch (error) {
    console.log('[DB] Exception in nearby search:', error)
    return await fetchProfilesData(userType)
  }
}

export const fetchProfilesData = async (userType: string, userId?: string) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  console.log('[DB] Fetching active subscribed profiles:', { userType })

  let query = supabase
    .from('profiles')
    .select('*')
    .eq('account_status', 'active')
    .in('subscription_status', ['active', 'trialing'])

  if (userType && userType !== 'all') {
    query = query.eq('user_role', userType)
  }

  if (userId) {
    query = query.eq('id', userId)
  }

  const { data: profiles, error } = await query.order('created_at', { ascending: false })

  if (error) {
    console.log('[DB] Error fetching profiles:', error)
    return { data: [], error }
  }

  console.log(`[DB] Found active subscribed profiles: ${profiles?.length || 0}`)
  
  if (profiles && profiles.length > 0) {
    console.log('[DB] Sample profile:', {
      id: profiles[0].id,
      user_role: profiles[0].user_role,
      account_status: profiles[0].account_status,
      subscription_status: profiles[0].subscription_status,
      subscription_plan: profiles[0].subscription_plan
    })
  }

  return { data: profiles || [], error: null }
}

export const fetchAdditionalData = async (userIds: string[], includeServicePricing: boolean = false) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  console.log('[DB] Fetching additional data for users:', userIds.length)

  try {
    const results = await Promise.all([
      // Skill rates
      supabase
        .from('handyman_skill_rates')
        .select('*')
        .in('user_id', userIds),
      
      // Work areas
      supabase
        .from('handyman_work_areas')
        .select('*')
        .in('user_id', userIds),
      
      // Locations
      supabase
        .from('handyman_locations')
        .select('*')
        .in('user_id', userIds),
      
      // Service pricing
      includeServicePricing ? supabase
        .from('handyman_service_pricing')
        .select('*')
        .in('user_id', userIds) : Promise.resolve({ data: [], error: null })
    ])
    
    console.log('[DB] Additional data results:', {
      skillRates: results[0].data?.length || 0,
      workAreas: results[1].data?.length || 0,
      locations: results[2].data?.length || 0,
      servicePricing: results[3].data?.length || 0
    })

    return [
      { data: [], error: null }, // handyman_data placeholder
      { data: results[0].data || [], error: results[0].error },
      { data: results[1].data || [], error: results[1].error },
      { data: results[2].data || [], error: results[2].error },
      { data: results[3].data || [], error: results[3].error }
    ]

  } catch (error) {
    console.log('[DB] Error fetching additional data:', error)
    return [
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null },
      { data: [], error: null }
    ]
  }
}

export const fetchJobCompletionData = async (userIds: string[]) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  console.log('[DB] Fetching job completion data for users:', userIds.length)

  try {
    const { data: jobCounts, error } = await supabase
      .from('job_requests')
      .select('assigned_to_user_id, status')
      .in('assigned_to_user_id', userIds)
      .eq('status', 'completed')

    if (error) {
      console.log('[DB] Error fetching job completion data:', error)
      return {}
    }

    // Count completed jobs per user
    const completionCounts = jobCounts.reduce((acc, job) => {
      const userId = job.assigned_to_user_id
      acc[userId] = (acc[userId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    console.log('[DB] Job completion counts:', completionCounts)
    return completionCounts

  } catch (error) {
    console.log('[DB] Exception fetching job completion data:', error)
    return {}
  }
}

export const ensureTestData = async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  console.log('[DB] Checking for existing subscribed professionals...')

  const { data: existingProfiles, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('account_status', 'active')
    .in('subscription_status', ['active', 'trialing'])
    .eq('user_role', 'handyman')

  if (error) {
    console.log('[DB] Error checking existing professionals:', error)
    return
  }

  console.log(`[DB] Found existing subscribed professionals: ${existingProfiles?.length || 0}`)

  if (existingProfiles && existingProfiles.length > 0) {
    console.log('[DB] Subscribed professionals already exist, no updates needed')
    return
  }

  console.log('[DB] No subscribed professionals found')
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
