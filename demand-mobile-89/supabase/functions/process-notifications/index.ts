
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
    console.log('[PROCESS-NOTIFICATIONS] Processing pending notifications')

    // Get unread notifications
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select(`
        *,
        job_requests (
          title,
          job_type,
          units (
            unit_number,
            property_address
          )
        )
      `)
      .eq('is_read', false)
      .order('created_at', { ascending: true })
      .limit(50)

    if (error) throw error

    let processedCount = 0

    for (const notification of notifications || []) {
      try {
        // Here you could integrate with push notification services
        // For now, we'll just log and mark as processed
        console.log(`[PROCESS-NOTIFICATIONS] Processing notification ${notification.id}: ${notification.message}`)

        // Mark as read (processed)
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification.id)

        processedCount++
      } catch (notificationError) {
        console.error(`[PROCESS-NOTIFICATIONS] Failed to process notification ${notification.id}:`, notificationError)
      }
    }

    return new Response(JSON.stringify({ 
      success: true,
      processed: processedCount,
      message: `Processed ${processedCount} notifications`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[PROCESS-NOTIFICATIONS] Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
