
import type { Professional } from './types.ts'

export function enrichProfileWithData(
  profile: any,
  handymanData: any[],
  skillRates: any[],
  workAreas: any[],
  locations: any[],
  servicePricing: any[] = [],
  userLat: number,
  userLng: number,
  jobCompletionData: Record<string, number> = {}
): Professional {
  const profileHandymanData = handymanData.find(h => h.user_id === profile.id)
  const profileSkillRates = skillRates.filter(s => s.user_id === profile.id)
  const profileWorkAreas = workAreas.filter(w => w.user_id === profile.id)
  const profileLocation = locations.find(l => l.user_id === profile.id)
  const profileServicePricing = servicePricing.filter(sp => sp.user_id === profile.id)

  // Calculate distance if user location and handyman location are available
  let distance: number | undefined
  if (userLat && userLng && (profileLocation || profile.handyman_locations)) {
    const location = profileLocation || profile.handyman_locations[0]
    if (location) {
      const lat1 = userLat * Math.PI / 180
      const lat2 = location.latitude * Math.PI / 180
      const deltaLat = (location.latitude - userLat) * Math.PI / 180
      const deltaLng = (location.longitude - userLng) * Math.PI / 180

      const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.sin(deltaLng/2) * Math.sin(deltaLng/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      distance = 3959 * c // Distance in miles
    }
  } else if (profile.distance !== undefined) {
    distance = profile.distance // Use pre-calculated distance from location search
  }

  // Calculate experience years from account creation
  const createdAt = new Date(profile.created_at)
  const now = new Date()
  const experienceYears = Math.max(1, now.getFullYear() - createdAt.getFullYear())

  // Determine if professional is online (within last 15 minutes)
  let isOnline = false
  let lastSeen = null
  
  if (profileLocation) {
    const lastUpdate = new Date(profileLocation.last_updated)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    isOnline = lastUpdate > fifteenMinutesAgo && profileLocation.is_active
    lastSeen = profileLocation.last_updated
  } else if (profile.handyman_locations && profile.handyman_locations[0]) {
    const location = profile.handyman_locations[0]
    const lastUpdate = new Date(location.last_updated)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
    isOnline = lastUpdate > fifteenMinutesAgo && location.is_active
    lastSeen = location.last_updated
  }

  // Use real database data instead of mock data
  const rating = profile.average_rating || 0
  const reviewCount = profile.total_ratings || 0
  
  // Use real job completion data from database
  const completedJobs = jobCompletionData[profile.id] || 0

  console.log(`[ENRICHMENT] ${profile.full_name}: completedJobs=${completedJobs}, rating=${rating}, reviewCount=${reviewCount}`)

  // Response time based on subscription tier and online status
  const responseTime = isOnline ? 
    (profile.subscription_plan === 'elite' ? '< 30 minutes' : '< 1 hour') : 
    '< 2 hours'

  // Calculate base rate from service pricing instead of hourly rates
  let baseRate = 75; // Default fallback
  if (profileServicePricing && profileServicePricing.length > 0) {
    const activeServices = profileServicePricing.filter(sp => sp.is_active);
    if (activeServices.length > 0) {
      const totalPrice = activeServices.reduce((sum, service) => {
        return sum + (service.custom_price || service.base_price || 0);
      }, 0);
      baseRate = Math.round(totalPrice / activeServices.length);
    }
  } else if (profileHandymanData?.hourly_rate) {
    baseRate = profileHandymanData.hourly_rate;
  }

  return {
    id: profile.id,
    full_name: profile.full_name,
    email: profile.email,
    user_role: profile.user_role,
    subscription_plan: profile.subscription_plan,
    subscription_status: profile.subscription_status,
    account_status: profile.account_status,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
    distance,
    rating,
    reviewCount,
    completedJobs,
    responseTime,
    zip_code: profile.zip_code,
    handyman_data: profileHandymanData,
    skill_rates: profileSkillRates,
    service_pricing: profileServicePricing,
    work_areas: profileWorkAreas,
    handyman_work_areas: profileWorkAreas,
    handyman_locations: profileLocation || (profile.handyman_locations ? profile.handyman_locations[0] : null),
    averageRate: baseRate,
    experienceYears,
    isSponsored: profile.subscription_plan === 'premium' || profile.subscription_plan === 'elite' || profile.subscription_plan === 'enterprise',
    isOnline,
    lastSeen
  }
}

export function sortProfessionals(professionals: Professional[]): Professional[] {
  return professionals.sort((a, b) => {
    // Sponsored professionals first (elite/enterprise plans)
    if (a.isSponsored && !b.isSponsored) return -1
    if (!a.isSponsored && b.isSponsored) return 1
    
    // Online professionals next
    if (a.isOnline && !b.isOnline) return -1
    if (!a.isOnline && b.isOnline) return 1
    
    // Then by actual rating (only if both have ratings)
    if (a.rating > 0 && b.rating > 0 && a.rating !== b.rating) {
      return b.rating - a.rating
    }
    
    // Then by distance (if available)
    if (a.distance !== undefined && b.distance !== undefined) {
      if (a.distance !== b.distance) return a.distance - b.distance
    }
    
    // Finally by completion count (based on actual data)
    return b.completedJobs - a.completedJobs
  })
}
