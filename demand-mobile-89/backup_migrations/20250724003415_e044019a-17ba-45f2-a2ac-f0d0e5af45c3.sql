-- Create table for quote line items
CREATE TABLE public.quote_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_submission_id UUID NOT NULL REFERENCES public.contractor_quote_submissions(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('material', 'labor', 'service', 'other')),
  description TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  total_price NUMERIC GENERATED ALWAYS AS (quantity * unit_price) STORED,
  unit_measure TEXT DEFAULT 'each',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quote_line_items ENABLE ROW LEVEL SECURITY;

-- Create policies for quote line items
CREATE POLICY "Contractors can view line items for their quotes" 
ON public.quote_line_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.contractor_quote_submissions cqs
  JOIN public.contractor_quote_requests cqr ON cqs.quote_request_id = cqr.id
  WHERE cqs.id = quote_line_items.quote_submission_id 
    AND cqr.contractor_id = auth.uid()
));

CREATE POLICY "Customers can view line items for quotes they received" 
ON public.quote_line_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.contractor_quote_submissions cqs
  WHERE cqs.id = quote_line_items.quote_submission_id 
    AND cqs.customer_id = auth.uid()
));

CREATE POLICY "Contractors can manage line items for their quotes" 
ON public.quote_line_items 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.contractor_quote_submissions cqs
  JOIN public.contractor_quote_requests cqr ON cqs.quote_request_id = cqr.id
  WHERE cqs.id = quote_line_items.quote_submission_id 
    AND cqr.contractor_id = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.contractor_quote_submissions cqs
  JOIN public.contractor_quote_requests cqr ON cqs.quote_request_id = cqr.id
  WHERE cqs.id = quote_line_items.quote_submission_id 
    AND cqr.contractor_id = auth.uid()
));

-- Create trigger for updated_at
CREATE TRIGGER update_quote_line_items_updated_at
BEFORE UPDATE ON public.quote_line_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();