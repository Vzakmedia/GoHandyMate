
-- Create custom quote requests table
CREATE TABLE public.custom_quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES auth.users NOT NULL,
  service_name TEXT NOT NULL,
  service_description TEXT NOT NULL,
  location TEXT NOT NULL,
  preferred_date TIMESTAMP WITH TIME ZONE,
  budget_range TEXT,
  urgency TEXT DEFAULT 'flexible',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quotes_received', 'accepted', 'cancelled')),
  accepted_quote_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote submissions table
CREATE TABLE public.quote_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quote_request_id UUID REFERENCES public.custom_quote_requests(id) ON DELETE CASCADE NOT NULL,
  handyman_id UUID REFERENCES auth.users NOT NULL,
  quoted_price NUMERIC NOT NULL,
  estimated_hours NUMERIC,
  description TEXT NOT NULL,
  materials_included BOOLEAN DEFAULT false,
  materials_cost NUMERIC DEFAULT 0,
  travel_fee NUMERIC DEFAULT 0,
  availability_note TEXT,
  valid_until TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote notifications table
CREATE TABLE public.quote_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID REFERENCES auth.users NOT NULL,
  quote_request_id UUID REFERENCES public.custom_quote_requests(id),
  quote_submission_id UUID REFERENCES public.quote_submissions(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('new_quote_request', 'quote_submitted', 'quote_accepted', 'quote_rejected')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for custom_quote_requests
ALTER TABLE public.custom_quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own quote requests" 
  ON public.custom_quote_requests 
  FOR SELECT 
  USING (auth.uid() = customer_id);

CREATE POLICY "Customers can create quote requests" 
  ON public.custom_quote_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their own quote requests" 
  ON public.custom_quote_requests 
  FOR UPDATE 
  USING (auth.uid() = customer_id);

CREATE POLICY "Handymen can view pending quote requests" 
  ON public.custom_quote_requests 
  FOR SELECT 
  USING (
    status = 'pending' AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND user_role = 'handyman' 
      AND account_status = 'active'
    )
  );

-- Add RLS policies for quote_submissions
ALTER TABLE public.quote_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Handymen can view their own quote submissions" 
  ON public.quote_submissions 
  FOR SELECT 
  USING (auth.uid() = handyman_id);

CREATE POLICY "Customers can view quotes for their requests" 
  ON public.quote_submissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.custom_quote_requests 
      WHERE id = quote_request_id 
      AND customer_id = auth.uid()
    )
  );

CREATE POLICY "Handymen can create quote submissions" 
  ON public.quote_submissions 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = handyman_id AND 
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND user_role = 'handyman' 
      AND account_status = 'active'
    )
  );

CREATE POLICY "Handymen can update their own quote submissions" 
  ON public.quote_submissions 
  FOR UPDATE 
  USING (auth.uid() = handyman_id);

-- Add RLS policies for quote_notifications
ALTER TABLE public.quote_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
  ON public.quote_notifications 
  FOR SELECT 
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.quote_notifications 
  FOR UPDATE 
  USING (auth.uid() = recipient_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_custom_quote_requests_updated_at 
  BEFORE UPDATE ON public.custom_quote_requests 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_submissions_updated_at 
  BEFORE UPDATE ON public.quote_submissions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all quote-related tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_quote_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_notifications;

-- Set replica identity for realtime updates
ALTER TABLE public.custom_quote_requests REPLICA IDENTITY FULL;
ALTER TABLE public.quote_submissions REPLICA IDENTITY FULL;
ALTER TABLE public.quote_notifications REPLICA IDENTITY FULL;

-- Create function to notify handymen about new quote requests
CREATE OR REPLACE FUNCTION public.notify_handymen_new_quote_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notifications for all active handymen
  INSERT INTO public.quote_notifications (
    recipient_id,
    quote_request_id,
    notification_type,
    title,
    message
  )
  SELECT 
    p.id,
    NEW.id,
    'new_quote_request',
    'New Quote Request Available',
    'A customer is looking for ' || NEW.service_name || ' in ' || NEW.location
  FROM public.profiles p
  WHERE p.user_role = 'handyman' 
    AND p.account_status = 'active'
    AND p.subscription_status = 'active';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_handymen_new_quote_request
  AFTER INSERT ON public.custom_quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_handymen_new_quote_request();

-- Create function to handle quote acceptance
CREATE OR REPLACE FUNCTION public.handle_quote_acceptance()
RETURNS TRIGGER AS $$
BEGIN
  -- If a quote is being accepted
  IF NEW.accepted_quote_id IS NOT NULL AND OLD.accepted_quote_id IS NULL THEN
    -- Update the quote request status
    NEW.status = 'accepted';
    
    -- Update the accepted quote submission status
    UPDATE public.quote_submissions 
    SET status = 'accepted' 
    WHERE id = NEW.accepted_quote_id;
    
    -- Reject all other quote submissions for this request
    UPDATE public.quote_submissions 
    SET status = 'rejected' 
    WHERE quote_request_id = NEW.id 
      AND id != NEW.accepted_quote_id;
    
    -- Create job request for the accepted handyman
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
      NEW.customer_id,
      qs.handyman_id,
      'Custom Quote Job: ' || NEW.service_name,
      NEW.service_description || E'\n\nQuoted Price: $' || qs.quoted_price::text,
      NEW.location,
      qs.quoted_price::integer,
      'assigned',
      'custom_quote',
      NEW.service_name,
      NEW.preferred_date
    FROM public.quote_submissions qs
    WHERE qs.id = NEW.accepted_quote_id;
    
    -- Notify the accepted handyman
    INSERT INTO public.quote_notifications (
      recipient_id,
      quote_request_id,
      quote_submission_id,
      notification_type,
      title,
      message
    )
    SELECT 
      qs.handyman_id,
      NEW.id,
      NEW.accepted_quote_id,
      'quote_accepted',
      'Your Quote Was Accepted!',
      'Congratulations! Your quote for ' || NEW.service_name || ' has been accepted.'
    FROM public.quote_submissions qs
    WHERE qs.id = NEW.accepted_quote_id;
    
    -- Notify rejected handymen
    INSERT INTO public.quote_notifications (
      recipient_id,
      quote_request_id,
      quote_submission_id,
      notification_type,
      title,
      message
    )
    SELECT 
      qs.handyman_id,
      NEW.id,
      qs.id,
      'quote_rejected',
      'Quote Not Selected',
      'Thank you for your quote for ' || NEW.service_name || '. The customer has selected another provider.'
    FROM public.quote_submissions qs
    WHERE qs.quote_request_id = NEW.id AND qs.id != NEW.accepted_quote_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_handle_quote_acceptance
  BEFORE UPDATE ON public.custom_quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_quote_acceptance();
