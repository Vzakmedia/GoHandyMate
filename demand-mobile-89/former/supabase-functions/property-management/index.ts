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

    console.log(`[PROPERTY-MANAGEMENT] ${method} ${pathname}`)

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
    if (pathname.endsWith('/properties')) {
      if (method === 'GET') {
        return await getProperties(supabase, user.id)
      } else if (method === 'POST') {
        const body = await req.json()
        return await createProperty(supabase, user.id, body)
      }
    } else if (pathname.includes('/properties/') && pathname.endsWith('/units')) {
      const propertyId = pathname.split('/')[2]
      if (method === 'GET') {
        return await getUnits(supabase, user.id, propertyId)
      } else if (method === 'POST') {
        const body = await req.json()
        return await createUnit(supabase, user.id, propertyId, body)
      }
    } else if (pathname.includes('/units/')) {
      const unitId = pathname.split('/')[2]
      if (method === 'PUT') {
        const body = await req.json()
        return await updateUnit(supabase, user.id, unitId, body)
      } else if (method === 'DELETE') {
        return await deleteUnit(supabase, user.id, unitId)
      }
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[PROPERTY-MANAGEMENT] Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function getProperties(supabase: any, userId: string) {
  console.log(`[GET-PROPERTIES] Fetching properties for user: ${userId}`)

  const { data: properties, error } = await supabase
    .from('properties')
    .select(`
      id,
      property_name,
      property_address,
      property_type,
      total_units,
      city,
      state,
      zip_code,
      status,
      approved_at,
      created_at,
      updated_at
    `)
    .eq('manager_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[GET-PROPERTIES] Error:', error)
    throw error
  }

  console.log(`[GET-PROPERTIES] Found ${properties?.length || 0} properties`)

  return new Response(
    JSON.stringify({ properties }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createProperty(supabase: any, userId: string, propertyData: any) {
  console.log(`[CREATE-PROPERTY] Creating property for user: ${userId}`)

  const { data: property, error } = await supabase
    .from('properties')
    .insert({
      manager_id: userId,
      property_name: propertyData.property_name,
      property_address: propertyData.property_address,
      property_type: propertyData.property_type || 'apartment',
      city: propertyData.city,
      state: propertyData.state,
      zip_code: propertyData.zip_code,
    })
    .select()
    .single()

  if (error) {
    console.error('[CREATE-PROPERTY] Error:', error)
    throw error
  }

  console.log(`[CREATE-PROPERTY] Created property: ${property.id}`)

  return new Response(
    JSON.stringify({ property }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function getUnits(supabase: any, userId: string, propertyId: string) {
  console.log(`[GET-UNITS] Fetching units for property: ${propertyId}`)

  // First verify the property belongs to the user
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id')
    .eq('id', propertyId)
    .eq('manager_id', userId)
    .single()

  if (propertyError || !property) {
    throw new Error('Property not found or access denied')
  }

  const { data: units, error } = await supabase
    .from('units')
    .select(`
      id,
      unit_number,
      status,
      rent_amount,
      tenant_name,
      tenant_email,
      tenant_phone,
      lease_start,
      lease_end,
      created_at,
      updated_at
    `)
    .eq('property_id', propertyId)
    .order('unit_number', { ascending: true })

  if (error) {
    console.error('[GET-UNITS] Error:', error)
    throw error
  }

  // Get maintenance request counts for each unit
  const unitIds = units?.map(unit => unit.id) || []
  const { data: maintenanceRequests } = await supabase
    .from('job_requests')
    .select('id, unit_id')
    .in('unit_id', unitIds)
    .eq('status', 'pending')

  // Add maintenance request counts to units
  const unitsWithMaintenance = units?.map(unit => ({
    ...unit,
    maintenance_requests: maintenanceRequests?.filter(req => req.unit_id === unit.id).length || 0
  }))

  console.log(`[GET-UNITS] Found ${units?.length || 0} units`)

  return new Response(
    JSON.stringify({ units: unitsWithMaintenance }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function createUnit(supabase: any, userId: string, propertyId: string, unitData: any) {
  console.log(`[CREATE-UNIT] Creating unit for property: ${propertyId}`)

  // First verify the property belongs to the user and is approved
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('id, status')
    .eq('id', propertyId)
    .eq('manager_id', userId)
    .eq('status', 'approved')
    .single()

  if (propertyError || !property) {
    throw new Error('Property not found, not approved, or access denied. Units can only be added to approved properties.')
  }

  const { data: unit, error } = await supabase
    .from('units')
    .insert({
      manager_id: userId,
      property_id: propertyId,
      unit_number: unitData.unit_number,
      status: unitData.status || 'vacant',
      rent_amount: unitData.rent_amount,
      tenant_name: unitData.tenant_name,
      tenant_email: unitData.tenant_email,
      tenant_phone: unitData.tenant_phone,
      lease_start: unitData.lease_start,
      lease_end: unitData.lease_end,
    })
    .select()
    .single()

  if (error) {
    console.error('[CREATE-UNIT] Error:', error)
    throw error
  }

  console.log(`[CREATE-UNIT] Created unit: ${unit.id}`)

  return new Response(
    JSON.stringify({ unit }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function updateUnit(supabase: any, userId: string, unitId: string, unitData: any) {
  console.log(`[UPDATE-UNIT] Updating unit: ${unitId}`)

  // First verify the unit belongs to the user
  const { data: unit, error: unitError } = await supabase
    .from('units')
    .select('id')
    .eq('id', unitId)
    .eq('manager_id', userId)
    .single()

  if (unitError || !unit) {
    throw new Error('Unit not found or access denied')
  }

  const { data: updatedUnit, error } = await supabase
    .from('units')
    .update({
      unit_number: unitData.unit_number,
      status: unitData.status,
      rent_amount: unitData.rent_amount,
      tenant_name: unitData.tenant_name,
      tenant_email: unitData.tenant_email,
      tenant_phone: unitData.tenant_phone,
      lease_start: unitData.lease_start,
      lease_end: unitData.lease_end,
    })
    .eq('id', unitId)
    .select()
    .single()

  if (error) {
    console.error('[UPDATE-UNIT] Error:', error)
    throw error
  }

  console.log(`[UPDATE-UNIT] Updated unit: ${unitId}`)

  return new Response(
    JSON.stringify({ unit: updatedUnit }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function deleteUnit(supabase: any, userId: string, unitId: string) {
  console.log(`[DELETE-UNIT] Deleting unit: ${unitId}`)

  // First verify the unit belongs to the user
  const { data: unit, error: unitError } = await supabase
    .from('units')
    .select('id')
    .eq('id', unitId)
    .eq('manager_id', userId)
    .single()

  if (unitError || !unit) {
    throw new Error('Unit not found or access denied')
  }

  const { error } = await supabase
    .from('units')
    .delete()
    .eq('id', unitId)

  if (error) {
    console.error('[DELETE-UNIT] Error:', error)
    throw error
  }

  console.log(`[DELETE-UNIT] Deleted unit: ${unitId}`)

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}