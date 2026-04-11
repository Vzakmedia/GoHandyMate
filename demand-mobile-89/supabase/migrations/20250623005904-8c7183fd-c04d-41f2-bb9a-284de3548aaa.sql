
-- Add subscription-related columns to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS jobs_this_month INTEGER DEFAULT 0;

-- Create subscription logs table to track payment history
CREATE TABLE IF NOT EXISTS public.subscription_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL,
  stripe_subscription_id TEXT,
  stripe_invoice_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on subscription_logs
ALTER TABLE public.subscription_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own subscription logs" ON public.subscription_logs;
DROP POLICY IF EXISTS "Service role can manage subscription logs" ON public.subscription_logs;

-- Create policies for subscription_logs
CREATE POLICY "Users can view their own subscription logs" ON public.subscription_logs
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service role can manage subscription logs" ON public.subscription_logs
  FOR ALL USING (true);

-- Create function to check if user can accept jobs based on subscription
CREATE OR REPLACE FUNCTION public.can_accept_job(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_profile RECORD;
  job_limit INTEGER;
BEGIN
  SELECT * INTO user_profile FROM public.profiles WHERE id = user_id;
  
  -- Check if subscription is active
  IF user_profile.subscription_status != 'active' THEN
    RETURN false;
  END IF;
  
  -- Determine job limit based on plan and role
  IF user_profile.user_role = 'handyman' THEN
    CASE user_profile.subscription_plan
      WHEN 'starter' THEN job_limit := 15;
      WHEN 'pro' THEN job_limit := 40;
      WHEN 'elite' THEN job_limit := -1; -- Unlimited
      ELSE job_limit := 0;
    END CASE;
  ELSIF user_profile.user_role = 'contractor' THEN
    CASE user_profile.subscription_plan
      WHEN 'basic' THEN job_limit := 25;
      WHEN 'business' THEN job_limit := 60;
      WHEN 'enterprise' THEN job_limit := -1; -- Unlimited
      ELSE job_limit := 0;
    END CASE;
  ELSE
    RETURN false;
  END IF;
  
  -- Check if within limits (-1 means unlimited)
  IF job_limit = -1 THEN
    RETURN true;
  END IF;
  
  RETURN user_profile.jobs_this_month < job_limit;
END;
$$;

-- Create function to increment job count when job is assigned
CREATE OR REPLACE FUNCTION public.increment_jobs_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only increment if job is being assigned for the first time
  IF OLD.assigned_to_user_id IS NULL AND NEW.assigned_to_user_id IS NOT NULL THEN
    UPDATE public.profiles 
    SET jobs_this_month = jobs_this_month + 1
    WHERE id = NEW.assigned_to_user_id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to automatically increment job count
DROP TRIGGER IF EXISTS increment_jobs_trigger ON public.job_requests;
CREATE TRIGGER increment_jobs_trigger
  AFTER UPDATE ON public.job_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_jobs_count();

-- Create function to reset monthly job counts (to be called by cron)
CREATE OR REPLACE FUNCTION public.reset_monthly_job_counts()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.profiles 
  SET jobs_this_month = 0
  WHERE user_role IN ('handyman', 'contractor');
END;
$$;
