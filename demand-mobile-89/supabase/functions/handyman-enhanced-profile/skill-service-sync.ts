
export const syncSkillWithServiceCategory = async (
  supabaseClient: any,
  serviceRoleClient: any,
  userId: string,
  skillName: string,
  isActive: boolean
) => {
  console.log('syncSkillWithServiceCategory: Starting sync for:', { userId, skillName, isActive });

  try {
    // Find the corresponding service category for this skill
    // This will be handled by the frontend mapping logic
    
    if (isActive) {
      // When skill is activated, also activate the corresponding service category
      const { data: existingPricing, error: fetchError } = await supabaseClient
        .from('handyman_service_pricing')
        .select('*')
        .eq('user_id', userId)
        .eq('category_id', skillName) // Using skill name as category lookup
        .is('subcategory_id', null);

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('syncSkillWithServiceCategory: Error fetching service pricing:', fetchError);
        throw fetchError;
      }

      if (!existingPricing || existingPricing.length === 0) {
        // Create new service category pricing entry
        const { error: insertError } = await serviceRoleClient
          .from('handyman_service_pricing')
          .insert({
            user_id: userId,
            category_id: skillName,
            subcategory_id: null,
            base_price: 100, // Default base price
            is_active: true,
            same_day_multiplier: 1.5,
            emergency_multiplier: 2.0
          });

        if (insertError) {
          console.error('syncSkillWithServiceCategory: Error creating service pricing:', insertError);
          throw insertError;
        }

        console.log('syncSkillWithServiceCategory: Created service category pricing for skill:', skillName);
      } else {
        // Update existing service category to active
        const { error: updateError } = await serviceRoleClient
          .from('handyman_service_pricing')
          .update({ is_active: true })
          .eq('user_id', userId)
          .eq('category_id', skillName)
          .is('subcategory_id', null);

        if (updateError) {
          console.error('syncSkillWithServiceCategory: Error updating service pricing:', updateError);
          throw updateError;
        }

        console.log('syncSkillWithServiceCategory: Updated service category pricing for skill:', skillName);
      }
    } else {
      // When skill is deactivated, also deactivate the corresponding service category
      const { error: updateError } = await serviceRoleClient
        .from('handyman_service_pricing')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('category_id', skillName)
        .is('subcategory_id', null);

      if (updateError) {
        console.error('syncSkillWithServiceCategory: Error deactivating service pricing:', updateError);
        throw updateError;
      }

      console.log('syncSkillWithServiceCategory: Deactivated service category pricing for skill:', skillName);
    }

    return { success: true };
  } catch (error) {
    console.error('syncSkillWithServiceCategory: Error:', error);
    throw error;
  }
};

export const syncServiceCategoryWithSkill = async (
  supabaseClient: any,
  serviceRoleClient: any,
  userId: string,
  categoryId: string,
  isActive: boolean
) => {
  console.log('syncServiceCategoryWithSkill: Starting sync for:', { userId, categoryId, isActive });

  try {
    if (isActive) {
      // When service category is activated, also activate the corresponding skill
      const { data: existingSkill, error: fetchError } = await supabaseClient
        .from('handyman_skill_rates')
        .select('*')
        .eq('user_id', userId)
        .eq('skill_name', categoryId);

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('syncServiceCategoryWithSkill: Error fetching skill:', fetchError);
        throw fetchError;
      }

      if (!existingSkill || existingSkill.length === 0) {
        // Create new skill entry
        const { error: insertError } = await serviceRoleClient
          .from('handyman_skill_rates')
          .insert({
            user_id: userId,
            skill_name: categoryId,
            hourly_rate: 50, // Default hourly rate
            minimum_hours: 1.0,
            same_day_rate_multiplier: 1.5,
            emergency_rate_multiplier: 2.0,
            experience_level: 'Intermediate',
            is_active: true
          });

        if (insertError) {
          console.error('syncServiceCategoryWithSkill: Error creating skill:', insertError);
          throw insertError;
        }

        console.log('syncServiceCategoryWithSkill: Created skill for service category:', categoryId);
      } else {
        // Update existing skill to active
        const { error: updateError } = await serviceRoleClient
          .from('handyman_skill_rates')
          .update({ is_active: true })
          .eq('user_id', userId)
          .eq('skill_name', categoryId);

        if (updateError) {
          console.error('syncServiceCategoryWithSkill: Error updating skill:', updateError);
          throw updateError;
        }

        console.log('syncServiceCategoryWithSkill: Updated skill for service category:', categoryId);
      }
    } else {
      // When service category is deactivated, also deactivate the corresponding skill
      const { error: updateError } = await serviceRoleClient
        .from('handyman_skill_rates')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('skill_name', categoryId);

      if (updateError) {
        console.error('syncServiceCategoryWithSkill: Error deactivating skill:', updateError);
        throw updateError;
      }

      console.log('syncServiceCategoryWithSkill: Deactivated skill for service category:', categoryId);
    }

    return { success: true };
  } catch (error) {
    console.error('syncServiceCategoryWithSkill: Error:', error);
    throw error;
  }
};
