-- Create a safer admin_delete_user function that only targets confirmed table structures
CREATE OR REPLACE FUNCTION public.admin_delete_user(user_id_to_delete uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_email text;
BEGIN
  -- Get the admin email from JWT to avoid recursion
  admin_email := auth.jwt() ->> 'email';
  
  -- Check if the caller is an admin using direct email check
  IF NOT (admin_email = 'admin@gohandymate.com' OR admin_email LIKE '%@admin.gohandymate.com' OR admin_email = 'admin@admin.gohandymate.com' OR admin_email = 'support@gohandymate.com') THEN
    RAISE EXCEPTION 'Only admins can delete user accounts';
  END IF;
  
  -- Delete from tables in order of dependencies, using only confirmed column names
  
  -- Tables with user_id column
  DELETE FROM admin_verification_logs WHERE user_id = user_id_to_delete;
  DELETE FROM chat_agents WHERE user_id = user_id_to_delete;
  DELETE FROM handyman WHERE user_id = user_id_to_delete;
  DELETE FROM business_profiles WHERE user_id = user_id_to_delete;
  DELETE FROM handyman_locations WHERE user_id = user_id_to_delete;
  DELETE FROM handyman_availability_slots WHERE user_id = user_id_to_delete;
  DELETE FROM community_messages WHERE user_id = user_id_to_delete;
  DELETE FROM community_message_likes WHERE user_id = user_id_to_delete;
  DELETE FROM group_members WHERE user_id = user_id_to_delete;
  DELETE FROM advertisements WHERE user_id = user_id_to_delete;
  DELETE FROM advertisement_interactions WHERE user_id = user_id_to_delete;
  DELETE FROM subscription_logs WHERE user_id = user_id_to_delete;
  DELETE FROM external_integrations WHERE user_id = user_id_to_delete;
  DELETE FROM business_settings WHERE user_id = user_id_to_delete;
  
  -- Tables with created_by column
  DELETE FROM community_groups WHERE created_by = user_id_to_delete;
  
  -- Tables with contractor_id column
  DELETE FROM contractor_metrics WHERE contractor_id = user_id_to_delete;
  DELETE FROM contractor_projects WHERE contractor_id = user_id_to_delete;
  DELETE FROM contractor_automation_settings WHERE contractor_id = user_id_to_delete;
  
  -- Tables with manager_id column
  DELETE FROM properties WHERE manager_id = user_id_to_delete;
  
  -- Tables with sender_id column
  DELETE FROM chat_messages WHERE sender_id = user_id_to_delete;
  
  -- Tables with recipient_id column  
  DELETE FROM quote_notifications WHERE recipient_id = user_id_to_delete;
  
  -- Chat sessions (customer_id and agent_id)
  DELETE FROM chat_sessions WHERE customer_id = user_id_to_delete OR agent_id = user_id_to_delete;
  
  -- Emergency reports (reporter_id and responder_id)
  DELETE FROM emergency_reports WHERE reporter_id = user_id_to_delete OR responder_id = user_id_to_delete;
  
  -- Finally delete from profiles table
  DELETE FROM profiles WHERE id = user_id_to_delete;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but continue
    RAISE NOTICE 'Error during deletion: %', SQLERRM;
    RETURN FALSE;
END;
$$;