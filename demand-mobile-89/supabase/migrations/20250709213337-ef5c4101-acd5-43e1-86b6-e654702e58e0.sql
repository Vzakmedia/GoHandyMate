-- Add policy to allow public read access to job ratings for customer reviews page
CREATE POLICY "Public can view all ratings for reviews page" 
ON public.job_ratings 
FOR SELECT 
USING (true);