
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function getAvailabilitySlots(supabaseClient: any, userId: string, startDate: string, endDate: string) {
  const { data, error } = await supabaseClient
    .from('handyman_availability_slots')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('start_time')

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, slots: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

export async function updateAvailabilitySlots(supabaseClient: any, userId: string, slots: any[]) {
  // Delete existing slots for the date range
  if (slots.length > 0) {
    const dates = [...new Set(slots.map(slot => slot.date))]
    await supabaseClient
      .from('handyman_availability_slots')
      .delete()
      .eq('user_id', userId)
      .in('date', dates)
      .eq('is_booked', false)
  }

  // Insert new slots
  const slotsToInsert = slots.map(slot => ({
    user_id: userId,
    date: slot.date,
    start_time: slot.start_time,
    end_time: slot.end_time,
    slot_type: slot.slot_type || 'regular',
    price_multiplier: slot.price_multiplier || 1.0,
    notes: slot.notes
  }))

  if (slotsToInsert.length > 0) {
    const { error } = await supabaseClient
      .from('handyman_availability_slots')
      .insert(slotsToInsert)

    if (error) throw error
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
