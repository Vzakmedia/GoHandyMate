-- Create admin function to safely delete users
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
  
  -- Delete from profiles table first (this will cascade to other tables)
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  -- Note: Auth user deletion requires service role and should be handled separately
  -- The profile deletion will effectively disable the user
  
  RETURN TRUE;
END;
$$;