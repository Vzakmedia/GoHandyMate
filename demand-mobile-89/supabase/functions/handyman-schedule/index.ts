
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
    const { userId, action, scheduleData } = await req.json()
    
    console.log(`[HANDYMAN-SCHEDULE] Processing ${action} for user ${userId}`)

    // Verify user is a handyman
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (profileError || profile?.user_role !== 'handyman') {
      console.error('[HANDYMAN-SCHEDULE] User verification failed:', profileError)
      throw new Error('Only handymen can manage schedules')
    }

    if (action === 'get') {
      // Fetch existing schedule
      const { data: schedule, error: scheduleError } = await supabase
        .from('handyman_schedule')
        .select('*')
        .eq('user_id', userId)
        .order('day_of_week')

      if (scheduleError) {
        console.error('[HANDYMAN-SCHEDULE] Error fetching schedule:', scheduleError)
        throw scheduleError
      }

      console.log(`[HANDYMAN-SCHEDULE] Retrieved ${schedule?.length || 0} schedule entries for user ${userId}`)

      return new Response(JSON.stringify(schedule || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'update') {
      // Delete existing schedule entries
      const { error: deleteError } = await supabase
        .from('handyman_schedule')
        .delete()
        .eq('user_id', userId)

      if (deleteError) {
        console.error('[HANDYMAN-SCHEDULE] Error deleting existing schedule:', deleteError)
        throw deleteError
      }

      // Insert new schedule entries
      const scheduleEntries = scheduleData.map((entry: any) => ({
        ...entry,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      const { error: insertError } = await supabase
        .from('handyman_schedule')
        .insert(scheduleEntries)

      if (insertError) {
        console.error('[HANDYMAN-SCHEDULE] Error inserting schedule:', insertError)
        throw insertError
      }

      console.log(`[HANDYMAN-SCHEDULE] Successfully updated schedule for user ${userId}`)

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Schedule updated successfully'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('[HANDYMAN-SCHEDULE] Error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
