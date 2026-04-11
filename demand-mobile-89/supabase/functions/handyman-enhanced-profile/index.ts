import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.2"

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
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, settings } = await req.json()
    
    // Get the user from the auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Authentication failed')
    }

    console.log(`[HANDYMAN-ENHANCED-PROFILE] Processing ${action} for user ${user.id}`)

    if (action === 'get_work_settings') {
      // Get work settings for the user
      const { data: workSettings, error } = await supabase
        .from('handyman_work_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('[HANDYMAN-ENHANCED-PROFILE] Error fetching settings:', error)
        throw error
      }

      return new Response(JSON.stringify({ 
        success: true,
        settings: workSettings || {
          advance_booking_days: 30,
          instant_booking: false,
          emergency_available: false,
          same_day_available: false,
          blackout_dates: []
        }
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })

    } else if (action === 'update_work_settings') {
      // Update or insert work settings
      const { data: existingSettings } = await supabase
        .from('handyman_work_settings')
        .select('id')
        .eq('user_id', user.id)
        .single()

      let result
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from('handyman_work_settings')
          .update({
            advance_booking_days: settings.advance_booking_days,
            instant_booking: settings.instant_booking,
            emergency_available: settings.emergency_available,
            same_day_available: settings.same_day_available,
            blackout_dates: settings.blackout_dates || [],
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
      } else {
        // Insert new settings
        result = await supabase
          .from('handyman_work_settings')
          .insert({
            user_id: user.id,
            advance_booking_days: settings.advance_booking_days,
            instant_booking: settings.instant_booking,
            emergency_available: settings.emergency_available,
            same_day_available: settings.same_day_available,
            blackout_dates: settings.blackout_dates || [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
      }

      if (result.error) {
        console.error('[HANDYMAN-ENHANCED-PROFILE] Error saving settings:', result.error)
        throw result.error
      }

      console.log(`[HANDYMAN-ENHANCED-PROFILE] Settings ${existingSettings ? 'updated' : 'created'} successfully`)

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Settings saved successfully'
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      })

    } else {
      throw new Error(`Unknown action: ${action}`)
    }

  } catch (error) {
    console.error('[HANDYMAN-ENHANCED-PROFILE] Error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    })
  }
})