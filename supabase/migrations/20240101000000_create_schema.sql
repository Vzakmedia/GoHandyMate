-- ============================================================
-- GoHandyMate – Full Database Schema
-- Migration: 20240101000000_create_schema.sql
-- ============================================================

-- ─── Drop existing tables (clean slate) ──────────────────────
-- Drop in reverse dependency order to avoid FK constraint errors
drop table if exists public.promotion_uses    cascade;
drop table if exists public.promotions        cascade;
drop table if exists public.notifications     cascade;
drop table if exists public.payouts           cascade;
drop table if exists public.transactions      cascade;
drop table if exists public.invoices          cascade;
drop table if exists public.reviews           cascade;
drop table if exists public.messages          cascade;
drop table if exists public.conversations     cascade;
drop table if exists public.bookings          cascade;
drop table if exists public.payment_methods   cascade;
drop table if exists public.addresses         cascade;
drop table if exists public.handyman_applications cascade;
drop table if exists public.handyman_services cascade;
drop table if exists public.handymen          cascade;
drop table if exists public.service_categories cascade;
drop table if exists public.profiles          cascade;

-- Drop old ENUM types if they exist (recreation handled below)
drop type if exists user_role_type            cascade;
drop type if exists booking_status_type       cascade;
drop type if exists subscription_status_type  cascade;
drop type if exists application_status_type   cascade;
drop type if exists invoice_status_type       cascade;
drop type if exists transaction_type          cascade;
drop type if exists transaction_status_type   cascade;
drop type if exists payout_status_type        cascade;
drop type if exists notification_type         cascade;
drop type if exists discount_type             cascade;
drop type if exists price_type                cascade;

-- ─── Extensions ──────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";  -- for fuzzy text search

-- ─── ENUM Types ──────────────────────────────────────────────
create type user_role_type as enum ('customer', 'handyman');

create type booking_status_type as enum (
  'pending', 'confirmed', 'on_the_way', 'in_progress', 'completed', 'cancelled'
);

create type subscription_status_type as enum ('none', 'basic', 'pro');

create type application_status_type as enum ('pending', 'approved', 'rejected');

create type invoice_status_type as enum ('draft', 'sent', 'paid', 'overdue');

create type transaction_type as enum ('earning', 'tip', 'refund');

create type transaction_status_type as enum ('pending', 'cleared', 'failed');

create type payout_status_type as enum ('pending', 'processing', 'completed', 'failed');

create type notification_type as enum ('booking', 'message', 'payment', 'system');

create type discount_type as enum ('percent', 'fixed');

create type price_type as enum ('hourly', 'fixed');

-- ─── TABLE: profiles ─────────────────────────────────────────
create table if not exists public.profiles (
  id                uuid        not null references auth.users(id) on delete cascade,
  email             text        not null,
  full_name         text,
  phone             text,
  avatar_url        text,
  user_role         user_role_type not null default 'customer',
  location_city     text,
  location_lat      float8,
  location_lng      float8,
  is_verified       boolean     not null default false,
  stripe_customer_id text,                              -- Stripe customer ID
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  constraint profiles_pkey primary key (id)
);

comment on table public.profiles is 'Extended user profiles — mirrors auth.users with role info.';

-- ─── TABLE: service_categories ───────────────────────────────
create table if not exists public.service_categories (
  id          uuid    not null default uuid_generate_v4(),
  name        text    not null unique,
  icon        text    not null,           -- Ionicons icon name
  is_popular  boolean not null default false,
  sort_order  int     not null default 0,

  constraint service_categories_pkey primary key (id)
);

comment on table public.service_categories is 'Lookup table of home service categories.';

-- ─── TABLE: handymen ─────────────────────────────────────────
create table if not exists public.handymen (
  id                      uuid    not null default uuid_generate_v4(),
  user_id                 uuid    not null references public.profiles(id) on delete cascade,
  bio                     text,
  years_experience        int     not null default 0,
  hourly_rate             numeric(10,2),
  rating                  float8  not null default 0.0,
  total_reviews           int     not null default 0,
  total_jobs              int     not null default 0,
  response_time_minutes   int     not null default 60,
  is_active               boolean not null default true,
  is_verified             boolean not null default false,
  subscription_status     subscription_status_type not null default 'none',
  service_radius_miles    int     not null default 25,
  stripe_account_id       text,                     -- Stripe Connect account
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  constraint handymen_pkey primary key (id),
  constraint handymen_user_id_unique unique (user_id)
);

comment on table public.handymen is 'Extended profile for handyman/pro users.';

-- ─── TABLE: handyman_services ────────────────────────────────
create table if not exists public.handyman_services (
  id              uuid    not null default uuid_generate_v4(),
  handyman_id     uuid    not null references public.handymen(id) on delete cascade,
  category_id     uuid    references public.service_categories(id),
  service_name    text    not null,
  description     text,
  base_price      numeric(10,2),
  price_type      price_type not null default 'hourly',
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),

  constraint handyman_services_pkey primary key (id)
);

comment on table public.handyman_services is 'Services offered by a particular handyman.';

