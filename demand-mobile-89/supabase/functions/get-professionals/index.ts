
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import type { RequestBody, Professional } from './types.ts'
import { fetchProfilesData, fetchAdditionalData, fetchNearbyProfessionals, fetchJobCompletionData, ensureTestData } from './database-operations.ts'
import { enrichProfileWithData, sortProfessionals } from './data-enrichment.ts'
import { filterProfessionalsByService } from './service-filtering.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const requestBody: RequestBody = await req.json();
    const userType = requestBody.type || 'handyman';
    const userLat = parseFloat(requestBody.lat || '0');
    const userLng = parseFloat(requestBody.lng || '0');
    const radius = parseInt(requestBody.radius || '50'); // Default to 50 miles
    const serviceName = requestBody.serviceName || '';
    const userId = requestBody.userId;
    const includeServicePricing = requestBody.includeServicePricing || false;

    console.log(`[GET-PROFESSIONALS] Fetching ${userType} professionals`, {
      userLat,
      userLng,
      radius: 50, // Always use 50-mile radius for consistency
      serviceName,
      userId,
      includeServicePricing: true
    });

    // Always ensure we have test data for development
    await ensureTestData();

    let profiles, profileError;

    // Prioritize location-based search when coordinates are provided
    if (userLat && userLng && userLat !== 0 && userLng !== 0 && !userId) {
      console.log('[GET-PROFESSIONALS] Using location-based search with 50-mile radius:', { userLat, userLng });
      const result = await fetchNearbyProfessionals(userLat, userLng, 50, userType); // Force 50-mile radius
      profiles = result.data;
      profileError = result.error;
    } else {
      console.log('[GET-PROFESSIONALS] Using general search (no location or single user lookup)');
      const result = await fetchProfilesData(userType, userId);
      profiles = result.data;
      profileError = result.error;
    }

    if (profileError) {
      console.error('[GET-PROFESSIONALS] Error fetching profiles:', profileError)
      return new Response(JSON.stringify({ 
        error: profileError.message,
        details: 'Failed to fetch professionals data'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (!profiles || profiles.length === 0) {
      console.log('[GET-PROFESSIONALS] No profiles found - returning empty array')
      return new Response(JSON.stringify([]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`[GET-PROFESSIONALS] Found ${profiles.length} profiles within 50-mile radius`)

    const userIds = profiles.map(p => p.id)

    // Always fetch complete data including service pricing and job completion data
    const [additionalDataResults, jobCompletionData] = await Promise.all([
      fetchAdditionalData(userIds, true),
      fetchJobCompletionData(userIds)
    ])

    console.log(`[GET-PROFESSIONALS] Additional data fetched:`, {
      handymanData: additionalDataResults[0]?.data?.length || 0,
      skillRates: additionalDataResults[1]?.data?.length || 0,
      workAreas: additionalDataResults[2]?.data?.length || 0,
      locations: additionalDataResults[3]?.data?.length || 0,
      servicePricing: additionalDataResults[4]?.data?.length || 0,
      jobCompletionData: Object.keys(jobCompletionData).length
    })

    // Safely extract data from results
    const handymanData = additionalDataResults[0]?.data || []
    const skillRates = additionalDataResults[1]?.data || []
    const workAreas = additionalDataResults[2]?.data || []
    const locations = additionalDataResults[3]?.data || []
    const servicePricing = additionalDataResults[4]?.data || []

    // Enrich profiles with additional data including distance calculation and job completion counts
    const enrichedProfiles = profiles.map(profile => {
      return enrichProfileWithData(
        profile,
        handymanData,
        skillRates,
        workAreas,
        locations,
        servicePricing,
        userLat,
        userLng,
        jobCompletionData
      )
    })

    console.log(`[GET-PROFESSIONALS] Enriched ${enrichedProfiles.length} profiles with distance data`)

    // Apply service filtering for all requests (except single user lookup)
    const filteredProfiles = userId ? enrichedProfiles : filterProfessionalsByService(enrichedProfiles, serviceName)

    console.log(`[GET-PROFESSIONALS] After service filtering: ${filteredProfiles.length} professionals match criteria`)

    // Sort professionals by distance and relevance (but not for single user lookup)
    const sortedProfiles = userId ? filteredProfiles : sortProfessionals(filteredProfiles)

    console.log(`[GET-PROFESSIONALS] Successfully returning ${sortedProfiles.length} professionals within 50-mile radius`)

    return new Response(JSON.stringify(sortedProfiles), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[GET-PROFESSIONALS] Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to fetch professionals data'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
