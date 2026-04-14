
-- Create job_ratings table to store ratings
CREATE TABLE public.job_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid NOT NULL,
  customer_id uuid NOT NULL,
  provider_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(job_id, customer_id)
);

-- Enable RLS on job_ratings
ALTER TABLE public.job_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies for job_ratings
CREATE POLICY "Customers can view their own ratings" 
  ON public.job_ratings 
  FOR SELECT 
  USING (auth.uid() = customer_id);

CREATE POLICY "Providers can view ratings for their jobs" 
  ON public.job_ratings 
  FOR SELECT 
  USING (auth.uid() = provider_id);

CREATE POLICY "Customers can create ratings for their jobs" 
  ON public.job_ratings 
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own ratings" 
  ON public.job_ratings 
  FOR UPDATE 
  USING (auth.uid() = customer_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_job_ratings_updated_at
  BEFORE UPDATE ON public.job_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add rating aggregation columns to profiles table for providers
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS average_rating numeric(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_ratings integer DEFAULT 0;

-- Create function to update provider ratings
CREATE OR REPLACE FUNCTION public.update_provider_ratings()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the provider's average rating and total ratings
  UPDATE public.profiles 
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.job_ratings 
      WHERE provider_id = NEW.provider_id
    ),
    total_ratings = (
      SELECT COUNT(*) 
      FROM public.job_ratings 
      WHERE provider_id = NEW.provider_id
    )
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update provider ratings when a rating is added/updated
CREATE TRIGGER update_provider_ratings_trigger
  AFTER INSERT OR UPDATE ON public.job_ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_provider_ratings();

-- Enable realtime for job_ratings table
ALTER TABLE public.job_ratings REPLICA IDENTITY FULL;
