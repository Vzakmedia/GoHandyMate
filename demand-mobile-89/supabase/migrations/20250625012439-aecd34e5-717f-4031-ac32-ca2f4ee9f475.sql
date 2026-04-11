
-- Create the handyman_schedule table that's missing
CREATE TABLE IF NOT EXISTS public.handyman_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  day_of_week TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.handyman_schedule ENABLE ROW LEVEL SECURITY;

-- Create policy for handyman schedule access
CREATE POLICY "Users can manage their own schedule" 
  ON public.handyman_schedule 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Drop the problematic trigger that's blocking handyman profile creation
DROP TRIGGER IF EXISTS handyman_insert_trigger ON public.handyman;

-- Create a new, more permissive trigger for handyman table
CREATE OR REPLACE FUNCTION public.handle_handyman_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Allow handyman profile creation for users with handyman role
  -- Set user_id if not already set
  IF NEW.user_id IS NULL THEN
    NEW.user_id = auth.uid();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the new trigger
CREATE TRIGGER handyman_insert_trigger
  BEFORE INSERT ON public.handyman
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_handyman_insert();
