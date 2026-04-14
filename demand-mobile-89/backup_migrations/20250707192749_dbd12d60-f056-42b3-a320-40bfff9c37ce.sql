-- Check if quote_submissions table exists, if not create it
CREATE TABLE IF NOT EXISTS public.quote_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_request_id UUID NOT NULL,
  handyman_id UUID NOT NULL,
  quoted_price NUMERIC NOT NULL,
  estimated_hours NUMERIC,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (quote_request_id) REFERENCES public.custom_quote_requests(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.quote_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for quote submissions
CREATE POLICY "Handymen can create quote submissions" 
ON public.quote_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = handyman_id);

CREATE POLICY "Handymen can view their own quote submissions" 
ON public.quote_submissions 
FOR SELECT 
USING (auth.uid() = handyman_id);

CREATE POLICY "Customers can view quote submissions for their requests" 
ON public.quote_submissions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.custom_quote_requests 
  WHERE id = quote_request_id AND customer_id = auth.uid()
));

CREATE POLICY "Handymen can update their own quote submissions" 
ON public.quote_submissions 
FOR UPDATE 
USING (auth.uid() = handyman_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.update_quote_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quote_submissions_updated_at
    BEFORE UPDATE ON public.quote_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_quote_submissions_updated_at();