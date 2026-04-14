-- Create invoices table for contractor quote conversion
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID REFERENCES auth.users NOT NULL,
  customer_id UUID REFERENCES auth.users NOT NULL,
  quote_request_id UUID REFERENCES public.contractor_quote_requests(id),
  quote_submission_id UUID REFERENCES public.contractor_quote_submissions(id),
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for invoices
CREATE POLICY "Contractors can manage their own invoices" 
ON public.invoices 
FOR ALL 
USING (auth.uid() = contractor_id);

CREATE POLICY "Customers can view invoices sent to them" 
ON public.invoices 
FOR SELECT 
USING (auth.uid() = customer_id);

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.invoices;
ALTER TABLE public.invoices REPLICA IDENTITY FULL;

-- Add metrics tracking for contractor analytics
CREATE TABLE public.contractor_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  total_quotes_sent INTEGER DEFAULT 0,
  quotes_accepted INTEGER DEFAULT 0,
  quotes_rejected INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  monthly_revenue NUMERIC DEFAULT 0,
  average_response_time_hours NUMERIC DEFAULT 0,
  customer_satisfaction_rating NUMERIC DEFAULT 0,
  total_invoices_sent INTEGER DEFAULT 0,
  paid_invoices INTEGER DEFAULT 0,
  overdue_invoices INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contractor_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for contractor metrics
CREATE POLICY "Contractors can view their own metrics" 
ON public.contractor_metrics 
FOR SELECT 
USING (auth.uid() = contractor_id);

CREATE POLICY "Contractors can update their own metrics" 
ON public.contractor_metrics 
FOR UPDATE 
USING (auth.uid() = contractor_id);

CREATE POLICY "Service role can manage metrics" 
ON public.contractor_metrics 
FOR ALL 
USING (true);

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_contractor_metrics_updated_at
BEFORE UPDATE ON public.contractor_metrics
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.contractor_metrics;
ALTER TABLE public.contractor_metrics REPLICA IDENTITY FULL;

-- Function to update contractor metrics
CREATE OR REPLACE FUNCTION public.update_contractor_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update contractor metrics when invoices or quotes change
  INSERT INTO public.contractor_metrics (contractor_id) 
  VALUES (COALESCE(NEW.contractor_id, OLD.contractor_id))
  ON CONFLICT (contractor_id) DO NOTHING;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update metrics
CREATE TRIGGER trigger_update_contractor_metrics_quotes
AFTER INSERT OR UPDATE OR DELETE ON public.contractor_quote_requests
FOR EACH ROW EXECUTE FUNCTION public.update_contractor_metrics();

CREATE TRIGGER trigger_update_contractor_metrics_invoices
AFTER INSERT OR UPDATE OR DELETE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_contractor_metrics();