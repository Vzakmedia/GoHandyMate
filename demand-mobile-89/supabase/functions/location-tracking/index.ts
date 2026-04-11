
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, userId, location, settings } = await req.json()
    
    console.log(`[LOCATION-TRACKING] Processing ${action} for user ${userId}`)

    if (action === 'update-location') {
      // Validate coordinates are within valid ranges
      const rawLat = parseFloat(location.latitude)
      const rawLng = parseFloat(location.longitude)
      
      if (isNaN(rawLat) || isNaN(rawLng)) {
        throw new Error('Invalid coordinates: latitude and longitude must be valid numbers')
      }
      
      if (Math.abs(rawLat) > 90 || Math.abs(rawLng) > 180) {
        throw new Error('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180')
      }
      
      // Limit precision to 6 decimal places for GPS accuracy (about 0.1 meter precision)
      const latitude = parseFloat(rawLat.toFixed(6))
      const longitude = parseFloat(rawLng.toFixed(6))
      
      // Cap accuracy to reasonable limits and limit precision to 2 decimal places
      // GPS accuracy over 10,000 meters (10km) is essentially useless, so cap it
      let rawAccuracy = location.accuracy ? parseFloat(location.accuracy) : 100
      if (isNaN(rawAccuracy) || rawAccuracy < 0) {
        rawAccuracy = 100
      }
      const accuracy = Math.min(rawAccuracy, 99999.99) // Cap at 99,999.99 meters
      const cappedAccuracy = parseFloat(accuracy.toFixed(2))
      
      console.log(`[LOCATION-TRACKING] Validated coordinates: lat=${latitude}, lng=${longitude}, accuracy=${cappedAccuracy}`)

      // Update user's current location with real-time sync
      const { error } = await supabase
        .from('handyman_locations')
        .upsert({
          user_id: userId,
          latitude: latitude,
          longitude: longitude,
          accuracy: cappedAccuracy,
          last_updated: new Date().toISOString(),
          is_active: true,
          is_real_time: true
        })

      if (error) {
        console.error('[LOCATION-TRACKING] Error updating location:', error)
        throw error
      }

      console.log('[LOCATION-TRACKING] Location updated successfully')

      // Broadcast real-time location update to all subscribers
      const { error: broadcastError } = await supabase
        .channel('handymen-locations')
        .send({
          type: 'broadcast',
          event: 'location-changed',
          payload: {
            userId,
            location: {
              latitude: latitude,
              longitude: longitude,
              accuracy: cappedAccuracy
            },
            timestamp: new Date().toISOString(),
            isRealTime: true
          }
        })

      if (broadcastError) {
        console.error('[LOCATION-TRACKING] Error broadcasting location:', broadcastError)
      } else {
        console.log('[LOCATION-TRACKING] Location broadcast successful')
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Real-time location updated successfully',
        broadcasted: !broadcastError
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'get-nearby-handymen') {
      const { latitude, longitude, radius = 25 } = location
      
      // Get nearby handymen with real-time locations using PostGIS functions
      const { data: nearbyHandymen, error } = await supabase
        .rpc('find_nearby_handymen', {
          user_lat: latitude,
          user_lng: longitude,
          search_radius: radius
        })

      if (error) {
        console.error('[LOCATION-TRACKING] Error finding nearby handymen:', error)
        throw error
      }

      // Filter for only active real-time locations
      const realTimeHandymen = (nearbyHandymen || []).filter(h => h.is_real_time && h.is_active)

      console.log(`[LOCATION-TRACKING] Found ${realTimeHandymen.length} real-time handymen`)

      return new Response(JSON.stringify(realTimeHandymen), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'update-settings') {
      // Update location tracking settings with real-time preferences
      const { error } = await supabase
        .from('location_settings')
        .upsert({
          user_id: userId,
          tracking_enabled: settings.trackingEnabled,
          sharing_enabled: settings.sharingEnabled,
          update_interval: settings.updateInterval,
          accuracy_threshold: settings.accuracyThreshold,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('[LOCATION-TRACKING] Error updating settings:', error)
        throw error
      }

      console.log('[LOCATION-TRACKING] Settings updated successfully')

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Settings updated successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'get-location-history') {
      const { data: locationHistory, error } = await supabase
        .from('handyman_locations')
        .select('*')
        .eq('user_id', userId)
        .order('last_updated', { ascending: false })
        .limit(100)

      if (error) {
        console.error('[LOCATION-TRACKING] Error getting location history:', error)
        throw error
      }

      return new Response(JSON.stringify(locationHistory || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'start-real-time-session') {
      // Mark user as actively sharing real-time location
      const { error } = await supabase
        .from('handyman_locations')
        .upsert({
          user_id: userId,
          is_active: true,
          is_real_time: true,
          session_started: new Date().toISOString(),
          last_updated: new Date().toISOString()
        })

      if (error) {
        console.error('[LOCATION-TRACKING] Error starting real-time session:', error)
        throw error
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Real-time session started'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('[LOCATION-TRACKING] Error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
