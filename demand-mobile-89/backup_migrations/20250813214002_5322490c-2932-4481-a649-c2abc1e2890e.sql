-- CRITICAL SECURITY FIX: Remove dangerous public access to profiles table
-- This policy was allowing anyone (including unauthenticated users) to read ALL profile data
-- including emails, phone numbers, addresses, and payment information

-- Drop the dangerous policy that allows public access to all profiles
DROP POLICY IF EXISTS "Public can view profiles for metrics" ON public.profiles;

-- Ensure we still have proper policies for legitimate access:
-- 1. Users can view their own profile (already exists)
-- 2. Admins can view all profiles (already exists)
-- 3. For any legitimate business metrics needs, create specific views or functions
--    that expose only non-sensitive aggregated data

-- Optional: Create a safe view for public metrics if needed (uncomment if required)
-- CREATE OR REPLACE VIEW public.profile_metrics AS
-- SELECT 
--   user_role,
--   account_status,
--   subscription_plan,
--   DATE_TRUNC('month', created_at) as signup_month,
--   city, -- Only if city data is not sensitive for your use case
--   COUNT(*) as user_count
-- FROM public.profiles
-- GROUP BY user_role, account_status, subscription_plan, DATE_TRUNC('month', created_at), city;

-- Grant access to the metrics view for authenticated users only
-- GRANT SELECT ON public.profile_metrics TO authenticated;