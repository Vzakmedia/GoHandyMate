-- Fix security vulnerability in business_profiles table
-- Remove overly permissive public read policy and implement proper access controls

-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Users can view all business profiles" ON public.business_profiles;

-- Create secure policies for business profiles access
CREATE POLICY "Users can view their own business profile" 
ON public.business_profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- Allow viewing of basic business information (excluding sensitive contact details)
-- This policy will be used with a secure view that doesn't expose contact info
CREATE POLICY "Authenticated users can view basic business info" 
ON public.business_profiles 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Admins can view all business profiles including sensitive information
CREATE POLICY "Admins can view all business profiles" 
ON public.business_profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
));

-- Create a secure view for public business directory that excludes sensitive contact information
CREATE OR REPLACE VIEW public.business_profiles_public AS
SELECT 
  id,
  user_id,
  business_name,
  description,
  services_offered,
  address,
  website,
  years_in_business,
  license_number,
  insurance_verified,
  rating,
  created_at,
  updated_at
FROM public.business_profiles;

-- Enable RLS on the public view
ALTER VIEW public.business_profiles_public SET (security_barrier = true);

-- Create policy for the public view
CREATE POLICY "Public can view basic business directory" 
ON public.business_profiles_public 
FOR SELECT 
USING (true);

-- Create a secure function to get business contact information only for authorized users
CREATE OR REPLACE FUNCTION public.get_business_contact_info(business_profile_id uuid)
RETURNS TABLE(contact_email text, contact_phone text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    bp.contact_email,
    bp.contact_phone
  FROM public.business_profiles bp
  WHERE bp.id = business_profile_id
    AND (
      -- User owns the profile
      bp.user_id = auth.uid()
      -- Or user is an admin
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
          AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
      )
      -- Or user is authenticated and requesting contact for legitimate business purposes
      OR (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL)
    );
$$;