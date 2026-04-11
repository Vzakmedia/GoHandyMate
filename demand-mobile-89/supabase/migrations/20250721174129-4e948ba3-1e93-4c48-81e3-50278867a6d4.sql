-- Create maintenance_requests table for general maintenance
CREATE TABLE public.maintenance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'standard', -- 'emergency', 'recurring', 'standard'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'
  frequency TEXT, -- For recurring: 'weekly', 'monthly', 'quarterly', 'annually'
  next_scheduled TIMESTAMP WITH TIME ZONE,
  assigned_to_user_id UUID,
  estimated_cost NUMERIC(10,2),
  actual_cost NUMERIC(10,2),
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create emergency_reports table
CREATE TABLE public.emergency_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  emergency_type TEXT NOT NULL, -- 'fire', 'flood', 'gas_leak', 'electrical', 'structural', 'security', 'other'
  severity TEXT NOT NULL DEFAULT 'high', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_details TEXT,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'reported', -- 'reported', 'dispatched', 'on_site', 'resolved'
  responder_id UUID,
  response_time_minutes INTEGER,
  resolved_at TIMESTAMP WITH TIME ZONE,
  follow_up_required BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_reports ENABLE ROW LEVEL SECURITY;

-- RLS policies for maintenance_requests
CREATE POLICY "Property managers can view their maintenance requests" 
ON public.maintenance_requests 
FOR SELECT 
USING (auth.uid() = manager_id);

CREATE POLICY "Property managers can create maintenance requests" 
ON public.maintenance_requests 
FOR INSERT 
WITH CHECK (auth.uid() = manager_id);

CREATE POLICY "Property managers can update their maintenance requests" 
ON public.maintenance_requests 
FOR UPDATE 
USING (auth.uid() = manager_id);

CREATE POLICY "Property managers can delete their maintenance requests" 
ON public.maintenance_requests 
FOR DELETE 
USING (auth.uid() = manager_id);

CREATE POLICY "Handymen can view assigned maintenance requests" 
ON public.maintenance_requests 
FOR SELECT 
USING (auth.uid() = assigned_to_user_id);

CREATE POLICY "Handymen can update assigned maintenance requests" 
ON public.maintenance_requests 
FOR UPDATE 
USING (auth.uid() = assigned_to_user_id);

-- RLS policies for emergency_reports
CREATE POLICY "Users can view their emergency reports" 
ON public.emergency_reports 
FOR SELECT 
USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create emergency reports" 
ON public.emergency_reports 
FOR INSERT 
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Property managers can view reports for their properties" 
ON public.emergency_reports 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.properties 
  WHERE properties.id = emergency_reports.property_id 
  AND properties.manager_id = auth.uid()
));

CREATE POLICY "Property managers can update reports for their properties" 
ON public.emergency_reports 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.properties 
  WHERE properties.id = emergency_reports.property_id 
  AND properties.manager_id = auth.uid()
));

CREATE POLICY "Responders can view and update assigned reports" 
ON public.emergency_reports 
FOR SELECT 
USING (auth.uid() = responder_id);

CREATE POLICY "Responders can update assigned reports" 
ON public.emergency_reports 
FOR UPDATE 
USING (auth.uid() = responder_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_maintenance_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_emergency_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_maintenance_requests_updated_at
BEFORE UPDATE ON public.maintenance_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_maintenance_updated_at_column();

CREATE TRIGGER update_emergency_reports_updated_at
BEFORE UPDATE ON public.emergency_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_emergency_updated_at_column();