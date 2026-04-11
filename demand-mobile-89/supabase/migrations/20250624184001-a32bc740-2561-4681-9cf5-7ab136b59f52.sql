
-- Ensure the admin_verify_account function has proper permissions and logging
CREATE OR REPLACE FUNCTION public.admin_verify_account(user_id_to_verify uuid, new_status account_status_enum, reason text DEFAULT NULL::text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_profile RECORD;
  user_profile RECORD;
  previous_status account_status_enum;
BEGIN
  -- Check if the caller is an admin
  SELECT * INTO admin_profile FROM public.profiles 
  WHERE id = auth.uid() AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com');
  
  IF NOT FOUND THEN
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

-- Enable RLS on admin_verification_logs if not already enabled
ALTER TABLE public.admin_verification_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Admins can view all verification logs" ON public.admin_verification_logs;
DROP POLICY IF EXISTS "Admins can insert verification logs" ON public.admin_verification_logs;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create RLS policies for admin_verification_logs
CREATE POLICY "Admins can view all verification logs" 
ON public.admin_verification_logs 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
  )
);

CREATE POLICY "Admins can insert verification logs" 
ON public.admin_verification_logs 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
  )
);

-- Create RLS policies for profiles table to allow admin access
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND (p.email = 'admin@gohandymate.com' OR p.email LIKE '%@admin.gohandymate.com')
  )
);

CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() = id OR 
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() 
    AND (p.email = 'admin@gohandymate.com' OR p.email LIKE '%@admin.gohandymate.com')
  )
);
