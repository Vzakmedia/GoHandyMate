-- Simplify user roles to: customer, provider, admin

-- Step 1: Drop the default on user_role (it depends on the enum type)
ALTER TABLE public.profiles ALTER COLUMN user_role DROP DEFAULT;

-- Step 2: Convert column to TEXT
ALTER TABLE public.profiles ALTER COLUMN user_role TYPE TEXT USING user_role::text;

-- Step 3: Migrate old values to new ones
UPDATE public.profiles SET user_role = 'provider' WHERE user_role IN ('handyman', 'contractor');
UPDATE public.profiles SET user_role = 'customer' WHERE user_role = 'property_manager';

-- Step 4: Drop the old enum (no dependents now)
DROP TYPE IF EXISTS user_role_type;

-- Step 5: Recreate enum with only the 3 new values
CREATE TYPE user_role_type AS ENUM ('customer', 'provider', 'admin');

-- Step 6: Convert column back to the new enum and restore default
ALTER TABLE public.profiles
  ALTER COLUMN user_role TYPE user_role_type USING user_role::user_role_type;

ALTER TABLE public.profiles
  ALTER COLUMN user_role SET DEFAULT 'customer'::user_role_type;

-- Step 7: Update the handle_new_user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, user_role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE NEW.raw_user_meta_data->>'user_role'
      WHEN 'provider' THEN 'provider'::user_role_type
      WHEN 'admin'    THEN 'admin'::user_role_type
      ELSE                 'customer'::user_role_type
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
