
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
    const { userId } = await req.json()
    
    console.log(`[GET-SCHEDULE] Fetching schedule for user ${userId}`)

    // Check if user exists and is a handyman
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (profileError || profile?.user_role !== 'handyman') {
      throw new Error('User not found or not a handyman')
    }

    // Fetch handyman schedule (you'll need to create this table)
    const { data: schedule, error: scheduleError } = await supabase
      .from('handyman_schedule')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week')

    if (scheduleError && scheduleError.code !== 'PGRST116') {
      throw scheduleError
    }

    console.log(`[GET-SCHEDULE] Found ${schedule?.length || 0} schedule entries`)

    return new Response(JSON.stringify(schedule || []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[GET-SCHEDULE] Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
