
-- Create units table for property managers
CREATE TABLE public.units (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id uuid REFERENCES auth.users NOT NULL,
  property_id text NOT NULL,
  unit_number text NOT NULL,
  unit_name text,
  property_address text NOT NULL,
  tenant_name text,
  tenant_phone text,
  tenant_email text,
  status text DEFAULT 'vacant' CHECK (status IN ('vacant', 'occupied', 'maintenance')),
  notes text,
  tags text[],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create enhanced job_requests table if it doesn't exist with all needed columns
DO $$ 
BEGIN
  -- Add columns that might be missing from existing job_requests table
  BEGIN
    ALTER TABLE public.job_requests ADD COLUMN IF NOT EXISTS unit_id uuid REFERENCES public.units(id);
  EXCEPTION 
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.job_requests ADD COLUMN IF NOT EXISTS manager_id uuid REFERENCES auth.users;
  EXCEPTION 
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.job_requests ADD COLUMN IF NOT EXISTS job_type text;
  EXCEPTION 
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.job_requests ADD COLUMN IF NOT EXISTS preferred_schedule timestamp with time zone;
  EXCEPTION 
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.job_requests ADD COLUMN IF NOT EXISTS images text[];
  EXCEPTION 
    WHEN duplicate_column THEN NULL;
  END;
  
  BEGIN
    ALTER TABLE public.job_requests ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent'));
  EXCEPTION 
    WHEN duplicate_column THEN NULL;
  END;
END $$;

-- Enable RLS on units table
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for units table
CREATE POLICY "Property managers can view their own units" 
  ON public.units 
  FOR SELECT 
  USING (auth.uid() = manager_id);

CREATE POLICY "Property managers can create their own units" 
  ON public.units 
  FOR INSERT 
  WITH CHECK (auth.uid() = manager_id);

CREATE POLICY "Property managers can update their own units" 
  ON public.units 
  FOR UPDATE 
  USING (auth.uid() = manager_id);

CREATE POLICY "Property managers can delete their own units" 
  ON public.units 
  FOR DELETE 
  USING (auth.uid() = manager_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for units table
CREATE TRIGGER update_units_updated_at 
  BEFORE UPDATE ON public.units 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_units_manager_id ON public.units(manager_id);
CREATE INDEX IF NOT EXISTS idx_units_property_id ON public.units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON public.units(status);
CREATE INDEX IF NOT EXISTS idx_job_requests_unit_id ON public.job_requests(unit_id);
CREATE INDEX IF NOT EXISTS idx_job_requests_manager_id ON public.job_requests(manager_id);
