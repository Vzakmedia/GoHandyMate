-- Allow public read access to job_requests for metrics
CREATE POLICY "Public can view job requests for metrics" ON public.job_requests
FOR SELECT USING (true);

-- Allow public read access to profiles for metrics  
CREATE POLICY "Public can view profiles for metrics" ON public.profiles
FOR SELECT USING (true);