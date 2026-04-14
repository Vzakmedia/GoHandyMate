-- Fix admin_delete_user function with correct column names
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
  
  -- Delete from tables that reference the user first to avoid foreign key constraint violations
  -- Only delete from tables and columns that actually exist
  
  -- Delete from admin_verification_logs
  DELETE FROM admin_verification_logs WHERE user_id = user_id_to_delete;
  
  -- Delete from chat related tables
  DELETE FROM chat_sessions WHERE customer_id = user_id_to_delete OR agent_id = user_id_to_delete;
  DELETE FROM chat_agents WHERE user_id = user_id_to_delete;
  DELETE FROM chat_messages WHERE sender_id = user_id_to_delete;
  
  -- Delete from handyman and business profiles
  DELETE FROM handyman WHERE user_id = user_id_to_delete;
  DELETE FROM business_profiles WHERE user_id = user_id_to_delete;
  DELETE FROM handyman_locations WHERE user_id = user_id_to_delete;
  DELETE FROM handyman_availability_slots WHERE user_id = user_id_to_delete;
  
  -- Delete from job related tables
  DELETE FROM job_requests WHERE customer_id = user_id_to_delete OR assigned_to_user_id = user_id_to_delete;
  DELETE FROM job_ratings WHERE customer_id = user_id_to_delete OR provider_id = user_id_to_delete;
  DELETE FROM job_messages WHERE sender_id = user_id_to_delete;
  
  -- Delete from payment related tables
  DELETE FROM escrow_payments WHERE customer_id = user_id_to_delete OR provider_id = user_id_to_delete;
  DELETE FROM commission_records WHERE provider_id = user_id_to_delete;
  
  -- Delete from contractor related tables
  DELETE FROM contractor_metrics WHERE contractor_id = user_id_to_delete;
  DELETE FROM contractor_projects WHERE contractor_id = user_id_to_delete;
  DELETE FROM contractor_quote_requests WHERE customer_id = user_id_to_delete OR contractor_id = user_id_to_delete;
  DELETE FROM contractor_quote_submissions WHERE customer_id = user_id_to_delete;
  DELETE FROM contractor_automation_settings WHERE contractor_id = user_id_to_delete;
  
  -- Delete from quote related tables
  DELETE FROM custom_quote_requests WHERE customer_id = user_id_to_delete;
  DELETE FROM quote_submissions WHERE customer_id = user_id_to_delete OR handyman_id = user_id_to_delete;
  DELETE FROM quote_notifications WHERE recipient_id = user_id_to_delete;
  
  -- Delete from community related tables
  DELETE FROM community_messages WHERE user_id = user_id_to_delete;
  DELETE FROM community_message_likes WHERE user_id = user_id_to_delete;
  DELETE FROM group_members WHERE user_id = user_id_to_delete;
  DELETE FROM community_groups WHERE created_by = user_id_to_delete;
  
  -- Delete from advertisement related tables
  DELETE FROM advertisements WHERE user_id = user_id_to_delete;
  DELETE FROM advertisement_interactions WHERE user_id = user_id_to_delete;
  
  -- Delete from other user-related tables
  DELETE FROM subscription_logs WHERE user_id = user_id_to_delete;
  DELETE FROM external_integrations WHERE user_id = user_id_to_delete;
  DELETE FROM business_settings WHERE user_id = user_id_to_delete;
  DELETE FROM emergency_reports WHERE reporter_id = user_id_to_delete OR responder_id = user_id_to_delete;
  DELETE FROM properties WHERE manager_id = user_id_to_delete;
  
  -- Finally delete from profiles table
  DELETE FROM profiles WHERE id = user_id_to_delete;
  
  RETURN TRUE;
END;
$$;