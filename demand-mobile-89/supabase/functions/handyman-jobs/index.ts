
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
    const { userId, jobType = 'all' } = await req.json()
    
    console.log(`[HANDYMAN-JOBS] Fetching jobs for handyman ${userId}, type: ${jobType}`)

    // Check if user exists and is a handyman
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (profileError || profile?.user_role !== 'handyman') {
      throw new Error('User not found or not a handyman')
    }

    let query = supabase
      .from('job_requests')
      .select(`
        *,
        units (
          unit_number,
          property_address,
          tenant_name,
          tenant_phone
        )
      `)

    // Filter based on job type
    switch (jobType) {
      case 'available':
        query = query
          .eq('status', 'pending')
          .is('assigned_to_user_id', null)
        break
      case 'my_jobs':
        query = query.eq('assigned_to_user_id', userId)
        break
      case 'completed':
        query = query
          .eq('assigned_to_user_id', userId)
          .eq('status', 'completed')
        break
      case 'ongoing':
        query = query
          .eq('assigned_to_user_id', userId)
          .in('status', ['in_progress', 'ongoing'])
        break
      default:
        // Return all jobs for this handyman
        query = query.eq('assigned_to_user_id', userId)
    }

    const { data: jobs, error: jobsError } = await query.order('created_at', { ascending: false })

    if (jobsError) throw jobsError

    console.log(`[HANDYMAN-JOBS] Found ${jobs?.length || 0} jobs for handyman ${userId}`)

    return new Response(JSON.stringify(jobs || []), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[HANDYMAN-JOBS] Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
