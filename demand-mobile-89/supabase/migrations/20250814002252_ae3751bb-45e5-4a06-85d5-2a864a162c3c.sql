-- Create minimal admin_delete_user function that focuses on core deletion
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
  
  -- Start with only the most essential deletions to avoid column errors
  
  -- 1. Delete from admin_verification_logs first (this was causing the original foreign key error)
  DELETE FROM admin_verification_logs WHERE user_id = user_id_to_delete;
  
  -- 2. Try to delete from profiles table
  DELETE FROM profiles WHERE id = user_id_to_delete;
  
  -- If we get here without error, the core deletion worked
  RETURN TRUE;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return false and raise notice about the error
    RAISE NOTICE 'Error during user deletion: %', SQLERRM;
    RETURN FALSE;
END;
$$;