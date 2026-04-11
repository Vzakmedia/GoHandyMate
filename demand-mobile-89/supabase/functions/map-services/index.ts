import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()
    
    console.log(`[MAP-SERVICES] Processing ${endpoint} request`)

    if (endpoint === 'get-api-key') {
      // Try to get the API key from environment variables
      const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY')
      
      console.log(`[MAP-SERVICES] API key check - exists: ${!!apiKey}`)
      console.log(`[MAP-SERVICES] API key length: ${apiKey ? apiKey.length : 0}`)
      
      if (!apiKey) {
        console.error('[MAP-SERVICES] No Google Maps API key found in environment variables')
        return new Response(JSON.stringify({ 
          error: 'Google Maps API key not configured in Supabase secrets' 
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      console.log(`[MAP-SERVICES] Successfully retrieved API key`)
      return new Response(JSON.stringify({ 
        apiKey: apiKey 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get API key for other endpoints
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY')

    if (!GOOGLE_MAPS_API_KEY) {
      console.error('[MAP-SERVICES] Google Maps API key not configured')
      return new Response(JSON.stringify({ 
        error: 'Google Maps API key not configured. Please add GOOGLE_MAPS_API_KEY to your Supabase secrets.',
        details: 'Go to your Supabase project settings > Edge Functions > Secrets and add GOOGLE_MAPS_API_KEY'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Test API key validity by making a simple request
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${GOOGLE_MAPS_API_KEY}`
    const testResponse = await fetch(testUrl)
    const testData = await testResponse.json()
    
    if (testData.status === 'REQUEST_DENIED') {
      console.error('[MAP-SERVICES] API Key validation failed:', testData.error_message)
      return new Response(JSON.stringify({ 
        error: `Google Maps API key is invalid: ${testData.error_message}`,
        details: 'Please check that your API key is correct and has the required APIs enabled (Places API, Geocoding API)'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (endpoint === 'autocomplete') {
      const { input, sessionToken, types } = await req.json()
      
      console.log(`[MAP-SERVICES] Autocomplete request - input: "${input}", session: ${sessionToken}`)
      
      if (!input || input.length < 2) {
        return new Response(JSON.stringify({ 
          predictions: [],
          status: 'ZERO_RESULTS'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Fix the types parameter - don't mix 'address' with other types
      // Use 'geocode' for addresses, or leave empty for all types
      let typesParam = ''
      if (types && types.length > 0) {
        // Filter out conflicting types and use geocode for addresses
        const validTypes = types.includes('address') ? ['geocode'] : types.filter(t => t !== 'address')
        if (validTypes.length > 0) {
          typesParam = `&types=${validTypes.join('|')}`
        }
      }
      
      const sessionParam = sessionToken ? `&sessiontoken=${sessionToken}` : ''
      
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}${typesParam}${sessionParam}`
      
      console.log(`[MAP-SERVICES] Making request to Google Maps API`)
      console.log(`[MAP-SERVICES] URL: ${googleMapsUrl.replace(GOOGLE_MAPS_API_KEY, '[API_KEY]')}`)
      
      const response = await fetch(googleMapsUrl)
      const data = await response.json()
      
      console.log(`[MAP-SERVICES] Google API response status: ${data.status}`)
      console.log(`[MAP-SERVICES] Google API response:`, JSON.stringify(data, null, 2))
      
      if (data.status === 'REQUEST_DENIED') {
        console.error('[MAP-SERVICES] Request denied - API key issues:', data.error_message)
        return new Response(JSON.stringify({ 
          error: `Google Maps API request denied: ${data.error_message || 'Invalid API key or API not enabled'}`,
          details: 'Please check that your API key is valid and has the Places API enabled. Also ensure your API key allows requests from your domain.'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      if (data.status === 'INVALID_REQUEST') {
        console.error('[MAP-SERVICES] Invalid request:', data.error_message)
        return new Response(JSON.stringify({ 
          error: `Invalid request: ${data.error_message || 'Request parameters are invalid'}`,
          details: 'The request format or parameters are incorrect'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error('[MAP-SERVICES] Autocomplete failed:', data.status, data.error_message)
        return new Response(JSON.stringify({ 
          error: `Autocomplete failed: ${data.status}`,
          details: data.error_message || 'Unknown error occurred'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (endpoint === 'place-details') {
      const { placeId, sessionToken, fields } = await req.json()
      
      console.log(`[MAP-SERVICES] Place details for: ${placeId}`)
      
      const fieldsParam = fields ? `&fields=${fields.join(',')}` : ''
      const sessionParam = sessionToken ? `&sessiontoken=${sessionToken}` : ''
      
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}${fieldsParam}${sessionParam}`
      
      const response = await fetch(googleMapsUrl)
      const data = await response.json()
      
      if (data.status !== 'OK') {
        console.error('[MAP-SERVICES] Place details failed:', data.status, data.error_message)
        return new Response(JSON.stringify({ 
          error: `Place details failed: ${data.status}`,
          details: data.error_message || 'Unknown error occurred'
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify(data.result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (endpoint === 'geocode') {
      const { address } = await req.json()
      
      console.log(`[MAP-SERVICES] Geocoding address: ${address}`)
      
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      
      const response = await fetch(googleMapsUrl)
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error(`Geocoding failed: ${data.status}`)
      }
      
      const result = data.results[0]
      const location = result.geometry.location
      
      const geocodingResult = {
        latitude: location.lat,
        longitude: location.lng,
        formatted_address: result.formatted_address
      }

      return new Response(JSON.stringify(geocodingResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (endpoint === 'reverse-geocode') {
      const { latitude, longitude } = await req.json()
      
      console.log(`[MAP-SERVICES] Reverse geocoding: ${latitude}, ${longitude}`)
      
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      
      const response = await fetch(googleMapsUrl)
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error(`Reverse geocoding failed: ${data.status}`)
      }
      
      const result = data.results[0]
      
      const reverseGeocodeResult = {
        latitude,
        longitude,
        formatted_address: result.formatted_address
      }

      return new Response(JSON.stringify(reverseGeocodeResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (endpoint === 'places-nearby') {
      const { latitude, longitude, radius, type } = await req.json()
      
      console.log(`[MAP-SERVICES] Finding nearby places: ${latitude}, ${longitude}, radius: ${radius}`)
      
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius * 1609.34}&type=${type || 'establishment'}&key=${GOOGLE_MAPS_API_KEY}`
      
      const response = await fetch(googleMapsUrl)
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error(`Places search failed: ${data.status}`)
      }
      
      const places = data.results.map((place: any) => ({
        place_id: place.place_id,
        name: place.name,
        address: place.vicinity,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng
        },
        rating: place.rating,
        types: place.types
      }))

      return new Response(JSON.stringify(places), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (endpoint === 'distance-matrix') {
      const { origins, destinations } = await req.json()
      
      console.log(`[MAP-SERVICES] Calculating distance matrix`)
      
      const originsStr = origins.map((o: any) => `${o.latitude},${o.longitude}`).join('|')
      const destinationsStr = destinations.map((d: any) => `${d.latitude},${d.longitude}`).join('|')
      
      const googleMapsUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originsStr}&destinations=${destinationsStr}&units=imperial&key=${GOOGLE_MAPS_API_KEY}`
      
      const response = await fetch(googleMapsUrl)
      const data = await response.json()
      
      if (data.status !== 'OK') {
        throw new Error(`Distance matrix failed: ${data.status}`)
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[MAP-SERVICES] Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check the function logs for more information'
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
