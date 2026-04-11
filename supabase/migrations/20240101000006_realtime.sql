-- ============================================================
-- GoHandyMate – Enable Supabase Realtime on messaging tables
-- Migration: 20240101000006_realtime.sql
-- ============================================================

-- Enable Realtime publication for live chat
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.conversations;

-- Set replication identity so UPDATE/DELETE events include full row data
alter table public.messages replica identity full;
alter table public.notifications replica identity full;
alter table public.bookings replica identity full;
alter table public.conversations replica identity full;
