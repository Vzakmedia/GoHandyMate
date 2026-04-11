-- Fix security vulnerability in business_profiles table (corrected approach)
-- Remove overly permissive public read policy and implement proper access controls

-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Users can view all business profiles" ON public.business_profiles;

-- Create secure policies for business profiles access
CREATE POLICY "Users can view their own business profile" 
ON public.business_profiles 
FOR SELECT 
USING (user_id = auth.uid());

-- Admins can view all business profiles including sensitive information
CREATE POLICY "Admins can view all business profiles" 
ON public.business_profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
));

-- Create a secure function to get public business directory (excluding sensitive contact info)
CREATE OR REPLACE FUNCTION public.get_public_business_directory()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  business_name text,
  description text,
  services_offered text[],
  address text,
  website text,
  years_in_business integer,
  license_number text,
  insurance_verified boolean,
  rating numeric,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    bp.id,
    bp.user_id,
    bp.business_name,
    bp.description,
    bp.services_offered,
    bp.address,
    bp.website,
    bp.years_in_business,
    bp.license_number,
    bp.insurance_verified,
    bp.rating,
    bp.created_at,
    bp.updated_at
  FROM public.business_profiles bp;
$$;

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
      -- Or user is authenticated (for legitimate business inquiries)
      OR (auth.role() = 'authenticated' AND auth.uid() IS NOT NULL)
    );
$$;