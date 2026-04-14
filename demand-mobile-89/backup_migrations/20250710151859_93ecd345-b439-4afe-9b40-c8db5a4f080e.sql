-- Create table for advertisement interactions (likes, shares, comments)
CREATE TABLE public.advertisement_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advertisement_id BIGINT NOT NULL,
  user_id UUID,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'share', 'comment', 'booking')),
  interaction_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_advertisement_interactions_ad_id ON public.advertisement_interactions(advertisement_id);
CREATE INDEX idx_advertisement_interactions_user_id ON public.advertisement_interactions(user_id);
CREATE INDEX idx_advertisement_interactions_type ON public.advertisement_interactions(interaction_type);

-- Add metrics columns to advertisements table
ALTER TABLE public.advertisements 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS shares_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bookings_count INTEGER DEFAULT 0;

-- Enable RLS
ALTER TABLE public.advertisement_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all ad interactions" 
ON public.advertisement_interactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own ad interactions" 
ON public.advertisement_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ad interactions" 
ON public.advertisement_interactions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ad interactions" 
ON public.advertisement_interactions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create functions to update advertisement metrics
CREATE OR REPLACE FUNCTION public.increment_ad_likes(ad_id BIGINT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.advertisements 
  SET likes_count = likes_count + 1 
  WHERE id = ad_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_ad_likes(ad_id BIGINT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.advertisements 
  SET likes_count = GREATEST(likes_count - 1, 0) 
  WHERE id = ad_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_ad_shares(ad_id BIGINT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.advertisements 
  SET shares_count = shares_count + 1 
  WHERE id = ad_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_ad_comments(ad_id BIGINT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.advertisements 
  SET comments_count = comments_count + 1 
  WHERE id = ad_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_ad_bookings(ad_id BIGINT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.advertisements 
  SET bookings_count = bookings_count + 1 
  WHERE id = ad_id;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_advertisement_interactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_advertisement_interactions_updated_at
BEFORE UPDATE ON public.advertisement_interactions
FOR EACH ROW
EXECUTE FUNCTION public.update_advertisement_interactions_updated_at();