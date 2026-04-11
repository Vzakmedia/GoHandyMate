-- Update the handle_new_user function to automatically activate customers and property managers
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
  
  INSERT INTO public.profiles (id, email, full_name, user_role, account_status, subscription_plan)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role_value,
    CASE 
      WHEN user_role_value IN ('customer', 'property_manager') THEN 'active'::account_status_enum
      WHEN user_role_value IN ('handyman', 'contractor') THEN 'pending'::account_status_enum
      ELSE 'active'::account_status_enum
    END,
    -- Set default subscription plan for customers, null for others
    CASE 
      WHEN user_role_value = 'customer' THEN 'free'
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;