-- Create contractor automation settings table
CREATE TABLE public.contractor_automation_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_follow_up BOOLEAN NOT NULL DEFAULT true,
  follow_up_days INTEGER NOT NULL DEFAULT 3,
  auto_expiration BOOLEAN NOT NULL DEFAULT true,
  expiration_days INTEGER NOT NULL DEFAULT 30,
  reminder_days INTEGER[] NOT NULL DEFAULT '{7,3,1}',
  auto_template_population BOOLEAN NOT NULL DEFAULT false,
  smart_pricing BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote reminders table
CREATE TABLE public.quote_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quote_id UUID NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('follow_up', 'expiration', 'reminder')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'cancelled')),
  message TEXT NOT NULL,
  client_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote templates table
CREATE TABLE public.quote_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  project_size TEXT NOT NULL CHECK (project_size IN ('small', 'medium', 'large')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  terms TEXT,
  labor_rate NUMERIC,
  markup_percentage NUMERIC DEFAULT 0.2,
  warranty_terms TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contractor_automation_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contractor_automation_settings
CREATE POLICY "Contractors can manage their own automation settings"
ON public.contractor_automation_settings
FOR ALL
USING (auth.uid() = contractor_id)
WITH CHECK (auth.uid() = contractor_id);

-- RLS Policies for quote_reminders
CREATE POLICY "Contractors can manage their own quote reminders"
ON public.quote_reminders
FOR ALL
USING (auth.uid() = contractor_id)
WITH CHECK (auth.uid() = contractor_id);

-- RLS Policies for quote_templates
CREATE POLICY "Contractors can manage their own quote templates"
ON public.quote_templates
FOR ALL
USING (auth.uid() = contractor_id)
WITH CHECK (auth.uid() = contractor_id);

-- Create indexes for better performance
CREATE INDEX idx_contractor_automation_settings_contractor_id ON public.contractor_automation_settings(contractor_id);
CREATE INDEX idx_quote_reminders_contractor_id ON public.quote_reminders(contractor_id);
CREATE INDEX idx_quote_reminders_scheduled_date ON public.quote_reminders(scheduled_date);
CREATE INDEX idx_quote_reminders_status ON public.quote_reminders(status);
CREATE INDEX idx_quote_templates_contractor_id ON public.quote_templates(contractor_id);
CREATE INDEX idx_quote_templates_service_type ON public.quote_templates(service_type, project_size);

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contractor_automation_settings_updated_at
    BEFORE UPDATE ON public.contractor_automation_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_reminders_updated_at
    BEFORE UPDATE ON public.quote_reminders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quote_templates_updated_at
    BEFORE UPDATE ON public.quote_templates
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();