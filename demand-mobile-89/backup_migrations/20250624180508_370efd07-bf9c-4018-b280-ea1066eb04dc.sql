
-- Create admin verification logs table
CREATE TABLE IF NOT EXISTS public.admin_verification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.profiles(id) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'reject', 'suspend')),
  previous_status account_status_enum,
  new_status account_status_enum NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on admin verification logs
ALTER TABLE public.admin_verification_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin verification logs - only admins can view
CREATE POLICY "Only admins can view verification logs" ON public.admin_verification_logs
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
  )
);

-- Create policy for admin verification logs - only admins can insert
CREATE POLICY "Only admins can create verification logs" ON public.admin_verification_logs
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
  )
);

-- Enhanced admin verification function with logging
CREATE OR REPLACE FUNCTION public.admin_verify_account(
  user_id_to_verify uuid,
  new_status account_status_enum,
  reason text DEFAULT NULL
)
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

-- Function to get pending verification counts
CREATE OR REPLACE FUNCTION public.get_pending_verification_stats()
RETURNS TABLE (
  pending_handymen BIGINT,
  pending_contractors BIGINT,
  total_pending BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
  ) THEN
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_account_status_role ON public.profiles(account_status, user_role);
CREATE INDEX IF NOT EXISTS idx_admin_verification_logs_admin_id ON public.admin_verification_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_verification_logs_user_id ON public.admin_verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_verification_logs_created_at ON public.admin_verification_logs(created_at DESC);
