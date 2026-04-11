
import { supabase } from '@/integrations/supabase/client';

export const useProfileValidation = () => {
  const validateProfile = async (userId: string) => {
    console.log('useProfileValidation: Checking profile for userId:', userId);

    // Check if profile exists - use maybeSingle to avoid errors
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_role, full_name')
      .eq('id', userId)
      .maybeSingle();

    console.log('useProfileValidation: Profile check result:', { profileData, profileError });

    if (profileError) {
      console.warn('useProfileValidation: Profile query error (continuing anyway):', profileError);
    }

    // Check handyman record for fallback user_id (only user_id, no personal info)
    const { data: handymanRecord, error: handymanError } = await supabase
      .from('handyman')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    console.log('useProfileValidation: Handyman record check:', { handymanRecord, handymanError });

    // Return the actual user_id to use (fallback to original if needed)
    const actualUserId = handymanRecord?.user_id || userId;
    console.log('useProfileValidation: Using actualUserId:', actualUserId);

    return { actualUserId, profileExists: !!profileData };
  };

  return { validateProfile };
};
