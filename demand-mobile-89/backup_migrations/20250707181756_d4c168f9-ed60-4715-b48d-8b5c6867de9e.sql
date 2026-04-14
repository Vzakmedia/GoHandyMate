-- Add quote_type field to custom_quote_requests table
ALTER TABLE public.custom_quote_requests 
ADD COLUMN quote_type text DEFAULT 'public' CHECK (quote_type IN ('public', 'direct'));

-- Update the description to clarify the purpose
COMMENT ON COLUMN public.custom_quote_requests.quote_type IS 'Type of quote request: public (posted to job feed) or direct (sent to specific contractors)';

-- Add an index for better performance when filtering by quote_type
CREATE INDEX idx_custom_quote_requests_quote_type ON public.custom_quote_requests(quote_type);