-- ─── TABLE: handyman_applications ────────────────────────────
create table if not exists public.handyman_applications (
  id                          uuid    not null default uuid_generate_v4(),
  user_id                     uuid    not null references public.profiles(id) on delete cascade,
  full_name                   text    not null,
  phone                       text,
  trade_categories            text[]  not null default '{}',
  years_experience            int     not null default 0,
  bio                         text,
  hourly_rate                 numeric(10,2),
  id_document_url             text,
  insurance_url               text,
  background_check_consent    boolean not null default false,
  service_radius_miles        int     not null default 25,
  status                      application_status_type not null default 'pending',
  reviewed_at                 timestamptz,
  reviewer_notes              text,
  created_at                  timestamptz not null default now(),

  constraint handyman_applications_pkey primary key (id)
);

comment on table public.handyman_applications is 'Pro onboarding applications submitted by users.';

-- ─── TABLE: addresses ────────────────────────────────────────
create table if not exists public.addresses (
  id              uuid    not null default uuid_generate_v4(),
  user_id         uuid    not null references public.profiles(id) on delete cascade,
  label           text    not null default 'Home',   -- Home | Work | Other
  address_line1   text    not null,
  address_line2   text,
  city            text    not null,
  state           text    not null,
  zip             text    not null,
  country         text    not null default 'US',
  lat             float8,
  lng             float8,
  is_default      boolean not null default false,
  created_at      timestamptz not null default now(),

  constraint addresses_pkey primary key (id)
);

comment on table public.addresses is 'Saved addresses for customers.';

-- ─── TABLE: payment_methods ──────────────────────────────────
create table if not exists public.payment_methods (
  id                          uuid    not null default uuid_generate_v4(),
  user_id                     uuid    not null references public.profiles(id) on delete cascade,
  type                        text    not null default 'card',  -- card | bank
  brand                       text,                             -- visa | mastercard | amex
  last4                       text    not null,
  exp_month                   int,
  exp_year                    int,
  is_default                  boolean not null default false,
  stripe_payment_method_id    text    not null,
  created_at                  timestamptz not null default now(),

  constraint payment_methods_pkey primary key (id),
  constraint payment_methods_stripe_pm_unique unique (stripe_payment_method_id)
);

comment on table public.payment_methods is 'Customer payment methods (Stripe-backed).';

-- ─── TABLE: bookings ─────────────────────────────────────────
create table if not exists public.bookings (
  id                  uuid    not null default uuid_generate_v4(),
  customer_id         uuid    not null references public.profiles(id),
  handyman_id         uuid    references public.handymen(id),
  service_category    text    not null,
  description         text,
  scheduled_at        timestamptz not null,
  address_id          uuid    references public.addresses(id),
  address_snapshot    jsonb,                    -- snapshot at booking time
  status              booking_status_type not null default 'pending',
  total_amount        numeric(10,2) not null default 0,
  platform_fee        numeric(10,2) not null default 0,
  handyman_payout     numeric(10,2) not null default 0,
  notes               text,
  stripe_payment_intent_id    text,
  payment_status              text    default 'unpaid',  -- unpaid | paid | refunded
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  constraint bookings_pkey primary key (id)
);

comment on table public.bookings is 'Core booking table linking customer and handyman for a service.';

-- ─── TABLE: conversations ────────────────────────────────────
create table if not exists public.conversations (
  id                  uuid    not null default uuid_generate_v4(),
  booking_id          uuid    references public.bookings(id) on delete set null,
  customer_id         uuid    not null references public.profiles(id),
  handyman_user_id    uuid    not null references public.profiles(id),
  last_message        text,
  last_message_at     timestamptz,
  created_at          timestamptz not null default now(),

  constraint conversations_pkey primary key (id),
  constraint conversations_parties_unique unique (customer_id, handyman_user_id)
);

comment on table public.conversations is 'Chat threads between a customer and a handyman.';

-- ─── TABLE: messages ─────────────────────────────────────────
create table if not exists public.messages (
  id                  uuid    not null default uuid_generate_v4(),
  conversation_id     uuid    not null references public.conversations(id) on delete cascade,
  sender_id           uuid    not null references public.profiles(id),
  content             text    not null,
  attachment_url      text,
  is_read             boolean not null default false,
  created_at          timestamptz not null default now(),

  constraint messages_pkey primary key (id)
);

comment on table public.messages is 'Individual messages in a conversation thread.';

-- ─── TABLE: reviews ──────────────────────────────────────────
create table if not exists public.reviews (
  id              uuid    not null default uuid_generate_v4(),
  booking_id      uuid    not null references public.bookings(id),
  customer_id     uuid    not null references public.profiles(id),
  handyman_id     uuid    not null references public.handymen(id),
  rating          int     not null check (rating between 1 and 5),
  comment         text,
  created_at      timestamptz not null default now(),

  constraint reviews_pkey primary key (id),
  constraint reviews_booking_unique unique (booking_id)  -- one review per booking
);

comment on table public.reviews is 'Customer reviews of handymen, linked to a completed booking.';

