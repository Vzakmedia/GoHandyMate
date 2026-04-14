-- ============================================================
-- GoHandyMate – Database Triggers & Functions
-- Migration: 20240101000002_triggers.sql
-- ============================================================

-- ─── 1. Auto-create profile on user signup ───────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_role user_role_type;
begin
  -- Read the user_role from auth metadata (set during signUp)
  v_role := coalesce(
    (new.raw_user_meta_data->>'user_role')::user_role_type,
    'customer'
  );

  insert into public.profiles (
    id,
    email,
    full_name,
    user_role,
    created_at,
    updated_at
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    v_role,
    now(),
    now()
  )
  on conflict (id) do nothing;

  -- If the user signed up as a handyman, also create a handyman row
  if v_role = 'handyman' then
    insert into public.handymen (user_id) values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

-- Drop and recreate trigger to be idempotent
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── 2. Auto-update updated_at timestamps ────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply to profiles
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Apply to bookings
drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
  before update on public.bookings
  for each row execute procedure public.set_updated_at();

-- Apply to handymen
drop trigger if exists set_handymen_updated_at on public.handymen;
create trigger set_handymen_updated_at
  before update on public.handymen
  for each row execute procedure public.set_updated_at();

-- Apply to invoices
drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at
  before update on public.invoices
  for each row execute procedure public.set_updated_at();

-- ─── 3. Recalculate handyman rating after review ─────────────
create or replace function public.update_handyman_rating()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_avg_rating  float8;
  v_total       int;
begin
  select
    round(avg(rating)::numeric, 1)::float8,
    count(*)
  into v_avg_rating, v_total
  from public.reviews
  where handyman_id = new.handyman_id;

  update public.handymen
  set
    rating        = coalesce(v_avg_rating, 0),
    total_reviews = v_total
  where id = new.handyman_id;

  return new;
end;
$$;

drop trigger if exists on_review_inserted on public.reviews;
create trigger on_review_inserted
  after insert on public.reviews
  for each row execute procedure public.update_handyman_rating();

