-- Fix security vulnerability in job_requests table
-- Remove overly permissive policies and implement proper access controls

-- Drop the dangerous public read policy
DROP POLICY IF EXISTS "Public can view job requests for metrics" ON public.job_requests;

-- Drop the overly permissive update policy  
DROP POLICY IF EXISTS "System can update job requests" ON public.job_requests;

-- Create secure policies for job requests access
CREATE POLICY "Customers can view their own job requests" 
ON public.job_requests 
FOR SELECT 
USING (customer_id = auth.uid());

CREATE POLICY "Assigned users can view their assigned jobs" 
ON public.job_requests 
FOR SELECT 
USING (assigned_to_user_id = auth.uid());

CREATE POLICY "Property managers can view jobs for their properties"
ON public.job_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.units u 
  WHERE u.id = job_requests.unit_id 
    AND u.manager_id = auth.uid()
));

CREATE POLICY "Admins can view all job requests" 
ON public.job_requests 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
));

-- Update policies for job modifications
CREATE POLICY "Customers can update their own job requests" 
ON public.job_requests 
FOR UPDATE 
USING (customer_id = auth.uid());

CREATE POLICY "Assigned users can update job status and details" 
ON public.job_requests 
FOR UPDATE 
USING (assigned_to_user_id = auth.uid());

CREATE POLICY "Property managers can update jobs for their properties"
ON public.job_requests 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.units u 
  WHERE u.id = job_requests.unit_id 
    AND u.manager_id = auth.uid()
));

CREATE POLICY "Admins can update all job requests" 
ON public.job_requests 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() 
    AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
));