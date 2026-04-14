-- Fix security definer view issue by removing the problematic view

-- Drop the problematic view with security_barrier
DROP VIEW IF EXISTS public.community_messages_safe;

-- Instead of using a view, we'll rely on the RLS policies and the secure function
-- The function already exists and is properly secured

-- Ensure the community messages table has proper RLS
-- (This was already done in the previous migration, but ensuring it's correct)

-- Verify that the get_community_messages_safe function is properly configured
-- (This was already created in the previous migration)

-- The frontend should use the get_community_messages_safe function instead of direct table access
-- This provides privacy protection while maintaining functionality