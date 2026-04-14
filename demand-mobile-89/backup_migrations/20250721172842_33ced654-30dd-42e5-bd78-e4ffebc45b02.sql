-- Create properties table for real property management
CREATE TABLE IF NOT EXISTS public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id UUID NOT NULL,
  property_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  property_type TEXT NOT NULL DEFAULT 'apartment',
  total_units INTEGER NOT NULL DEFAULT 0,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create policies for properties
CREATE POLICY "Property managers can manage their own properties" 
ON public.properties 
FOR ALL 
USING (auth.uid() = manager_id)
WITH CHECK (auth.uid() = manager_id);

-- Update units table to properly reference properties
ALTER TABLE public.units 
ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES public.properties(id),
ADD COLUMN IF NOT EXISTS unit_number TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'vacant',
ADD COLUMN IF NOT EXISTS rent_amount NUMERIC,
ADD COLUMN IF NOT EXISTS tenant_name TEXT,
ADD COLUMN IF NOT EXISTS tenant_email TEXT,
ADD COLUMN IF NOT EXISTS tenant_phone TEXT,
ADD COLUMN IF NOT EXISTS lease_start DATE,
ADD COLUMN IF NOT EXISTS lease_end DATE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update properties trigger
CREATE OR REPLACE FUNCTION public.update_property_unit_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.properties 
    SET total_units = total_units + 1 
    WHERE id = NEW.property_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.properties 
    SET total_units = total_units - 1 
    WHERE id = OLD.property_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for unit count updates
DROP TRIGGER IF EXISTS update_property_unit_count_trigger ON public.units;
CREATE TRIGGER update_property_unit_count_trigger
  AFTER INSERT OR DELETE ON public.units
  FOR EACH ROW EXECUTE FUNCTION public.update_property_unit_count();

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_properties_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_properties_updated_at_trigger ON public.properties;
CREATE TRIGGER update_properties_updated_at_trigger
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_properties_updated_at();

DROP TRIGGER IF EXISTS update_units_updated_at_trigger ON public.units;
CREATE TRIGGER update_units_updated_at_trigger
  BEFORE UPDATE ON public.units
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();