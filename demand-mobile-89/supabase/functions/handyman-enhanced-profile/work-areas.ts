
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function getWorkAreas(supabaseClient: any, userId: string) {
  const { data, error } = await supabaseClient
    .from('handyman_work_areas')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('priority_order')

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, areas: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

export async function updateWorkAreas(supabaseClient: any, userId: string, areas: any[]) {
  console.log('updateWorkAreas: Received areas:', areas);
  
  // Validate that areas is an array
  if (!Array.isArray(areas)) {
    console.error('updateWorkAreas: areas is not an array:', typeof areas, areas);
    throw new Error('Areas must be an array');
  }

  // Delete existing areas
  await supabaseClient
    .from('handyman_work_areas')
    .delete()
    .eq('user_id', userId)

  // Insert new areas
  const areasToInsert = areas.map((area, index) => ({
    user_id: userId,
    area_name: area.area_name,
    center_latitude: area.center_latitude,
    center_longitude: area.center_longitude,
    radius_miles: Math.min(area.radius_miles, 50), // Enforce 50-mile limit
    is_primary: area.is_primary || index === 0,
    travel_time_minutes: area.travel_time_minutes || 0,
    additional_travel_fee: area.additional_travel_fee || 0,
    priority_order: index + 1,
    is_active: area.is_active !== false,
    zip_code: area.zip_code || null,
    formatted_address: area.formatted_address || null
  }))

  console.log('updateWorkAreas: Areas to insert:', areasToInsert);

  const { error } = await supabaseClient
    .from('handyman_work_areas')
    .insert(areasToInsert)

  if (error) {
    console.error('updateWorkAreas: Insert error:', error);
    throw error;
  }

  console.log('updateWorkAreas: Successfully updated work areas');

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
