
-- Drop the existing problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create new policies that avoid recursion by using a more direct approach
-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Create a separate policy for admin access that doesn't cause recursion
-- This uses a direct email check without referencing the profiles table recursively
CREATE POLICY "Admin email access to all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated
USING (
  auth.jwt() ->> 'email' = 'admin@gohandymate.com' OR 
  auth.jwt() ->> 'email' LIKE '%@admin.gohandymate.com' OR
  auth.jwt() ->> 'email' = 'support@gohandymate.com'
);

-- Also update the admin_verify_account function to use the JWT email directly
CREATE OR REPLACE FUNCTION public.admin_verify_account(user_id_to_verify uuid, new_status account_status_enum, reason text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_email text;
  user_profile RECORD;
  previous_status account_status_enum;
BEGIN
  -- Get the admin email from JWT to avoid recursion
  admin_email := auth.jwt() ->> 'email';
  
  -- Check if the caller is an admin using direct email check
  IF NOT (admin_email = 'admin@gohandymate.com' OR admin_email LIKE '%@admin.gohandymate.com' OR admin_email = 'support@gohandymate.com') THEN
    RAISE EXCEPTION 'Only admins can verify user accounts';
  END IF;
  
  -- Get current user status
  SELECT account_status INTO previous_status FROM public.profiles 
  WHERE id = user_id_to_verify;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Update the user's account status
  UPDATE public.profiles 
  SET 
    account_status = new_status,
    verified_by_admin_id = CASE WHEN new_status = 'active' THEN auth.uid() ELSE NULL END,
    verified_at = CASE WHEN new_status = 'active' THEN now() ELSE NULL END,
    rejection_reason = CASE WHEN new_status = 'rejected' THEN reason ELSE NULL END,
    updated_at = now()
  WHERE id = user_id_to_verify;
  
  -- Log the verification action
  INSERT INTO public.admin_verification_logs (
    admin_id, 
    user_id, 
    action, 
    previous_status, 
    new_status, 
    reason
  ) VALUES (
    auth.uid(),
    user_id_to_verify,
    CASE 
      WHEN new_status = 'active' THEN 'approve'
      WHEN new_status = 'rejected' THEN 'reject'
      WHEN new_status = 'suspended' THEN 'suspend'
    END,
    previous_status,
    new_status,
    reason
  );
  
  RETURN TRUE;
END;
$$;

-- Update the get_pending_verification_stats function to use JWT email directly
CREATE OR REPLACE FUNCTION public.get_pending_verification_stats()
 RETURNS TABLE(pending_handymen bigint, pending_contractors bigint, total_pending bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  admin_email text;
BEGIN
  -- Get the admin email from JWT to avoid recursion
  admin_email := auth.jwt() ->> 'email';
  
  -- Check if the caller is an admin using direct email check
  IF NOT (admin_email = 'admin@gohandymate.com' OR admin_email LIKE '%@admin.gohandymate.com' OR admin_email = 'support@gohandymate.com') THEN
    RAISE EXCEPTION 'Only admins can access verification statistics';
  END IF;
  
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE user_role = 'handyman' AND account_status = 'pending') as pending_handymen,
    COUNT(*) FILTER (WHERE user_role = 'contractor' AND account_status = 'pending') as pending_contractors,
    COUNT(*) FILTER (WHERE account_status = 'pending') as total_pending
  FROM public.profiles
  WHERE user_role IN ('handyman', 'contractor');
END;
$$;
