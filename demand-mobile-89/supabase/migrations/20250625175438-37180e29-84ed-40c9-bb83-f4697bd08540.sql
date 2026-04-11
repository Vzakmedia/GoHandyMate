
-- Check if handyman_work_settings table exists and fix any issues
-- First, let's ensure the table has the correct structure
CREATE TABLE IF NOT EXISTS public.handyman_work_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  minimum_job_amount NUMERIC DEFAULT 50.00,
  travel_fee_per_mile NUMERIC DEFAULT 0.50,
  travel_fee_enabled BOOLEAN DEFAULT false,
  advance_booking_days INTEGER DEFAULT 30,
  instant_booking BOOLEAN DEFAULT false,
  emergency_available BOOLEAN DEFAULT false,
  same_day_available BOOLEAN DEFAULT false,
  preferred_job_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  blackout_dates DATE[] DEFAULT ARRAY[]::DATE[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.handyman_work_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for handyman_work_settings
DROP POLICY IF EXISTS "handyman_work_settings_select" ON public.handyman_work_settings;
DROP POLICY IF EXISTS "handyman_work_settings_insert" ON public.handyman_work_settings;
DROP POLICY IF EXISTS "handyman_work_settings_update" ON public.handyman_work_settings;
DROP POLICY IF EXISTS "handyman_work_settings_delete" ON public.handyman_work_settings;

CREATE POLICY "handyman_work_settings_select" 
  ON public.handyman_work_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "handyman_work_settings_insert" 
  ON public.handyman_work_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "handyman_work_settings_update" 
  ON public.handyman_work_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "handyman_work_settings_delete" 
  ON public.handyman_work_settings 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at column
DROP TRIGGER IF EXISTS update_handyman_work_settings_updated_at ON public.handyman_work_settings;
CREATE TRIGGER update_handyman_work_settings_updated_at
  BEFORE UPDATE ON public.handyman_work_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_handyman_work_settings_user_id ON public.handyman_work_settings(user_id);
