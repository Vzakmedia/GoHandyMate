
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
    const { jobId, jobType } = await req.json()
    
    console.log(`[NOTIFY-WORKERS] Notifying workers about job ${jobId} of type ${jobType}`)

    // Get available handymen with active subscriptions
    const { data: availableWorkers, error } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('user_role', 'handyman')
      .eq('subscription_status', 'active')

    if (error) throw error

    // Filter workers who can still accept jobs
    const eligibleWorkers = []
    for (const worker of availableWorkers || []) {
      const { data: canAccept } = await supabase.rpc('can_accept_job', { 
        user_id: worker.id 
      })
      if (canAccept) {
        eligibleWorkers.push(worker)
      }
    }

    // Create notifications for eligible workers
    const notifications = eligibleWorkers.map(worker => ({
      recipient_role: 'handyman',
      job_id: jobId,
      message: `New ${jobType} job available`,
      created_at: new Date().toISOString()
    }))

    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications)

      if (notificationError) throw notificationError
    }

    console.log(`[NOTIFY-WORKERS] Notified ${eligibleWorkers.length} workers about job ${jobId}`)

    return new Response(JSON.stringify({ 
      success: true,
      notified_workers: eligibleWorkers.length,
      message: `Notified ${eligibleWorkers.length} available workers`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[NOTIFY-WORKERS] Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
