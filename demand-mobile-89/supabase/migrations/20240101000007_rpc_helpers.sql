-- ============================================================
-- GoHandyMate – Missing RPC helpers
-- Migration: 20240101000007_rpc_helpers.sql
-- ============================================================

-- ─── mark_all_notifications_read ─────────────────────────────────────────────
create or replace function mark_all_notifications_read(p_user_id uuid)
returns void
language plpgsql security definer
as $$
begin
  update public.notifications
  set is_read = true
  where user_id = p_user_id and is_read = false;
end;
$$;

-- ─── get_handyman_available_balance (fallback if not already defined) ---------
-- Returns the sum of completed transactions not yet paid out.
create or replace function get_handyman_available_balance(p_handyman_id uuid)
returns numeric
language plpgsql security definer
as $$
declare
  v_balance numeric;
begin
  select coalesce(sum(handyman_amount), 0)
  into v_balance
  from public.transactions
  where handyman_id = p_handyman_id
    and status = 'completed'
    and payout_status = 'pending';
  return v_balance;
end;
$$;

-- ─── update conversations.last_message on new message INSERT ─────────────────
create or replace function update_conversation_last_message()
returns trigger
language plpgsql security definer
as $$
begin
  update public.conversations
  set
    last_message = new.content,
    last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

-- Drop + recreate trigger to avoid duplicates
drop trigger if exists trg_update_conversation_last_message on public.messages;
create trigger trg_update_conversation_last_message
  after insert on public.messages
  for each row execute function update_conversation_last_message();
