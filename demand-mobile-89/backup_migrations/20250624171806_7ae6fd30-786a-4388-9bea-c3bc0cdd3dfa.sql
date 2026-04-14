
-- Add the account_status column first as text
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS account_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verified_by_admin_id uuid,
ADD COLUMN IF NOT EXISTS verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Create enum for account statuses
DO $$ BEGIN
    CREATE TYPE account_status_enum AS ENUM ('pending', 'active', 'rejected', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing account_status values to be compatible (set defaults for existing users)
UPDATE public.profiles 
SET account_status = CASE 
  WHEN user_role IN ('handyman', 'contractor') THEN 'pending'
  ELSE 'active'
END
WHERE account_status IS NULL;

-- Drop the default temporarily
ALTER TABLE public.profiles 
ALTER COLUMN account_status DROP DEFAULT;

-- Convert the column type properly
ALTER TABLE public.profiles 
ALTER COLUMN account_status TYPE account_status_enum USING 
  CASE 
    WHEN account_status = 'pending' THEN 'pending'::account_status_enum
    WHEN account_status = 'active' THEN 'active'::account_status_enum  
    WHEN account_status = 'rejected' THEN 'rejected'::account_status_enum
    WHEN account_status = 'suspended' THEN 'suspended'::account_status_enum
    ELSE 'active'::account_status_enum
  END;

-- Set the new default
ALTER TABLE public.profiles 
ALTER COLUMN account_status SET DEFAULT 'pending'::account_status_enum;

-- Create RLS policies for role-based access
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can only view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles  
FOR UPDATE USING (auth.uid() = id);

-- Create admin verification function
CREATE OR REPLACE FUNCTION public.verify_user_account(
  user_id_to_verify uuid,
  admin_id uuid,
  new_status account_status_enum,
  reason text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_profile RECORD;
BEGIN
  -- Check if the caller is an admin (using email check since admin role doesn't exist in enum)
  SELECT * INTO admin_profile FROM public.profiles 
  WHERE id = admin_id AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com');
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Only admins can verify user accounts';
  END IF;
  
  -- Update the user's account status
  UPDATE public.profiles 
  SET 
    account_status = new_status,
    verified_by_admin_id = CASE WHEN new_status = 'active' THEN admin_id ELSE NULL END,
    verified_at = CASE WHEN new_status = 'active' THEN now() ELSE NULL END,
    rejection_reason = CASE WHEN new_status = 'rejected' THEN reason ELSE NULL END,
    updated_at = now()
  WHERE id = user_id_to_verify;
  
  RETURN TRUE;
END;
$$;

-- Update the handle_new_user function to set proper default status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role_value text;
BEGIN
  user_role_value := COALESCE(NEW.raw_user_meta_data->>'user_role', 'customer');
  
  INSERT INTO public.profiles (id, email, full_name, user_role, account_status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role_value,
    CASE 
      WHEN user_role_value IN ('handyman', 'contractor') THEN 'pending'::account_status_enum
      ELSE 'active'::account_status_enum
    END
  );
  RETURN NEW;
END;
$$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_account_status ON public.profiles(account_status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);
