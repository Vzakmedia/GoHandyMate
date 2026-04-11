
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
    console.log('[API-SYNC] Function started')
    
    const { syncType = 'all', operation = 'sync' } = await req.json().catch(() => ({}))
    
    // Get sync configurations
    const { data: syncConfigs, error: configError } = await supabase
      .from('api_sync_config')
      .select('*')
      .eq('sync_enabled', true)
      .in('sync_type', syncType === 'all' ? ['job_requests', 'contractor_data'] : [syncType])

    if (configError) {
      console.error('[API-SYNC] Error fetching sync config:', configError)
      throw configError
    }

    const results = []

    for (const config of syncConfigs) {
      console.log(`[API-SYNC] Processing sync for ${config.sync_type}`)
      
      try {
        if (config.sync_type === 'job_requests') {
          const result = await syncJobRequests(config)
          results.push({ syncType: config.sync_type, ...result })
        } else if (config.sync_type === 'contractor_data') {
          const result = await syncContractorData(config)
          results.push({ syncType: config.sync_type, ...result })
        }

        // Update last sync time
        await supabase
          .from('api_sync_config')
          .update({ last_sync_at: new Date().toISOString() })
          .eq('id', config.id)

      } catch (error) {
        console.error(`[API-SYNC] Error syncing ${config.sync_type}:`, error)
        results.push({ 
          syncType: config.sync_type, 
          success: false, 
          error: error.message 
        })
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      results,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('[API-SYNC] ERROR in api-sync:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function syncJobRequests(config: any) {
  console.log('[API-SYNC] Syncing job requests')
  
  // Get pending sync logs for job requests
  const { data: pendingLogs, error: logsError } = await supabase
    .from('api_sync_logs')
    .select('*')
    .eq('sync_type', 'job_requests')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50)

  if (logsError) throw logsError

  let syncedCount = 0
  let errorCount = 0

  for (const log of pendingLogs) {
    try {
      const endpoint = `https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/booking-request`
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          operation: log.operation,
          data: log.request_payload,
          localId: log.local_record_id
        })
      })

      if (response.ok) {
        const responseData = await response.json()
        
        // Update sync log as successful
        await supabase
          .from('api_sync_logs')
          .update({
            status: 'success',
            response_data: responseData,
            updated_at: new Date().toISOString()
          })
          .eq('id', log.id)

        syncedCount++
        console.log(`[API-SYNC] Successfully synced job request ${log.local_record_id}`)
      } else {
        throw new Error(`API responded with status ${response.status}`)
      }
    } catch (error) {
      errorCount++
      console.error(`[API-SYNC] Failed to sync job request ${log.local_record_id}:`, error)
      
      // Update retry count and status
      const newRetryCount = (log.retry_count || 0) + 1
      const maxRetries = config.max_retries || 3
      
      await supabase
        .from('api_sync_logs')
        .update({
          status: newRetryCount >= maxRetries ? 'failed' : 'retrying',
          retry_count: newRetryCount,
          error_message: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', log.id)
    }
  }

  return { success: true, synced: syncedCount, errors: errorCount }
}

async function syncContractorData(config: any) {
  console.log('[API-SYNC] Syncing contractor data')
  
  // Get pending sync logs for contractor data
  const { data: pendingLogs, error: logsError } = await supabase
    .from('api_sync_logs')
    .select('*')
    .eq('sync_type', 'contractor_data')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(50)

  if (logsError) throw logsError

  let syncedCount = 0
  let errorCount = 0

  for (const log of pendingLogs) {
    try {
      // For contractor data, we can sync to the same endpoint with different operation
      const endpoint = `https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/booking-request`
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          operation: log.operation,
          type: 'contractor',
          data: log.request_payload,
          localId: log.local_record_id
        })
      })

      if (response.ok) {
        const responseData = await response.json()
        
        await supabase
          .from('api_sync_logs')
          .update({
            status: 'success',
            response_data: responseData,
            updated_at: new Date().toISOString()
          })
          .eq('id', log.id)

        syncedCount++
        console.log(`[API-SYNC] Successfully synced contractor data ${log.local_record_id}`)
      } else {
        throw new Error(`API responded with status ${response.status}`)
      }
    } catch (error) {
      errorCount++
      console.error(`[API-SYNC] Failed to sync contractor data ${log.local_record_id}:`, error)
      
      const newRetryCount = (log.retry_count || 0) + 1
      const maxRetries = config.max_retries || 3
      
      await supabase
        .from('api_sync_logs')
        .update({
          status: newRetryCount >= maxRetries ? 'failed' : 'retrying',
          retry_count: newRetryCount,
          error_message: error.message,
          updated_at: new Date().toISOString()
        })
        .eq('id', log.id)
    }
  }

  return { success: true, synced: syncedCount, errors: errorCount }
}
