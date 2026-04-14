-- Fix security vulnerability in job_ratings table
-- Remove dangerous public read policy and implement proper access controls

-- Drop the dangerous public read policy that exposes all customer reviews and IDs
DROP POLICY IF EXISTS "Public can view all ratings for reviews page" ON public.job_ratings;

-- Add admin policy for full access to ratings data
CREATE POLICY "Admins can view all job ratings" 
ON public.job_ratings 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
));

CREATE POLICY "Admins can manage all job ratings" 
ON public.job_ratings 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
));

-- Create a secure function for public display of ratings that protects customer/provider identity
CREATE OR REPLACE FUNCTION public.get_public_ratings_summary(limit_count integer DEFAULT 10)
RETURNS TABLE(
  id uuid,
  rating integer,
  review_text text,
  job_type text,
  created_at timestamp with time zone,
  customer_initial text,
  provider_name text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    jr.id,
    jr.rating,
    jr.review_text,
    COALESCE(jreq.job_type, 'Service') as job_type,
    jr.created_at,
    -- Only show first initial of customer name for privacy
    CASE 
      WHEN cp.full_name IS NOT NULL AND LENGTH(cp.full_name) > 0 
      THEN LEFT(cp.full_name, 1) || '.'
      ELSE 'Anonymous'
    END as customer_initial,
    -- Show provider name (they're public service providers)
    COALESCE(pp.full_name, 'Service Provider') as provider_name
  FROM public.job_ratings jr
  LEFT JOIN public.job_requests jreq ON jr.job_request_id = jreq.id
  LEFT JOIN public.profiles cp ON jr.customer_id = cp.id
  LEFT JOIN public.profiles pp ON jr.provider_id = pp.id
  WHERE jr.rating >= 4  -- Only show positive reviews for public display
  ORDER BY jr.created_at DESC
  LIMIT limit_count;
$$;

-- Create a secure function to get provider rating aggregates without exposing individual reviews
CREATE OR REPLACE FUNCTION public.get_provider_rating_summary(provider_user_id uuid)
RETURNS TABLE(
  provider_id uuid,
  average_rating numeric,
  total_ratings bigint,
  rating_distribution jsonb
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    jr.provider_id,
    ROUND(AVG(jr.rating::numeric), 2) as average_rating,
    COUNT(*) as total_ratings,
    jsonb_build_object(
      '5_star', COUNT(*) FILTER (WHERE jr.rating = 5),
      '4_star', COUNT(*) FILTER (WHERE jr.rating = 4),
      '3_star', COUNT(*) FILTER (WHERE jr.rating = 3),
      '2_star', COUNT(*) FILTER (WHERE jr.rating = 2),
      '1_star', COUNT(*) FILTER (WHERE jr.rating = 1)
    ) as rating_distribution
  FROM public.job_ratings jr
  WHERE jr.provider_id = provider_user_id
  GROUP BY jr.provider_id;
$$;

-- Create a secure function for providers to view their detailed ratings (without customer personal info)
CREATE OR REPLACE FUNCTION public.get_provider_ratings_detailed(provider_user_id uuid)
RETURNS TABLE(
  id uuid,
  rating integer,
  review_text text,
  job_type text,
  created_at timestamp with time zone,
  customer_initial text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    jr.id,
    jr.rating,
    jr.review_text,
    COALESCE(jreq.job_type, 'Service') as job_type,
    jr.created_at,
    -- Only show first initial for privacy
    CASE 
      WHEN cp.full_name IS NOT NULL AND LENGTH(cp.full_name) > 0 
      THEN LEFT(cp.full_name, 1) || '.'
      ELSE 'Anonymous'
    END as customer_initial
  FROM public.job_ratings jr
  LEFT JOIN public.job_requests jreq ON jr.job_request_id = jreq.id
  LEFT JOIN public.profiles cp ON jr.customer_id = cp.id
  WHERE jr.provider_id = provider_user_id
    AND (
      -- Provider can view their own ratings
      auth.uid() = provider_user_id
      -- Or admins can view
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
          AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
      )
    )
  ORDER BY jr.created_at DESC;
$$;