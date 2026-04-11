-- Create business settings table for quote personalization
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL DEFAULT '',
  business_logo_url TEXT,
  business_address TEXT,
  business_phone TEXT,
  business_email TEXT,
  business_website TEXT,
  license_number TEXT,
  insurance_number TEXT,
  tax_id TEXT,
  payment_terms TEXT DEFAULT 'Net 30',
  terms_conditions TEXT DEFAULT 'Payment is due within 30 days of invoice date.',
  quote_footer TEXT DEFAULT 'Thank you for your business!',
  default_labor_rate NUMERIC DEFAULT 50.00,
  default_markup_percentage NUMERIC DEFAULT 20.00,
  auto_quote_expiry_days INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for business settings
CREATE POLICY "Users can manage their own business settings" 
ON public.business_settings 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_business_settings_updated_at
BEFORE UPDATE ON public.business_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.business_settings;
ALTER TABLE public.business_settings REPLICA IDENTITY FULL;

-- Update contractor_quote_submissions table for better quote management
ALTER TABLE public.contractor_quote_submissions ADD COLUMN IF NOT EXISTS quote_number TEXT;
ALTER TABLE public.contractor_quote_submissions ADD COLUMN IF NOT EXISTS terms_conditions TEXT;
ALTER TABLE public.contractor_quote_submissions ADD COLUMN IF NOT EXISTS payment_terms TEXT;
ALTER TABLE public.contractor_quote_submissions ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contractor_quote_submissions_quote_number ON public.contractor_quote_submissions(quote_number);
CREATE INDEX IF NOT EXISTS idx_business_settings_user_id ON public.business_settings(user_id);