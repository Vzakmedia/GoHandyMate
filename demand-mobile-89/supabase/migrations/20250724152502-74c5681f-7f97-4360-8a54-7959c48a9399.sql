-- Enable real-time updates for profiles table
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add the profiles table to the realtime publication
-- This allows real-time subscriptions to work
BEGIN;
  -- Remove if exists and re-add to ensure it's properly configured
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
  ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
COMMIT;