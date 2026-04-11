
import { syncSkillWithServiceCategory } from './skill-service-sync.ts';

export const getSkillRates = async (supabaseClient: any, userId: string) => {
  try {
    console.log('getSkillRates: Fetching for user:', userId);
    
    const { data, error } = await supabaseClient
      .from('handyman_skill_rates')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log('getSkillRates: Query result:', { data, error });

    if (error) {
      console.error('getSkillRates: Database error:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        skillRates: data || [] 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('getSkillRates: Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        skillRates: [] 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
};

export const updateSkillRates = async (
  supabaseClient: any, 
  serviceRoleClient: any, 
  userId: string, 
  skillRates: any[]
) => {
  try {
    console.log('updateSkillRates: Starting update for user:', userId);
    console.log('updateSkillRates: Skill rates to update:', skillRates);

    // First, get existing skill rates to compare changes
    const { data: existingSkills } = await supabaseClient
      .from('handyman_skill_rates')
      .select('skill_name, is_active')
      .eq('user_id', userId);

    const existingSkillMap = new Map(
      (existingSkills || []).map(skill => [skill.skill_name, skill.is_active])
    );

    // Delete all existing skill rates for this user
    const { error: deleteError } = await serviceRoleClient
      .from('handyman_skill_rates')
      .delete()
      .eq('user_id', userId);

    if (deleteError) {
      console.error('updateSkillRates: Error deleting existing records:', deleteError);
      throw deleteError;
    }

    if (skillRates && skillRates.length > 0) {
      // Prepare skill rates data with proper user_id
      const skillRatesWithUserId = skillRates.map(rate => ({
        ...rate,
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      console.log('updateSkillRates: Inserting skill rates:', skillRatesWithUserId);

      // Insert new skill rates
      const { data: insertedData, error: insertError } = await serviceRoleClient
        .from('handyman_skill_rates')
        .insert(skillRatesWithUserId)
        .select();

      if (insertError) {
        console.error('updateSkillRates: Error inserting skill rates:', insertError);
        throw insertError;
      }

      console.log('updateSkillRates: Successfully inserted skill rates:', insertedData);

      // Sync with service categories for each skill
      for (const skillRate of skillRates) {
        const wasActive = existingSkillMap.get(skillRate.skill_name) || false;
        const isNowActive = skillRate.is_active;

        // Only sync if the active status changed
        if (wasActive !== isNowActive) {
          try {
            await syncSkillWithServiceCategory(
              supabaseClient,
              serviceRoleClient,
              userId,
              skillRate.skill_name,
              isNowActive
            );
          } catch (syncError) {
            console.error('updateSkillRates: Sync error for skill:', skillRate.skill_name, syncError);
            // Don't throw - we want to continue with other syncs
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Skill rates updated successfully'
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('updateSkillRates: Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
};
