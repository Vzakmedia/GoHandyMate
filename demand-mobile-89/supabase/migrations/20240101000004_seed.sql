-- ============================================================
-- GoHandyMate – Seed Data
-- Migration: 20240101000004_seed.sql
-- ============================================================

-- ─── Service Categories ──────────────────────────────────────
insert into public.service_categories (id, name, icon, is_popular, sort_order)
values
  (uuid_generate_v4(), 'Plumbing',     'water-outline',         true,  1),
  (uuid_generate_v4(), 'Electrical',   'flash-outline',         true,  2),
  (uuid_generate_v4(), 'Cleaning',     'sparkles-outline',      true,  3),
  (uuid_generate_v4(), 'Mounting',     'tv-outline',            false, 4),
  (uuid_generate_v4(), 'Smart Home',   'home-outline',          false, 5),
  (uuid_generate_v4(), 'Painting',     'color-palette-outline', false, 6),
  (uuid_generate_v4(), 'Yard Work',    'leaf-outline',          false, 7),
  (uuid_generate_v4(), 'HVAC',         'thermometer-outline',   true,  8),
  (uuid_generate_v4(), 'Moving',       'cube-outline',          false, 9),
  (uuid_generate_v4(), 'Pest Control', 'bug-outline',           false, 10),
  (uuid_generate_v4(), 'Handyman',     'construct-outline',     true,  11),
  (uuid_generate_v4(), 'Roofing',      'umbrella-outline',      false, 12)
on conflict (name) do nothing;

-- ─── Promotions ──────────────────────────────────────────────
insert into public.promotions (
  id, code, title, description,
  discount_type, discount_value, min_booking_value,
  max_uses, valid_from, valid_until,
  is_active, service_category
)
values
  (
    uuid_generate_v4(),
    'PLUMB15',
    '15% Off Plumbing',
    'Get 15% off your first plumbing service booking this month.',
    'percent', 15, 0,
    1000,
    now(),
    (now() + interval '30 days'),
    true,
    'Plumbing'
  ),
  (
    uuid_generate_v4(),
    'FREEESTIMATE',
    'Free Estimate',
    'Free estimate on all kitchen and bathroom remodel consultations.',
    'fixed', 0, 0,
    null,
    now(),
    (now() + interval '90 days'),
    true,
    null
  ),
  (
    uuid_generate_v4(),
    'WELCOME20',
    'Welcome New Customer',
    'New to GoHandyMate? Get $20 off your first booking over $100.',
    'fixed', 20, 100,
    null,
    now(),
    (now() + interval '365 days'),
    true,
    null
  ),
  (
    uuid_generate_v4(),
    'CLEAN10',
    '10% Off Cleaning',
    'Save 10% on any cleaning service booking.',
    'percent', 10, 50,
    500,
    now(),
    (now() + interval '60 days'),
    true,
    'Cleaning'
  )
on conflict (code) do nothing;
