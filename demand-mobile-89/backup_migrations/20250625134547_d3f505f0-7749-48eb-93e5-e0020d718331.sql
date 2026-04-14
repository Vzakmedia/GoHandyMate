
-- Enable RLS on handyman_service_pricing table if not already enabled
ALTER TABLE public.handyman_service_pricing ENABLE ROW LEVEL SECURITY;

-- Create policy for handymen to view their own service pricing
CREATE POLICY "Handymen can view their own service pricing" 
  ON public.handyman_service_pricing 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for handymen to insert their own service pricing
CREATE POLICY "Handymen can create their own service pricing" 
  ON public.handyman_service_pricing 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy for handymen to update their own service pricing
CREATE POLICY "Handymen can update their own service pricing" 
  ON public.handyman_service_pricing 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy for handymen to delete their own service pricing
CREATE POLICY "Handymen can delete their own service pricing" 
  ON public.handyman_service_pricing 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Also ensure RLS policies exist for handyman_skill_rates table
ALTER TABLE public.handyman_skill_rates ENABLE ROW LEVEL SECURITY;

-- Create policies for handyman_skill_rates if they don't exist
DROP POLICY IF EXISTS "Handymen can view their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Handymen can create their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Handymen can update their own skill rates" ON public.handyman_skill_rates;
DROP POLICY IF EXISTS "Handymen can delete their own skill rates" ON public.handyman_skill_rates;

CREATE POLICY "Handymen can view their own skill rates" 
  ON public.handyman_skill_rates 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Handymen can create their own skill rates" 
  ON public.handyman_skill_rates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Handymen can update their own skill rates" 
  ON public.handyman_skill_rates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Handymen can delete their own skill rates" 
  ON public.handyman_skill_rates 
  FOR DELETE 
  USING (auth.uid() = user_id);
