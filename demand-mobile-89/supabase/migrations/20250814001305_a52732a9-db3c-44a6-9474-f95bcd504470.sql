-- Update admin_delete_user function to handle foreign key constraints properly
CREATE OR REPLACE FUNCTION public.admin_delete_user(user_id_to_delete uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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
  -- Delete from admin_verification_logs
  DELETE FROM public.admin_verification_logs WHERE user_id = user_id_to_delete;
  
  -- Delete from other tables that might reference the user
  DELETE FROM public.chat_sessions WHERE customer_id = user_id_to_delete OR agent_id = user_id_to_delete;
  DELETE FROM public.chat_agents WHERE user_id = user_id_to_delete;
  DELETE FROM public.handyman WHERE user_id = user_id_to_delete;
  DELETE FROM public.business_profiles WHERE user_id = user_id_to_delete;
  DELETE FROM public.handyman_locations WHERE user_id = user_id_to_delete;
  DELETE FROM public.job_requests WHERE customer_id = user_id_to_delete OR assigned_to_user_id = user_id_to_delete;
  DELETE FROM public.escrow_payments WHERE customer_id = user_id_to_delete OR provider_id = user_id_to_delete;
  DELETE FROM public.commission_records WHERE provider_id = user_id_to_delete;
  DELETE FROM public.contractor_metrics WHERE contractor_id = user_id_to_delete;
  DELETE FROM public.contractor_projects WHERE contractor_id = user_id_to_delete;
  DELETE FROM public.contractor_quote_requests WHERE customer_id = user_id_to_delete OR contractor_id = user_id_to_delete;
  DELETE FROM public.contractor_quote_submissions WHERE customer_id = user_id_to_delete;
  DELETE FROM public.custom_quote_requests WHERE customer_id = user_id_to_delete;
  DELETE FROM public.quote_submissions WHERE customer_id = user_id_to_delete OR handyman_id = user_id_to_delete;
  DELETE FROM public.community_messages WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_message_likes WHERE user_id = user_id_to_delete;
  DELETE FROM public.group_members WHERE user_id = user_id_to_delete;
  DELETE FROM public.community_groups WHERE created_by = user_id_to_delete;
  DELETE FROM public.advertisements WHERE user_id = user_id_to_delete;
  DELETE FROM public.advertisement_interactions WHERE user_id = user_id_to_delete;
  DELETE FROM public.subscription_logs WHERE user_id = user_id_to_delete;
  DELETE FROM public.external_integrations WHERE user_id = user_id_to_delete;
  DELETE FROM public.business_settings WHERE user_id = user_id_to_delete;
  DELETE FROM public.contractor_automation_settings WHERE contractor_id = user_id_to_delete;
  DELETE FROM public.handyman_availability_slots WHERE user_id = user_id_to_delete;
  DELETE FROM public.emergency_reports WHERE reporter_id = user_id_to_delete OR responder_id = user_id_to_delete;
  DELETE FROM public.properties WHERE manager_id = user_id_to_delete;
  
  -- Finally delete from profiles table
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  -- Note: Auth user deletion requires service role and should be handled separately
  -- The profile deletion will effectively disable the user
  
  RETURN TRUE;
END;
$$;