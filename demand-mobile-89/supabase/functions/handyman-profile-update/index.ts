
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
    const { profileData, userId, skills, profilePicture } = await req.json()
    
    console.log(`[HANDYMAN-PROFILE-UPDATE] Updating profile for user ${userId}`)
    console.log(`[HANDYMAN-PROFILE-UPDATE] Profile data:`, profileData)
    console.log(`[HANDYMAN-PROFILE-UPDATE] Skills data:`, skills)
    console.log(`[HANDYMAN-PROFILE-UPDATE] Profile picture:`, profilePicture)

    // Check if user exists and is a handyman
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (profileError || profile?.user_role !== 'handyman') {
      console.error('[HANDYMAN-PROFILE-UPDATE] User verification failed:', profileError || 'Invalid role')
      throw new Error('User not found or not authorized')
    }

    console.log('[HANDYMAN-PROFILE-UPDATE] User verified as handyman')

    // Update profiles table with enhanced data
    const profileUpdateData = {
      full_name: profileData.name,
      updated_at: new Date().toISOString()
    }

    // Add profile picture URL if provided
    if (profilePicture) {
      profileUpdateData.avatar_url = profilePicture
    }

    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update(profileUpdateData)
      .eq('id', userId)

    if (profileUpdateError) {
      console.error('[HANDYMAN-PROFILE-UPDATE] Profile update error:', profileUpdateError)
      throw profileUpdateError
    }

    console.log('[HANDYMAN-PROFILE-UPDATE] Profile table updated successfully')

    // Check if handyman record exists
    const { data: existingHandyman, error: checkError } = await supabase
      .from('handyman')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle()

    if (checkError) {
      console.error('[HANDYMAN-PROFILE-UPDATE] Error checking existing handyman:', checkError)
    }

    // Prepare skills array - extract skill names if skills parameter is provided
    let skillsArray = [];
    if (skills && Array.isArray(skills)) {
      skillsArray = skills.map(skill => typeof skill === 'string' ? skill : skill.name || skill.skill);
    } else if (profileData.skills && Array.isArray(profileData.skills)) {
      skillsArray = profileData.skills;
    }

    // Enhanced handyman data with location and bio
    const handymanData = {
      user_id: userId,
      full_name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      hourly_rate: profileData.hourlyRate || profileData.rate,
      availability: profileData.availability,
      skills: skillsArray,
      updated_at: new Date().toISOString()
    }

    console.log('[HANDYMAN-PROFILE-UPDATE] Handyman data to insert/update:', handymanData)

    if (existingHandyman) {
      // Update existing handyman record
      const { error: handymanUpdateError } = await supabase
        .from('handyman')
        .update(handymanData)
        .eq('user_id', userId)

      if (handymanUpdateError) {
        console.error('[HANDYMAN-PROFILE-UPDATE] Handyman update error:', handymanUpdateError)
        throw handymanUpdateError
      }
      console.log('[HANDYMAN-PROFILE-UPDATE] Handyman record updated')
    } else {
      // Create new handyman record
      const { error: handymanInsertError } = await supabase
        .from('handyman')
        .insert({
          ...handymanData,
          created_at: new Date().toISOString()
        })

      if (handymanInsertError) {
        console.error('[HANDYMAN-PROFILE-UPDATE] Handyman insert error:', handymanInsertError)
        throw handymanInsertError
      }
      console.log('[HANDYMAN-PROFILE-UPDATE] New handyman record created')
    }

    console.log(`[HANDYMAN-PROFILE-UPDATE] Successfully updated profile for user ${userId}`)

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Profile updated successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('[HANDYMAN-PROFILE-UPDATE] Error:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
