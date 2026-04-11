
-- First, let's clean up any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own service pricing" ON public.handyman_service_pricing;
DROP POLICY IF EXISTS "Users can create their own service pricing" ON public.handyman_service_pricing;
DROP POLICY IF EXISTS "Users can update their own service pricing" ON public.handyman_service_pricing;
DROP POLICY IF EXISTS "Users can delete their own service pricing" ON public.handyman_service_pricing;

DROP POLICY IF EXISTS "Users can view their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Users can create their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Users can update their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Users can delete their own skill rates" ON public.handyman_skill_rates;

-- Also drop the ones we just created in case there are duplicates
DROP POLICY IF EXISTS "Handymen can view their own service pricing" ON public.handyman_service_pricing;
DROP POLICY IF EXISTS "Handymen can create their own service pricing" ON public.handyman_service_pricing;
DROP POLICY IF EXISTS "Handymen can update their own service pricing" ON public.handyman_service_pricing;
DROP POLICY IF EXISTS "Handymen can delete their own service pricing" ON public.handyman_service_pricing;

DROP POLICY IF EXISTS "Handymen can view their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Handymen can create their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Handymen can update their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Handymen can delete their own skill rates" ON public.handyman_skill_rates;

-- Now create clean policies with clear names
CREATE POLICY "handyman_service_pricing_select" 
  ON public.handyman_service_pricing 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "handyman_service_pricing_insert" 
  ON public.handyman_service_pricing 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "handyman_service_pricing_update" 
  ON public.handyman_service_pricing 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "handyman_service_pricing_delete" 
  ON public.handyman_service_pricing 
  FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "handyman_skill_rates_select" 
  ON public.handyman_skill_rates 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "handyman_skill_rates_insert" 
  ON public.handyman_skill_rates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "handyman_skill_rates_update" 
  ON public.handyman_skill_rates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "handyman_skill_rates_delete" 
  ON public.handyman_skill_rates 
  FOR DELETE 
  USING (auth.uid() = user_id);
