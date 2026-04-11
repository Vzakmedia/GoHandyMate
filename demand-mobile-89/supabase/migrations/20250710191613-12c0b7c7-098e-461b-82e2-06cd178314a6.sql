-- Create contractor quote requests table
CREATE TABLE IF NOT EXISTS public.contractor_quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT NOT NULL,
  location TEXT NOT NULL,
  preferred_date TIMESTAMP WITH TIME ZONE,
  budget_range TEXT,
  urgency TEXT DEFAULT 'flexible',
  status TEXT DEFAULT 'pending',
  quote_type TEXT DEFAULT 'direct',
  accepted_quote_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contractor quote submissions table  
CREATE TABLE IF NOT EXISTS public.contractor_quote_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_request_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  quoted_price NUMERIC NOT NULL,
  estimated_hours NUMERIC,
  description TEXT NOT NULL,
  materials_included BOOLEAN DEFAULT false,
  materials_cost NUMERIC DEFAULT 0,
  travel_fee NUMERIC DEFAULT 0,
  availability_note TEXT,
  status TEXT DEFAULT 'pending',
  valid_until TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (quote_request_id) REFERENCES public.contractor_quote_requests(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.contractor_quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractor_quote_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for contractor quote requests
CREATE POLICY "Contractors can create quote requests to customers" 
ON public.contractor_quote_requests 
FOR INSERT 
WITH CHECK (auth.uid() = contractor_id);

CREATE POLICY "Contractors can view their own quote requests" 
ON public.contractor_quote_requests 
FOR SELECT 
USING (auth.uid() = contractor_id);

CREATE POLICY "Customers can view quote requests sent to them" 
ON public.contractor_quote_requests 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Contractors can update their own quote requests" 
ON public.contractor_quote_requests 
FOR UPDATE 
USING (auth.uid() = contractor_id);

CREATE POLICY "Customers can update requests sent to them (for accepting quotes)" 
ON public.contractor_quote_requests 
FOR UPDATE 
USING (auth.uid() = customer_id);

-- RLS policies for contractor quote submissions
CREATE POLICY "Customers can create quote submissions for contractor requests" 
ON public.contractor_quote_submissions 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can view their own quote submissions" 
ON public.contractor_quote_submissions 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Contractors can view quote submissions for their requests" 
ON public.contractor_quote_submissions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.contractor_quote_requests 
  WHERE id = quote_request_id AND contractor_id = auth.uid()
));

CREATE POLICY "Customers can update their own quote submissions" 
ON public.contractor_quote_submissions 
FOR UPDATE 
USING (auth.uid() = customer_id);

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION public.update_contractor_quote_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_contractor_quote_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contractor_quote_requests_updated_at
    BEFORE UPDATE ON public.contractor_quote_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_contractor_quote_requests_updated_at();

CREATE TRIGGER update_contractor_quote_submissions_updated_at
    BEFORE UPDATE ON public.contractor_quote_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_contractor_quote_submissions_updated_at();

-- Function to handle contractor quote acceptance
CREATE OR REPLACE FUNCTION public.handle_contractor_quote_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  -- If a quote is being accepted
  IF NEW.accepted_quote_id IS NOT NULL AND OLD.accepted_quote_id IS NULL THEN
    -- Update the quote request status
    NEW.status = 'accepted';
    
    -- Update the accepted quote submission status
    UPDATE public.contractor_quote_submissions 
    SET status = 'accepted' 
    WHERE id = NEW.accepted_quote_id;
    
    -- Reject all other quote submissions for this request
    UPDATE public.contractor_quote_submissions 
    SET status = 'rejected' 
    WHERE quote_request_id = NEW.id 
      AND id != NEW.accepted_quote_id;
    
    -- Create job request for the accepted customer
    INSERT INTO public.job_requests (
      customer_id,
      assigned_to_user_id,
      title,
      description,
      location,
      budget,
      status,
      job_type,
      category,
      preferred_schedule
    )
    SELECT 
      cqs.customer_id,
      NEW.contractor_id,
      'Contractor Quote Job: ' || NEW.service_name,
      NEW.service_description || E'\n\nQuoted Price: $' || cqs.quoted_price::text,
      NEW.location,
      cqs.quoted_price::integer,
      'assigned',
      'contractor_quote',
      NEW.service_name,
      NEW.preferred_date
    FROM public.contractor_quote_submissions cqs
    WHERE cqs.id = NEW.accepted_quote_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_contractor_quote_acceptance_trigger
    BEFORE UPDATE ON public.contractor_quote_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_contractor_quote_acceptance();