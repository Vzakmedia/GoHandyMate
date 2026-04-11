
-- Create community_messages table for live chat functionality
CREATE TABLE public.community_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  message TEXT NOT NULL,
  location TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  replies_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- Policy to allow everyone to view messages (public community chat)
CREATE POLICY "Anyone can view community messages" 
  ON public.community_messages 
  FOR SELECT 
  USING (true);

-- Policy to allow authenticated users to insert messages
CREATE POLICY "Authenticated users can create messages" 
  ON public.community_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own messages (for likes/replies count)
CREATE POLICY "Users can update their own messages" 
  ON public.community_messages 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own messages
CREATE POLICY "Users can delete their own messages" 
  ON public.community_messages 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_community_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_community_messages_updated_at
    BEFORE UPDATE ON public.community_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_community_messages_updated_at();

-- Enable real-time updates for community messages
ALTER TABLE public.community_messages REPLICA IDENTITY FULL;
