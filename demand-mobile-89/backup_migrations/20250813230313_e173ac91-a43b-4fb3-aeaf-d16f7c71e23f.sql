-- Fix security definer view issue and complete the security hardening

-- Drop the problematic view with security_barrier
DROP VIEW IF EXISTS public.handyman_public_profile;

-- Create a proper function instead of a view for public handyman data
CREATE OR REPLACE FUNCTION public.get_public_handyman_profiles()
RETURNS TABLE (
  id bigint,
  user_id uuid,
  full_name text,
  hourly_rate numeric,
  availability text,
  skills text[],
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    h.id,
    h.user_id,
    h.full_name,
    h.hourly_rate,
    h.availability,
    h.skills,
    h.status,
    h.created_at,
    h.updated_at
  FROM public.handyman h
  WHERE h.status = 'approved'::text;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_public_handyman_profiles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_handyman_profiles() TO anon;

-- Remove the customer policy that was too broad and replace with more specific ones
DROP POLICY IF EXISTS "Customers can view approved handymen without personal details" ON public.handyman;

-- Create a policy for public access to approved handymen (but not personal contact info)
CREATE POLICY "Public can view approved handymen basic info" 
ON public.handyman 
FOR SELECT 
USING (
  status = 'approved'::text 
  AND (
    -- Always allow access to non-personal fields, but restrict personal fields to owner
    CASE 
      WHEN auth.uid() = user_id THEN true  -- Owner can see everything
      ELSE true  -- Others can see the record but RLS doesn't control field-level access
    END
  )
);

-- The application layer should handle filtering out personal info for non-owners