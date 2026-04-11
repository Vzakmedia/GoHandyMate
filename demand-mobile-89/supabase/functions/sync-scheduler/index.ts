
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
    console.log('[SYNC-SCHEDULER] Function started')
    
    // Get all sync configurations that are due for sync
    const now = new Date()
    const { data: syncConfigs, error } = await supabase
      .from('api_sync_config')
      .select('*')
      .eq('sync_enabled', true)

    if (error) throw error

    const results = []

    for (const config of syncConfigs) {
      const lastSync = config.last_sync_at ? new Date(config.last_sync_at) : new Date(0)
      const intervalMs = (config.sync_interval_minutes || 15) * 60 * 1000
      const nextSyncTime = new Date(lastSync.getTime() + intervalMs)

      if (now >= nextSyncTime) {
        console.log(`[SYNC-SCHEDULER] Triggering sync for ${config.sync_type}`)
        
        try {
          // Call the api-sync function
          const syncResponse = await supabase.functions.invoke('api-sync', {
            body: { syncType: config.sync_type }
          })

          if (syncResponse.error) {
            throw syncResponse.error
          }

          results.push({
            syncType: config.sync_type,
            success: true,
            result: syncResponse.data
          })
        } catch (error) {
          console.error(`[SYNC-SCHEDULER] Error syncing ${config.sync_type}:`, error)
          results.push({
            syncType: config.sync_type,
            success: false,
            error: error.message
          })
        }
      } else {
        console.log(`[SYNC-SCHEDULER] Skipping ${config.sync_type} - next sync at ${nextSyncTime}`)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      results,
      timestamp: now.toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('[SYNC-SCHEDULER] ERROR:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
