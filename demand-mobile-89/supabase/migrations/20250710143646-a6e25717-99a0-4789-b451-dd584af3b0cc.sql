-- Create community_message_likes table for tracking likes
CREATE TABLE public.community_message_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message_id UUID NOT NULL REFERENCES community_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, message_id)
);

-- Create post_interactions table for tracking shares and other interactions
CREATE TABLE public.post_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  message_id UUID NOT NULL REFERENCES community_messages(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL,
  interaction_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.community_message_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for community_message_likes
CREATE POLICY "Users can view all likes" 
ON public.community_message_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own likes" 
ON public.community_message_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.community_message_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS policies for post_interactions
CREATE POLICY "Users can view all interactions" 
ON public.post_interactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own interactions" 
ON public.post_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create functions to increment/decrement likes and replies
CREATE OR REPLACE FUNCTION public.increment_message_likes(message_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_messages 
  SET likes_count = likes_count + 1 
  WHERE id = message_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrement_message_likes(message_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_messages 
  SET likes_count = GREATEST(likes_count - 1, 0) 
  WHERE id = message_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_message_replies(message_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.community_messages 
  SET replies_count = replies_count + 1 
  WHERE id = message_id;
END;
$$;