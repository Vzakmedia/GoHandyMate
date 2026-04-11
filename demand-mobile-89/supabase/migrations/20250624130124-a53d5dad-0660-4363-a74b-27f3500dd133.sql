
-- Create Stripe Connect accounts table
CREATE TABLE public.stripe_connect_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id TEXT UNIQUE NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'express',
  onboarding_completed BOOLEAN DEFAULT FALSE,
  charges_enabled BOOLEAN DEFAULT FALSE,
  payouts_enabled BOOLEAN DEFAULT FALSE,
  details_submitted BOOLEAN DEFAULT FALSE,
  requirements JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create escrow payments table
CREATE TABLE public.escrow_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_request_id UUID REFERENCES job_requests(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount_total INTEGER NOT NULL, -- in cents
  amount_provider INTEGER NOT NULL, -- amount after commission
  commission_amount INTEGER NOT NULL,
  commission_rate DECIMAL(5,4) DEFAULT 0.15, -- 15% default
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'requires_action', 'succeeded', 'canceled', 'escrowed', 'released', 'refunded')),
  escrow_released_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payouts tracking table
CREATE TABLE public.provider_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL,
  stripe_payout_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  arrival_date DATE,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create commission tracking table
CREATE TABLE public.commission_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escrow_payment_id UUID REFERENCES escrow_payments(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_request_id UUID REFERENCES job_requests(id) ON DELETE CASCADE,
  commission_amount INTEGER NOT NULL,
  commission_rate DECIMAL(5,4) NOT NULL,
  collected_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.stripe_connect_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commission_records ENABLE ROW LEVEL SECURITY;

-- RLS policies for stripe_connect_accounts
CREATE POLICY "Users can view their own connect account" ON public.stripe_connect_accounts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own connect account" ON public.stripe_connect_accounts
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Service role can manage all connect accounts" ON public.stripe_connect_accounts
  FOR ALL USING (true);

-- RLS policies for escrow_payments
CREATE POLICY "Users can view payments they're involved in" ON public.escrow_payments
  FOR SELECT USING (customer_id = auth.uid() OR provider_id = auth.uid());

CREATE POLICY "Service role can manage all escrow payments" ON public.escrow_payments
  FOR ALL USING (true);

-- RLS policies for provider_payouts
CREATE POLICY "Providers can view their own payouts" ON public.provider_payouts
  FOR SELECT USING (provider_id = auth.uid());

CREATE POLICY "Service role can manage all payouts" ON public.provider_payouts
  FOR ALL USING (true);

-- RLS policies for commission_records
CREATE POLICY "Providers can view their own commission records" ON public.commission_records
  FOR SELECT USING (provider_id = auth.uid());

CREATE POLICY "Service role can manage all commission records" ON public.commission_records
  FOR ALL USING (true);

-- Add indexes for performance
CREATE INDEX idx_stripe_connect_accounts_user_id ON public.stripe_connect_accounts(user_id);
CREATE INDEX idx_stripe_connect_accounts_stripe_id ON public.stripe_connect_accounts(stripe_account_id);
CREATE INDEX idx_escrow_payments_job_id ON public.escrow_payments(job_request_id);
CREATE INDEX idx_escrow_payments_customer_id ON public.escrow_payments(customer_id);
CREATE INDEX idx_escrow_payments_provider_id ON public.escrow_payments(provider_id);
CREATE INDEX idx_escrow_payments_status ON public.escrow_payments(status);
CREATE INDEX idx_provider_payouts_provider_id ON public.provider_payouts(provider_id);
CREATE INDEX idx_commission_records_provider_id ON public.commission_records(provider_id);