-- ─── TABLE: invoices ─────────────────────────────────────────
create table if not exists public.invoices (
  id              uuid    not null default uuid_generate_v4(),
  handyman_id     uuid    not null references public.handymen(id),
  customer_id     uuid    not null references public.profiles(id),
  booking_id      uuid    references public.bookings(id),
  invoice_number  text    not null unique,
  line_items      jsonb   not null default '[]',    -- [{desc, qty, unit_price}]
  subtotal        numeric(10,2) not null default 0,
  tax_amount      numeric(10,2) not null default 0,
  amount          numeric(10,2) not null,
  status          invoice_status_type not null default 'draft',
  due_date        date,
  paid_at         timestamptz,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint invoices_pkey primary key (id)
);

comment on table public.invoices is 'Invoices created by handymen for customers.';

-- ─── TABLE: transactions ─────────────────────────────────────
create table if not exists public.transactions (
  id              uuid    not null default uuid_generate_v4(),
  handyman_id     uuid    not null references public.handymen(id),
  booking_id      uuid    references public.bookings(id),
  amount          numeric(10,2) not null,
  type            transaction_type not null default 'earning',
  status          transaction_status_type not null default 'pending',
  description     text,
  created_at      timestamptz not null default now(),

  constraint transactions_pkey primary key (id)
);

comment on table public.transactions is 'Earnings ledger for handymen (earnings, tips, refunds).';

-- ─── TABLE: payouts ──────────────────────────────────────────
create table if not exists public.payouts (
  id                      uuid    not null default uuid_generate_v4(),
  handyman_id             uuid    not null references public.handymen(id),
  amount                  numeric(10,2) not null,
  bank_account_last4      text,
  stripe_transfer_id      text,
  status                  payout_status_type not null default 'pending',
  initiated_at            timestamptz not null default now(),
  completed_at            timestamptz,
  failure_reason          text,

  constraint payouts_pkey primary key (id)
);

comment on table public.payouts is 'Payout history from platform to handymen bank accounts.';

-- ─── TABLE: notifications ────────────────────────────────────
create table if not exists public.notifications (
  id              uuid    not null default uuid_generate_v4(),
  user_id         uuid    not null references public.profiles(id) on delete cascade,
  title           text    not null,
  body            text    not null,
  type            notification_type not null default 'system',
  reference_id    uuid,                     -- optional link to booking/message
  reference_table text,                    -- 'bookings' | 'messages' | 'payouts'
  is_read         boolean not null default false,
  created_at      timestamptz not null default now(),

  constraint notifications_pkey primary key (id)
);

comment on table public.notifications is 'In-app notifications for both customers and handymen.';

-- ─── TABLE: promotions ───────────────────────────────────────
create table if not exists public.promotions (
  id                  uuid    not null default uuid_generate_v4(),
  code                text    not null unique,
  title               text    not null,
  description         text,
  discount_type       discount_type not null default 'percent',
  discount_value      numeric(10,2) not null,
  min_booking_value   numeric(10,2) not null default 0,
  max_uses            int,                           -- null = unlimited
  uses_count          int     not null default 0,
  valid_from          timestamptz not null default now(),
  valid_until         timestamptz,
  is_active           boolean not null default true,
  service_category    text,                          -- null = all categories

  constraint promotions_pkey primary key (id)
);

comment on table public.promotions is 'Promotional codes and discount deals for customers.';

-- ─── TABLE: promotion_uses ───────────────────────────────────
create table if not exists public.promotion_uses (
  id              uuid    not null default uuid_generate_v4(),
  promotion_id    uuid    not null references public.promotions(id),
  user_id         uuid    not null references public.profiles(id),
  booking_id      uuid    references public.bookings(id),
  used_at         timestamptz not null default now(),

  constraint promotion_uses_pkey primary key (id),
  constraint promotion_uses_unique unique (promotion_id, user_id)   -- one use per user
);

-- ─── INDEXES ─────────────────────────────────────────────────
create index if not exists idx_profiles_user_role       on public.profiles(user_role);
create index if not exists idx_handymen_is_active       on public.handymen(is_active);
create index if not exists idx_handymen_rating          on public.handymen(rating desc);
create index if not exists idx_bookings_customer        on public.bookings(customer_id);
create index if not exists idx_bookings_handyman        on public.bookings(handyman_id);
create index if not exists idx_bookings_status          on public.bookings(status);
create index if not exists idx_bookings_scheduled       on public.bookings(scheduled_at);
create index if not exists idx_messages_conversation    on public.messages(conversation_id);
create index if not exists idx_messages_created         on public.messages(created_at);
create index if not exists idx_notifications_user       on public.notifications(user_id, is_read);
create index if not exists idx_transactions_handyman    on public.transactions(handyman_id);
create index if not exists idx_reviews_handyman         on public.reviews(handyman_id);
create index if not exists idx_handyman_services_hid   on public.handyman_services(handyman_id);
create index if not exists idx_addresses_user           on public.addresses(user_id);
create index if not exists idx_payment_methods_user     on public.payment_methods(user_id);
