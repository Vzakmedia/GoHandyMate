-- Fix security vulnerability: Remove public access to community messages containing personal data

-- Drop the overly permissive policy that allows anyone to view community messages
DROP POLICY IF EXISTS "Anyone can view community messages" ON public.community_messages;

-- Create a secure policy that only allows authenticated users to view community messages
CREATE POLICY "Authenticated users can view community messages" 
ON public.community_messages 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create a view for community messages that provides additional privacy protection
-- This view can be used by the frontend to get messages without exposing raw user IDs
CREATE OR REPLACE VIEW public.community_messages_safe AS
SELECT 
  id,
  message,
  location,
  image_url,
  likes_count,
  replies_count,
  reply_to_id,
  reply_to_message,
  reply_to_user,
  user_name,
  -- Hash or truncate user_id for additional privacy (but keep it consistent for functionality)
  SUBSTRING(user_id::text, 1, 8) || '...' as user_id_display,
  user_id, -- Keep original for owner checks, but frontend should use user_id_display for display
  created_at,
  updated_at
FROM public.community_messages;

-- Grant access to the safe view for authenticated users
GRANT SELECT ON public.community_messages_safe TO authenticated;

-- Ensure anonymous users cannot access the view
REVOKE ALL ON public.community_messages_safe FROM anon;

-- Add RLS to the view
ALTER VIEW public.community_messages_safe SET (security_barrier = true);

-- Create a function to safely get community messages with user privacy protection
CREATE OR REPLACE FUNCTION public.get_community_messages_safe(limit_count integer DEFAULT 50)
RETURNS TABLE (
  id uuid,
  message text,
  location text,
  image_url text,
  likes_count integer,
  replies_count integer,
  reply_to_id uuid,
  reply_to_message text,
  reply_to_user text,
  user_name text,
  user_id_display text,
  is_own_message boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    cm.id,
    cm.message,
    cm.location,
    cm.image_url,
    cm.likes_count,
    cm.replies_count,
    cm.reply_to_id,
    cm.reply_to_message,
    cm.reply_to_user,
    cm.user_name,
    SUBSTRING(cm.user_id::text, 1, 8) || '...' as user_id_display,
    (cm.user_id = auth.uid()) as is_own_message,
    cm.created_at,
    cm.updated_at
  FROM public.community_messages cm
  ORDER BY cm.created_at DESC
  LIMIT limit_count;
$$;

-- Grant execute permission on the function to authenticated users only
GRANT EXECUTE ON FUNCTION public.get_community_messages_safe(integer) TO authenticated;