-- ─── 4. Increment handyman total_jobs on booking completion ──
create or replace function public.increment_handyman_jobs()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Only fires when status transitions TO 'completed'
  if new.status = 'completed' and old.status != 'completed' then
    update public.handymen
    set total_jobs = total_jobs + 1
    where id = new.handyman_id;

    -- Also create an earning transaction
    insert into public.transactions (
      handyman_id,
      booking_id,
      amount,
      type,
      status,
      description
    ) values (
      new.handyman_id,
      new.id,
      new.handyman_payout,
      'earning',
      'pending',
      'Earnings from booking #' || new.id
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_booking_completed on public.bookings;
create trigger on_booking_completed
  after update on public.bookings
  for each row execute procedure public.increment_handyman_jobs();

-- ─── 5. Create notifications on booking status changes ───────
create or replace function public.create_booking_notification()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_handyman_user_id  uuid;
  v_customer_name     text;
  v_handyman_name     text;
begin
  -- Get handyman's user_id for notification targeting
  if new.handyman_id is not null then
    select user_id into v_handyman_user_id
    from public.handymen where id = new.handyman_id;
  end if;

  -- Get names for notification messages
  select coalesce(full_name, email) into v_customer_name
  from public.profiles where id = new.customer_id;

  if v_handyman_user_id is not null then
    select coalesce(full_name, email) into v_handyman_name
    from public.profiles where id = v_handyman_user_id;
  end if;

  -- Only notify on status transitions
  if old.status = new.status then
    return new;
  end if;

  -- Notify customer about their booking status changes
  case new.status
    when 'confirmed' then
      insert into public.notifications (user_id, title, body, type, reference_id, reference_table)
      values (
        new.customer_id,
        'Booking Confirmed! 🎉',
        'Your booking for ' || new.service_category || ' has been confirmed.',
        'booking',
        new.id,
        'bookings'
      );

    when 'on_the_way' then
      insert into public.notifications (user_id, title, body, type, reference_id, reference_table)
      values (
        new.customer_id,
        'Pro is on the way! 🚗',
        coalesce(v_handyman_name, 'Your handyman') || ' is heading to your location.',
        'booking',
        new.id,
        'bookings'
      );

    when 'in_progress' then
      insert into public.notifications (user_id, title, body, type, reference_id, reference_table)
      values (
        new.customer_id,
        'Work in Progress 🔧',
        'Your ' || new.service_category || ' service has started.',
        'booking',
        new.id,
        'bookings'
      );

    when 'completed' then
      -- Notify customer
      insert into public.notifications (user_id, title, body, type, reference_id, reference_table)
      values (
        new.customer_id,
        'Job Complete! ⭐',
        'Your ' || new.service_category || ' service is done. Leave a review!',
        'booking',
        new.id,
        'bookings'
      );

    when 'cancelled' then
      -- Notify customer
      insert into public.notifications (user_id, title, body, type, reference_id, reference_table)
      values (
        new.customer_id,
        'Booking Cancelled',
        'Your booking for ' || new.service_category || ' has been cancelled.',
        'booking',
        new.id,
        'bookings'
      );
      -- Also notify handyman if they were assigned
      if v_handyman_user_id is not null then
        insert into public.notifications (user_id, title, body, type, reference_id, reference_table)
        values (
          v_handyman_user_id,
          'Booking Cancelled',
          v_customer_name || ' cancelled a ' || new.service_category || ' booking.',
          'booking',
          new.id,
          'bookings'
        );
      end if;

    else -- pending or other
      null;
  end case;

  -- Notify handyman when a new booking is assigned to them
  if new.status = 'pending' and v_handyman_user_id is not null and old.handyman_id is null then
    insert into public.notifications (user_id, title, body, type, reference_id, reference_table)
    values (
      v_handyman_user_id,
      'New Job Request! 📋',
      v_customer_name || ' requested a ' || new.service_category || ' service.',
      'booking',
      new.id,
      'bookings'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_booking_status_changed on public.bookings;
create trigger on_booking_status_changed
  after update on public.bookings
  for each row execute procedure public.create_booking_notification();

-- ─── 6. Update conversation last_message on new message ──────
create or replace function public.update_conversation_last_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.conversations
  set
    last_message    = new.content,
    last_message_at = new.created_at
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists on_message_sent on public.messages;
create trigger on_message_sent
  after insert on public.messages
  for each row execute procedure public.update_conversation_last_message();

-- ─── 7. Notify recipient on new message ──────────────────────
create or replace function public.notify_new_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_conv          record;
  v_sender_name   text;
  v_recipient_id  uuid;
begin
  select * into v_conv from public.conversations where id = new.conversation_id;

  select coalesce(full_name, email) into v_sender_name
  from public.profiles where id = new.sender_id;

  -- Recipient is the other party
  if new.sender_id = v_conv.customer_id then
    v_recipient_id := v_conv.handyman_user_id;
  else
    v_recipient_id := v_conv.customer_id;
  end if;

  insert into public.notifications (user_id, title, body, type, reference_id, reference_table)
  values (
    v_recipient_id,
    'New Message 💬',
    v_sender_name || ': ' || left(new.content, 80),
    'message',
    new.conversation_id,
    'conversations'
  );

  return new;
end;
$$;

drop trigger if exists on_new_message_notify on public.messages;
create trigger on_new_message_notify
  after insert on public.messages
  for each row execute procedure public.notify_new_message();

-- ─── 8. Ensure only one default address per user ─────────────
create or replace function public.enforce_single_default_address()
returns trigger
language plpgsql
as $$
begin
  if new.is_default = true then
    update public.addresses
    set is_default = false
    where user_id = new.user_id and id != new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_address_default on public.addresses;
create trigger on_address_default
  after insert or update on public.addresses
  for each row execute procedure public.enforce_single_default_address();

-- ─── 9. Ensure only one default payment method per user ──────
create or replace function public.enforce_single_default_payment()
returns trigger
language plpgsql
as $$
begin
  if new.is_default = true then
    update public.payment_methods
    set is_default = false
    where user_id = new.user_id and id != new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_payment_default on public.payment_methods;
create trigger on_payment_default
  after insert or update on public.payment_methods
  for each row execute procedure public.enforce_single_default_payment();

-- ─── Helper: Generate invoice number ─────────────────────────
create or replace function public.generate_invoice_number()
returns text
language plpgsql
as $$
declare
  v_count int;
begin
  select count(*) into v_count from public.invoices;
  return 'INV-' || lpad((v_count + 1)::text, 4, '0');
end;
$$;
