
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
    const { jobId, handymanId } = await req.json()
    
    console.log(`[HANDYMAN-ACCEPT-JOB] Processing job acceptance: Job ${jobId} by Handyman ${handymanId}`)

    // Check if handyman can accept more jobs based on subscription
    const { data: canAccept } = await supabase.rpc('can_accept_job', { 
      user_id: handymanId 
    })

    if (!canAccept) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'You have reached your job limit for this month. Please upgrade your subscription.' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update job assignment
    const { error: assignmentError } = await supabase
      .from('job_requests')
      .update({ 
        assigned_to_user_id: handymanId,
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .eq('status', 'pending')

    if (assignmentError) throw assignmentError

    // Create notification for property manager
    const { data: jobData } = await supabase
      .from('job_requests')
      .select('manager_id, title')
      .eq('id', jobId)
      .single()

    if (jobData?.manager_id) {
      await supabase
        .from('notifications')
        .insert({
          recipient_role: 'property_manager',
          job_id: jobId,
          message: `Handyman has accepted job: ${jobData.title}`,
          created_at: new Date().toISOString()
        })
    }

    console.log(`[HANDYMAN-ACCEPT-JOB] Successfully assigned job ${jobId} to handyman ${handymanId}`)

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Job accepted successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[HANDYMAN-ACCEPT-JOB] Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
