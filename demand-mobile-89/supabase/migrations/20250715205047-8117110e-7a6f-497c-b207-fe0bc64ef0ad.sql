-- Create contractor_projects table for schedule management
CREATE TABLE public.contractor_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL,
  title TEXT NOT NULL,
  client TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  location TEXT,
  assigned_team TEXT[],
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create safety_checklists table
CREATE TABLE public.safety_checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create safety_incidents table
CREATE TABLE public.safety_incidents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  reported_by TEXT,
  incident_date DATE NOT NULL,
  status TEXT DEFAULT 'Open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contractor_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safety_incidents ENABLE ROW LEVEL SECURITY;

-- Create policies for contractor projects
CREATE POLICY "Contractors can manage their own projects" 
ON public.contractor_projects 
FOR ALL 
USING (auth.uid() = contractor_id);

-- Create policies for safety checklists
CREATE POLICY "Contractors can manage their own safety checklists" 
ON public.safety_checklists 
FOR ALL 
USING (auth.uid() = contractor_id);

-- Create policies for safety incidents
CREATE POLICY "Contractors can manage their own safety incidents" 
ON public.safety_incidents 
FOR ALL 
USING (auth.uid() = contractor_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_contractor_projects_updated_at
BEFORE UPDATE ON public.contractor_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safety_checklists_updated_at
BEFORE UPDATE ON public.safety_checklists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safety_incidents_updated_at
BEFORE UPDATE ON public.safety_incidents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();