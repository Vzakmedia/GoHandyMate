
-- Create business_profiles table for storing business information
CREATE TABLE public.business_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  description text,
  contact_email text NOT NULL,
  contact_phone text,
  website text,
  address text,
  services_offered text[] DEFAULT '{}',
  rating numeric DEFAULT 0,
  years_in_business integer,
  license_number text,
  insurance_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create quote_requests table for storing quote requests
CREATE TABLE public.quote_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id uuid REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  service_required text NOT NULL,
  project_description text NOT NULL,
  preferred_date timestamp with time zone,
  estimated_budget text,
  location text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on business_profiles
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

-- Enable RLS on quote_requests  
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for business_profiles
CREATE POLICY "Users can view all business profiles" ON public.business_profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own business profile" ON public.business_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own business profile" ON public.business_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own business profile" ON public.business_profiles FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for quote_requests
CREATE POLICY "Users can view their own quote requests" ON public.quote_requests FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Business owners can view quotes sent to them" ON public.quote_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.business_profiles WHERE id = quote_requests.business_id AND user_id = auth.uid())
);
CREATE POLICY "Users can create quote requests" ON public.quote_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Users can update their own quote requests" ON public.quote_requests FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Business owners can update quotes sent to them" ON public.quote_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.business_profiles WHERE id = quote_requests.business_id AND user_id = auth.uid())
);
