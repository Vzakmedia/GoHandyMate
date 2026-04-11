-- ============================================================
-- GoHandyMate – Helper Database Functions
-- Migration: 20240101000005_helpers.sql
-- ============================================================

-- ─── Calculate handyman's available balance ───────────────────
-- Available = sum of all cleared earnings - sum of all completed payouts
create or replace function public.get_handyman_available_balance(p_handyman_id uuid)
returns numeric
language sql
security definer
stable
as $$
  select
    coalesce(
      (
        select sum(t.amount)
        from public.transactions t
        where t.handyman_id = p_handyman_id
          and t.status = 'cleared'
          and t.type = 'earning'
      ), 0
    )
    -
    coalesce(
      (
        select sum(p.amount)
        from public.payouts p
        where p.handyman_id = p_handyman_id
          and p.status in ('completed', 'processing')
      ), 0
    );
$$;

-- ─── Get booking summary stats for a handyman ────────────────
create or replace function public.get_handyman_stats(p_handyman_id uuid)
returns table (
  total_earnings        numeric,
  pending_earnings      numeric,
  completed_jobs        bigint,
  pending_jobs          bigint,
  new_requests          bigint,
  avg_rating            float8
)
language sql
security definer
stable
as $$
  select
    coalesce(sum(t.amount) filter (where t.status = 'cleared'), 0)   as total_earnings,
    coalesce(sum(t.amount) filter (where t.status = 'pending'), 0)   as pending_earnings,
    count(b.id) filter (where b.status = 'completed')                as completed_jobs,
    count(b.id) filter (where b.status in ('confirmed','in_progress','on_the_way')) as pending_jobs,
    count(b.id) filter (where b.status = 'pending')                 as new_requests,
    avg(r.rating)::float8                                            as avg_rating
  from
    public.handymen h
    left join public.bookings b        on b.handyman_id = h.id
    left join public.transactions t    on t.handyman_id = h.id
    left join public.reviews r         on r.handyman_id = h.id
  where h.id = p_handyman_id
  group by h.id;
$$;

-- ─── Validate promotion code ──────────────────────────────────
create or replace function public.validate_promotion(
  p_code          text,
  p_user_id       uuid,
  p_booking_value numeric
)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_promo    record;
  v_used     boolean;
  v_discount numeric;
begin
  -- Find active promo
  select * into v_promo
  from public.promotions
  where
    code = upper(p_code)
    and is_active = true
    and (valid_until is null or valid_until > now())
    and (valid_from <= now())
  limit 1;

  if not found then
    return jsonb_build_object('valid', false, 'error', 'Invalid or expired promotion code.');
  end if;

  -- Check if user already used it
  select exists(
    select 1 from public.promotion_uses
    where promotion_id = v_promo.id and user_id = p_user_id
  ) into v_used;

  if v_used then
    return jsonb_build_object('valid', false, 'error', 'You have already used this promotion.');
  end if;

  -- Check max uses
  if v_promo.max_uses is not null and v_promo.uses_count >= v_promo.max_uses then
    return jsonb_build_object('valid', false, 'error', 'This promotion has reached its usage limit.');
  end if;

  -- Check minimum booking value
  if p_booking_value < v_promo.min_booking_value then
    return jsonb_build_object(
      'valid', false,
      'error', 'Minimum booking value of $' || v_promo.min_booking_value || ' required.'
    );
  end if;

  -- Calculate discount
  if v_promo.discount_type = 'percent' then
    v_discount := (p_booking_value * v_promo.discount_value / 100);
  else
    v_discount := v_promo.discount_value;
  end if;

  -- Cap discount at booking value
  v_discount := least(v_discount, p_booking_value);

  return jsonb_build_object(
    'valid',          true,
    'promotion_id',   v_promo.id,
    'code',           v_promo.code,
    'title',          v_promo.title,
    'discount_type',  v_promo.discount_type,
    'discount_value', v_promo.discount_value,
    'discount_amount', round(v_discount, 2)
  );
end;
$$;

-- ─── Mark all notifications as read for a user ───────────────
create or replace function public.mark_all_notifications_read(p_user_id uuid)
returns void
language sql
security definer
as $$
  update public.notifications
  set is_read = true
  where user_id = p_user_id and is_read = false;
$$;
