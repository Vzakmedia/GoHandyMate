
-- Create table for handyman service pricing
CREATE TABLE public.handyman_service_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL,
  subcategory_id TEXT,
  base_price NUMERIC NOT NULL DEFAULT 0,
  custom_price NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT false,
  same_day_multiplier NUMERIC NOT NULL DEFAULT 1.5,
  emergency_multiplier NUMERIC NOT NULL DEFAULT 2.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category_id, subcategory_id)
);

-- Enable RLS on the table
ALTER TABLE public.handyman_service_pricing ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own service pricing" 
  ON public.handyman_service_pricing 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own service pricing" 
  ON public.handyman_service_pricing 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own service pricing" 
  ON public.handyman_service_pricing 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own service pricing" 
  ON public.handyman_service_pricing 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at column
CREATE TRIGGER update_handyman_service_pricing_updated_at
  BEFORE UPDATE ON public.handyman_service_pricing
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_handyman_service_pricing_user_id ON public.handyman_service_pricing(user_id);
CREATE INDEX idx_handyman_service_pricing_category ON public.handyman_service_pricing(category_id);
CREATE INDEX idx_handyman_service_pricing_active ON public.handyman_service_pricing(user_id, is_active);
