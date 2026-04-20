import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { url } = req
    const { pathname, searchParams } = new URL(url)
    const method = req.method

    console.log(`[MAINTENANCE-SYSTEM] ${method} ${pathname}`)

    // Get user from auth token
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Route handlers
    if (pathname.endsWith('/maintenance-requests')) {
      if (method === 'GET') {
        return await getMaintenanceRequests(supabase, user.id, searchParams)
      } else if (method === 'POST') {
        const body = await req.json()
        return await createMaintenanceRequest(supabase, user.id, body)
      }
    } else if (pathname.includes('/maintenance-requests/') && method === 'PUT') {
      const requestId = pathname.split('/')[2]
      const body = await req.json()
      return await updateMaintenanceRequest(supabase, user.id, requestId, body)
    } else if (pathname.endsWith('/emergency-reports')) {
      if (method === 'GET') {
        return await getEmergencyReports(supabase, user.id)
      } else if (method === 'POST') {
        const body = await req.json()
        return await createEmergencyReport(supabase, user.id, body)
      }
    } else if (pathname.includes('/emergency-reports/') && method === 'PUT') {
      const reportId = pathname.split('/')[2]
      const body = await req.json()
      return await updateEmergencyReport(supabase, user.id, reportId, body)
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[MAINTENANCE-SYSTEM] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getMaintenanceRequests(supabase: any, userId: string, searchParams: URLSearchParams) {
  console.log(`[GET-MAINTENANCE] Fetching maintenance requests for user: ${userId}`)
  
  const type = searchParams.get('type') // 'emergency', 'recurring', 'standard'
  
  let query = supabase
    .from('maintenance_requests')
    .select(`
      id,
      title,
      description,
      type,
      priority,
      status,
      frequency,
      next_scheduled,
      estimated_cost,
      actual_cost,
      scheduled_date,
      completed_at,
      notes,
      created_at,
      updated_at,
      properties (
        property_name,
        property_address
      ),
      units (
        unit_number
      )
    `)
    .eq('manager_id', userId)
    .order('created_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  const { data: requests, error } = await query

  if (error) {
    console.error('[GET-MAINTENANCE] Error:', error)
    throw error
  }

  console.log(`[GET-MAINTENANCE] Found ${requests?.length || 0} maintenance requests`)

  return new Response(
    JSON.stringify({ requests }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createMaintenanceRequest(supabase: any, userId: string, requestData: any) {
  console.log(`[CREATE-MAINTENANCE] Creating maintenance request for user: ${userId}`)

  const {
    assigned_handyman_id,
    post_publicly = false,
    ...maintenanceData
  } = requestData

  // Auto-schedule next occurrence for recurring maintenance
  let nextScheduled = null
  if (maintenanceData.type === 'recurring' && maintenanceData.frequency) {
    const now = new Date()
    switch (maintenanceData.frequency) {
      case 'weekly':
        nextScheduled = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        nextScheduled = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
        break
      case 'quarterly':
        nextScheduled = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
        break
      case 'annually':
        nextScheduled = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        break
    }
  }

  const { data: request, error } = await supabase
    .from('maintenance_requests')
    .insert({
      manager_id: userId,
      property_id: maintenanceData.property_id,
      unit_id: maintenanceData.unit_id,
      title: maintenanceData.title,
      description: maintenanceData.description,
      type: maintenanceData.type || 'standard',
      priority: maintenanceData.priority || 'medium',
      frequency: maintenanceData.frequency,
      next_scheduled: nextScheduled,
      estimated_cost: maintenanceData.estimated_cost,
      scheduled_date: maintenanceData.scheduled_date,
      notes: maintenanceData.notes,
    })
    .select()
    .single()

  if (error) {
    console.error('[CREATE-MAINTENANCE] Error:', error)
    throw error
  }

  console.log(`[CREATE-MAINTENANCE] Created maintenance request: ${request.id}`)

  // If assigned to a specific handyman, create a job request
  if (assigned_handyman_id && !post_publicly) {
    try {
      const { error: jobError } = await supabase
        .from('job_requests')
        .insert({
          customer_id: userId,
          assigned_to_user_id: assigned_handyman_id,
          title: `Maintenance: ${maintenanceData.title}`,
          description: maintenanceData.description,
          budget: maintenanceData.estimated_cost || 0,
          status: 'assigned',
          job_type: 'maintenance',
          category: maintenanceData.type,
          property_id: maintenanceData.property_id,
          unit_id: maintenanceData.unit_id,
          maintenance_request_id: request.id,
          preferred_schedule: maintenanceData.scheduled_date,
          location: maintenanceData.property_id ? 'Property maintenance' : 'General maintenance',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (jobError) {
        console.error('[CREATE-MAINTENANCE] Error creating job request:', jobError)
      } else {
        console.log('[CREATE-MAINTENANCE] Job request created for assigned handyman')
      }
    } catch (jobError) {
      console.error('[CREATE-MAINTENANCE] Exception creating job request:', jobError)
    }
  } 
  // If posting publicly, create a public job request
  else if (post_publicly) {
    try {
      const { error: jobError } = await supabase
        .from('job_requests')
        .insert({
          customer_id: userId,
          title: `Maintenance: ${maintenanceData.title}`,
          description: maintenanceData.description,
          budget: maintenanceData.estimated_cost || 0,
          status: 'pending',
          job_type: 'maintenance',
          category: maintenanceData.type,
          property_id: maintenanceData.property_id,
          unit_id: maintenanceData.unit_id,
          maintenance_request_id: request.id,
          preferred_schedule: maintenanceData.scheduled_date,
          location: maintenanceData.property_id ? 'Property maintenance' : 'General maintenance',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (jobError) {
        console.error('[CREATE-MAINTENANCE] Error creating public job request:', jobError)
      } else {
        console.log('[CREATE-MAINTENANCE] Public job request created')
      }
    } catch (jobError) {
      console.error('[CREATE-MAINTENANCE] Exception creating public job request:', jobError)
    }
  }

  return new Response(
    JSON.stringify({ request }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateMaintenanceRequest(supabase: any, userId: string, requestId: string, updateData: any) {
  console.log(`[UPDATE-MAINTENANCE] Updating maintenance request: ${requestId}`)

  // Handle recurring maintenance rescheduling
  if (updateData.status === 'completed' && updateData.type === 'recurring' && updateData.frequency) {
    const now = new Date()
    let nextScheduled = null
    
    switch (updateData.frequency) {
      case 'weekly':
        nextScheduled = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        break
      case 'monthly':
        nextScheduled = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())
        break
      case 'quarterly':
        nextScheduled = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate())
        break
      case 'annually':
        nextScheduled = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
        break
    }

    // Create next occurrence for recurring maintenance
    if (nextScheduled) {
      await supabase
        .from('maintenance_requests')
        .insert({
          manager_id: userId,
          property_id: updateData.property_id,
          unit_id: updateData.unit_id,
          title: updateData.title,
          description: updateData.description,
          type: 'recurring',
          priority: updateData.priority,
          frequency: updateData.frequency,
          next_scheduled: nextScheduled,
          estimated_cost: updateData.estimated_cost,
        })
    }
  }

  const { data: request, error } = await supabase
    .from('maintenance_requests')
    .update({
      status: updateData.status,
      assigned_to_user_id: updateData.assigned_to_user_id,
      actual_cost: updateData.actual_cost,
      completed_at: updateData.status === 'completed' ? new Date() : null,
      notes: updateData.notes,
    })
    .eq('id', requestId)
    .eq('manager_id', userId)
    .select()
    .single()

  if (error) {
    console.error('[UPDATE-MAINTENANCE] Error:', error)
    throw error
  }

  console.log(`[UPDATE-MAINTENANCE] Updated maintenance request: ${requestId}`)

  return new Response(
    JSON.stringify({ request }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getEmergencyReports(supabase: any, userId: string) {
  console.log(`[GET-EMERGENCY] Fetching emergency reports for user: ${userId}`)

  const { data: reports, error } = await supabase
    .from('emergency_reports')
    .select(`
      id,
      emergency_type,
      severity,
      title,
      description,
      location_details,
      contact_phone,
      status,
      response_time_minutes,
      resolved_at,
      follow_up_required,
      notes,
      created_at,
      updated_at,
      properties (
        property_name,
        property_address
      ),
      units (
        unit_number
      )
    `)
    .or(`reporter_id.eq.${userId},property_id.in.(${await getPropertyIds(supabase, userId)})`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[GET-EMERGENCY] Error:', error)
    throw error
  }

  console.log(`[GET-EMERGENCY] Found ${reports?.length || 0} emergency reports`)

  return new Response(
    JSON.stringify({ reports }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createEmergencyReport(supabase: any, userId: string, reportData: any) {
  console.log(`[CREATE-EMERGENCY] Creating emergency report for user: ${userId}`)

  const { data: report, error } = await supabase
    .from('emergency_reports')
    .insert({
      reporter_id: userId,
      property_id: reportData.property_id,
      unit_id: reportData.unit_id,
      emergency_type: reportData.emergency_type,
      severity: reportData.severity || 'high',
      title: reportData.title,
      description: reportData.description,
      location_details: reportData.location_details,
      contact_phone: reportData.contact_phone,
      follow_up_required: reportData.follow_up_required || false,
      notes: reportData.notes,
    })
    .select()
    .single()

  if (error) {
    console.error('[CREATE-EMERGENCY] Error:', error)
    throw error
  }

  console.log(`[CREATE-EMERGENCY] Created emergency report: ${report.id}`)

  // For critical emergencies, could trigger automated notifications here
  if (reportData.severity === 'critical') {
    console.log(`[CREATE-EMERGENCY] Critical emergency reported: ${report.id}`)
    // Could trigger SMS/email notifications to emergency contacts
  }

  return new Response(
    JSON.stringify({ report }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateEmergencyReport(supabase: any, userId: string, reportId: string, updateData: any) {
  console.log(`[UPDATE-EMERGENCY] Updating emergency report: ${reportId}`)

  const { data: report, error } = await supabase
    .from('emergency_reports')
    .update({
      status: updateData.status,
      responder_id: updateData.responder_id,
      response_time_minutes: updateData.response_time_minutes,
      resolved_at: updateData.status === 'resolved' ? new Date() : null,
      follow_up_required: updateData.follow_up_required,
      notes: updateData.notes,
    })
    .eq('id', reportId)
    .select()
    .single()

  if (error) {
    console.error('[UPDATE-EMERGENCY] Error:', error)
    throw error
  }

  console.log(`[UPDATE-EMERGENCY] Updated emergency report: ${reportId}`)

  return new Response(
    JSON.stringify({ report }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getPropertyIds(supabase: any, userId: string): Promise<string> {
  const { data: properties } = await supabase
    .from('properties')
    .select('id')
    .eq('manager_id', userId)
  
  return properties?.map(p => p.id).join(',') || ''
}