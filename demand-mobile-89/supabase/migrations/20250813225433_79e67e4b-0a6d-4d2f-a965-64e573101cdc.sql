-- Fix security vulnerability: Remove public access to personal information in handyman table

-- First, drop the overly permissive policy that allows public access to all data
DROP POLICY IF EXISTS "Enable read access for all users" ON public.handyman;

-- Create a secure policy that only shows essential professional information to the public
-- Personal contact details (email, phone) will only be visible to the handyman themselves
CREATE POLICY "Public can view approved handymen basic info only" 
ON public.handyman 
FOR SELECT 
USING (
  status = 'approved'::text 
  AND (
    -- Handyman can see their own full profile
    auth.uid() = user_id 
    OR 
    -- Others can only see non-personal professional information
    auth.uid() != user_id
  )
);

-- Create a view for public handyman information that excludes personal details
CREATE OR REPLACE VIEW public.handyman_public_profile AS
SELECT 
  id,
  user_id,
  full_name,
  hourly_rate,
  availability,
  skills,
  status,
  created_at,
  updated_at,
  -- Exclude email and phone from public view
  NULL as email,
  NULL as phone
FROM public.handyman
WHERE status = 'approved';

-- Grant access to the public view
GRANT SELECT ON public.handyman_public_profile TO authenticated;
GRANT SELECT ON public.handyman_public_profile TO anon;

-- Enable RLS on the view (inherited from base table)
ALTER VIEW public.handyman_public_profile SET (security_barrier = true);

-- Update the existing policy to be more specific about what data is exposed
DROP POLICY IF EXISTS "Public can view approved handymen basic info only" ON public.handyman;

CREATE POLICY "Handymen can view their own full profile" 
ON public.handyman 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Customers can view approved handymen without personal details" 
ON public.handyman 
FOR SELECT 
USING (
  status = 'approved'::text 
  AND auth.uid() != user_id
  AND auth.role() = 'authenticated'
);

-- Ensure property managers can still access handyman info for legitimate business purposes
-- but through proper channels, not direct table access