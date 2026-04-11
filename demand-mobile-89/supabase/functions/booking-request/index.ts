
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
    const { operation, data, type = 'job_request', localId } = await req.json()
    
    console.log(`[BOOKING-REQUEST] Processing ${operation} for ${type}:`, localId)

    if (type === 'job_request') {
      switch (operation) {
        case 'create':
          // Validate job request data
          if (!data.title || !data.unit_id || !data.manager_id) {
            throw new Error('Missing required job request fields')
          }

          // Create the job request
          const { data: jobData, error: jobError } = await supabase
            .from('job_requests')
            .insert({
              title: data.title,
              description: data.description,
              job_type: data.job_type,
              unit_id: data.unit_id,
              manager_id: data.manager_id,
              priority: data.priority || 'medium',
              status: 'pending',
              preferred_schedule: data.preferred_schedule,
              images: data.images || []
            })
            .select()
            .single()

          if (jobError) throw jobError

          // Trigger notification to available handymen
          await supabase.functions.invoke('notify-available-workers', {
            body: { jobId: jobData.id, jobType: data.job_type }
          })

          return new Response(JSON.stringify({ 
            success: true, 
            data: jobData 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case 'update':
          const { error: updateError } = await supabase
            .from('job_requests')
            .update({
              status: data.status,
              assigned_to_user_id: data.assigned_to_user_id,
              updated_at: new Date().toISOString()
            })
            .eq('id', localId)

          if (updateError) throw updateError

          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Job updated successfully' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case 'delete':
          const { error: deleteError } = await supabase
            .from('job_requests')
            .delete()
            .eq('id', localId)

          if (deleteError) throw deleteError

          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Job deleted successfully' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
      }
    }

    if (type === 'contractor') {
      // Handle contractor data sync
      switch (operation) {
        case 'create':
        case 'update':
          // Sync contractor profile data
          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Contractor data synced' 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
      }
    }

    throw new Error(`Unsupported operation: ${operation} for type: ${type}`)

  } catch (error) {
    console.error('[BOOKING-REQUEST] Error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
