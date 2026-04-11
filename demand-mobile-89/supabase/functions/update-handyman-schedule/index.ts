
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
    const { userId, schedule } = await req.json()
    
    console.log(`[UPDATE-SCHEDULE] Updating schedule for user ${userId}`)

    // Check if user exists and is a handyman
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (profileError || profile?.user_role !== 'handyman') {
      throw new Error('User not found or not a handyman')
    }

    // Delete existing schedule entries
    const { error: deleteError } = await supabase
      .from('handyman_schedule')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting existing schedule:', deleteError)
    }

    // Insert new schedule entries
    const scheduleEntries = schedule.map((entry: any) => ({
      user_id: userId,
      day_of_week: entry.day_of_week,
      start_time: entry.start_time,
      end_time: entry.end_time,
      is_available: entry.is_available,
      notes: entry.notes || null
    }))

    const { error: insertError } = await supabase
      .from('handyman_schedule')
      .insert(scheduleEntries)

    if (insertError) throw insertError

    console.log(`[UPDATE-SCHEDULE] Successfully updated schedule for user ${userId}`)

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Schedule updated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[UPDATE-SCHEDULE] Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
