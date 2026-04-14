-- ============================================================
-- GoHandyMate – Row-Level Security Policies
-- Migration: 20240101000001_rls_policies.sql
-- ============================================================

-- ─── Enable RLS on all tables ────────────────────────────────
alter table public.profiles                enable row level security;
alter table public.service_categories      enable row level security;
alter table public.handymen                enable row level security;
alter table public.handyman_services       enable row level security;
alter table public.handyman_applications   enable row level security;
alter table public.addresses               enable row level security;
alter table public.payment_methods         enable row level security;
alter table public.bookings                enable row level security;
alter table public.conversations           enable row level security;
alter table public.messages                enable row level security;
alter table public.reviews                 enable row level security;
alter table public.invoices                enable row level security;
alter table public.transactions            enable row level security;
alter table public.payouts                 enable row level security;
alter table public.notifications           enable row level security;
alter table public.promotions              enable row level security;
alter table public.promotion_uses          enable row level security;

-- ─── profiles ────────────────────────────────────────────────
-- Users can read any profile (needed to show handyman info publicly)
create policy "profiles: public read"
  on public.profiles for select
  using (true);

-- Users can only update their own profile
create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Profile insert is handled by the trigger only
create policy "profiles: insert via trigger"
  on public.profiles for insert
  with check (auth.uid() = id);

-- ─── service_categories ──────────────────────────────────────
create policy "service_categories: public read"
  on public.service_categories for select
  using (true);

-- ─── handymen ────────────────────────────────────────────────
create policy "handymen: public read"
  on public.handymen for select
  using (true);

create policy "handymen: owner update"
  on public.handymen for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "handymen: owner insert"
  on public.handymen for insert
  with check (auth.uid() = user_id);

-- ─── handyman_services ───────────────────────────────────────
create policy "handyman_services: public read"
  on public.handyman_services for select
  using (true);

create policy "handyman_services: owner insert"
  on public.handyman_services for insert
  with check (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  );

create policy "handyman_services: owner update"
  on public.handyman_services for update
  using (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  );

create policy "handyman_services: owner delete"
  on public.handyman_services for delete
  using (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  );

-- ─── handyman_applications ───────────────────────────────────
create policy "handyman_applications: owner read"
  on public.handyman_applications for select
  using (auth.uid() = user_id);

create policy "handyman_applications: owner insert"
  on public.handyman_applications for insert
  with check (auth.uid() = user_id);

create policy "handyman_applications: owner update"
  on public.handyman_applications for update
  using (auth.uid() = user_id and status = 'pending');

-- ─── addresses ───────────────────────────────────────────────
create policy "addresses: owner all"
  on public.addresses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── payment_methods ─────────────────────────────────────────
create policy "payment_methods: owner all"
  on public.payment_methods for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── bookings ────────────────────────────────────────────────
-- Customer can see their own bookings
create policy "bookings: customer read"
  on public.bookings for select
  using (auth.uid() = customer_id);

-- Handyman can see bookings assigned to them
create policy "bookings: handyman read"
  on public.bookings for select
  using (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  );

-- Only customers can create bookings
create policy "bookings: customer insert"
  on public.bookings for insert
  with check (auth.uid() = customer_id);

-- Customer can update their own pending bookings (e.g., cancel)
-- Handyman can update status of their assigned bookings
create policy "bookings: customer update"
  on public.bookings for update
  using (auth.uid() = customer_id and status in ('pending', 'confirmed'));

create policy "bookings: handyman update"
  on public.bookings for update
  using (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  );

-- ─── conversations ───────────────────────────────────────────
create policy "conversations: parties read"
  on public.conversations for select
  using (auth.uid() = customer_id or auth.uid() = handyman_user_id);

create policy "conversations: parties insert"
  on public.conversations for insert
  with check (auth.uid() = customer_id or auth.uid() = handyman_user_id);

create policy "conversations: parties update"
  on public.conversations for update
  using (auth.uid() = customer_id or auth.uid() = handyman_user_id);

-- ─── messages ────────────────────────────────────────────────
create policy "messages: parties read"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.customer_id = auth.uid() or c.handyman_user_id = auth.uid())
    )
  );

create policy "messages: sender insert"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.customer_id = auth.uid() or c.handyman_user_id = auth.uid())
    )
  );

create policy "messages: sender update (mark read)"
  on public.messages for update
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.customer_id = auth.uid() or c.handyman_user_id = auth.uid())
    )
  );

-- ─── reviews ─────────────────────────────────────────────────
-- Anyone can read reviews
create policy "reviews: public read"
  on public.reviews for select
  using (true);

-- Only the customer who had a completed booking can leave a review
create policy "reviews: customer insert"
  on public.reviews for insert
  with check (
    auth.uid() = customer_id
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.customer_id = auth.uid()
        and b.status = 'completed'
    )
  );

-- ─── invoices ────────────────────────────────────────────────
create policy "invoices: handyman all"
  on public.invoices for all
  using (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  );

create policy "invoices: customer read"
  on public.invoices for select
  using (auth.uid() = customer_id);

-- ─── transactions ────────────────────────────────────────────
create policy "transactions: handyman read"
  on public.transactions for select
  using (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  );

-- Only system (service role) can insert transactions
create policy "transactions: service role insert"
  on public.transactions for insert
  with check (auth.role() = 'service_role');

-- ─── payouts ─────────────────────────────────────────────────
create policy "payouts: handyman read"
  on public.payouts for select
  using (
    exists (
      select 1 from public.handymen h
      where h.id = handyman_id and h.user_id = auth.uid()
    )
  );

create policy "payouts: service role manage"
  on public.payouts for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- ─── notifications ───────────────────────────────────────────
create policy "notifications: owner read"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications: owner update (mark read)"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- System inserts notifications
create policy "notifications: service role insert"
  on public.notifications for insert
  with check (auth.role() = 'service_role');

-- ─── promotions ──────────────────────────────────────────────
create policy "promotions: public read"
  on public.promotions for select
  using (is_active = true);

-- ─── promotion_uses ──────────────────────────────────────────
create policy "promotion_uses: owner read"
  on public.promotion_uses for select
  using (auth.uid() = user_id);

create policy "promotion_uses: owner insert"
  on public.promotion_uses for insert
  with check (auth.uid() = user_id);
