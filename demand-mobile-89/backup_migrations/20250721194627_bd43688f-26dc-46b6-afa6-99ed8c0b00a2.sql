-- Remove support ticket tables and related functions

-- Drop tables (this will automatically remove triggers)
DROP TABLE IF EXISTS public.support_ticket_messages CASCADE;
DROP TABLE IF EXISTS public.support_tickets CASCADE;

-- Drop support ticket related functions
DROP FUNCTION IF EXISTS public.update_support_ticket_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_ticket_on_new_message() CASCADE;