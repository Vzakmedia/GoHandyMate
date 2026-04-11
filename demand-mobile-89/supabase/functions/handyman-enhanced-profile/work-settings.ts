
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export async function getWorkSettings(supabaseClient: any, userId: string) {
  console.log('Getting work settings for user:', userId);
  
  const { data, error } = await supabaseClient
    .from('handyman_work_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching work settings:', error);
    throw error;
  }

  console.log('Work settings data:', data);

  return new Response(
    JSON.stringify({ success: true, settings: data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

export async function updateWorkSettings(supabaseClient: any, serviceRoleClient: any, userId: string, settings: any) {
  console.log('Updating work settings for user:', userId, 'with settings:', settings);
  
  try {
    // Prepare the settings object with proper field mapping (removed preferred_job_types)
    const settingsToSave = {
      user_id: userId,
      minimum_job_amount: settings.minimum_job_amount || 50,
      travel_fee_per_mile: settings.travel_fee_per_mile || 0.5,
      travel_fee_enabled: settings.travel_fee_enabled || false,
      advance_booking_days: settings.advance_booking_days || 30,
      instant_booking: settings.instant_booking || false,
      emergency_available: settings.emergency_available || false,
      same_day_available: settings.same_day_available || false,
      blackout_dates: settings.blackout_dates || [],
      updated_at: new Date().toISOString()
    };

    console.log('Settings to save:', settingsToSave);

    // Use upsert to either insert or update
    const { data, error } = await serviceRoleClient
      .from('handyman_work_settings')
      .upsert(settingsToSave, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting work settings:', error);
      throw error;
    }

    console.log('Work settings saved successfully:', data);

    return new Response(
      JSON.stringify({ success: true, settings: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in updateWorkSettings:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to update work settings' 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}
