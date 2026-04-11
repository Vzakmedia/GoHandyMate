
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
    const { jobId, handymanId, action } = await req.json()
    
    console.log(`[HANDLE-JOB-ASSIGNMENT] Processing ${action} for job ${jobId} by handyman ${handymanId}`)

    // Verify the handyman exists and is active
    const { data: handyman, error: handymanError } = await supabase
      .from('profiles')
      .select('id, user_role, account_status, jobs_this_month, subscription_plan, subscription_status')
      .eq('id', handymanId)
      .eq('user_role', 'handyman')
      .single()

    if (handymanError || !handyman) {
      console.error('[HANDLE-JOB-ASSIGNMENT] Handyman verification failed:', handymanError)
      throw new Error('Handyman not found or not authorized')
    }

    if (handyman.account_status !== 'active') {
      throw new Error('Your account is not active. Please contact support.')
    }

    // Check if job exists and is available
    const { data: job, error: jobError } = await supabase
      .from('job_requests')
      .select('*')
      .eq('id', jobId)
      .single()

    if (jobError || !job) {
      console.error('[HANDLE-JOB-ASSIGNMENT] Job verification failed:', jobError)
      throw new Error('Job not found')
    }

    if (job.status !== 'pending') {
      throw new Error('This job is no longer available')
    }

    if (job.assigned_to_user_id) {
      throw new Error('This job has already been assigned')
    }

    // Check subscription limits
    if (handyman.subscription_status !== 'active') {
      throw new Error('You need an active subscription to accept jobs')
    }

    // Check job limits based on subscription plan
    let jobLimit = 0;
    switch (handyman.subscription_plan) {
      case 'starter':
        jobLimit = 15;
        break;
      case 'pro':
        jobLimit = 40;
        break;
      case 'elite':
        jobLimit = -1; // unlimited
        break;
      default:
        throw new Error('Invalid subscription plan')
    }

    if (jobLimit !== -1 && handyman.jobs_this_month >= jobLimit) {
      throw new Error('You have reached your monthly job limit. Please upgrade your plan.')
    }

    if (action === 'accept') {
      // Assign the job to the handyman
      const { error: assignError } = await supabase
        .from('job_requests')
        .update({
          assigned_to_user_id: handymanId,
          status: 'assigned',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)

      if (assignError) {
        console.error('[HANDLE-JOB-ASSIGNMENT] Job assignment failed:', assignError)
        throw assignError
      }

      console.log(`[HANDLE-JOB-ASSIGNMENT] Job ${jobId} successfully assigned to handyman ${handymanId}`)

      return new Response(JSON.stringify({ 
        success: true,
        message: 'Job accepted successfully',
        jobId: jobId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    throw new Error('Invalid action')

  } catch (error) {
    console.error('[HANDLE-JOB-ASSIGNMENT] Error:', error)
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
