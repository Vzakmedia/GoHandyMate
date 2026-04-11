
-- Add skill rates table for individual skill pricing
CREATE TABLE public.handyman_skill_rates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  minimum_hours DECIMAL(3,1) DEFAULT 1.0,
  same_day_rate_multiplier DECIMAL(3,2) DEFAULT 1.5,
  emergency_rate_multiplier DECIMAL(3,2) DEFAULT 2.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, skill_name)
);

-- Add work radius and availability settings table
CREATE TABLE public.handyman_work_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  work_radius_miles INTEGER NOT NULL DEFAULT 25 CHECK (work_radius_miles <= 50),
  center_latitude DECIMAL(10,8) NOT NULL,
  center_longitude DECIMAL(11,8) NOT NULL,
  same_day_available BOOLEAN DEFAULT false,
  emergency_available BOOLEAN DEFAULT false,
  instant_booking BOOLEAN DEFAULT false,
  advance_booking_days INTEGER DEFAULT 30,
  travel_fee_enabled BOOLEAN DEFAULT false,
  travel_fee_per_mile DECIMAL(5,2) DEFAULT 0.50,
  minimum_job_amount DECIMAL(8,2) DEFAULT 50.00,
  preferred_job_types TEXT[] DEFAULT '{}',
  blackout_dates DATE[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enhanced availability slots table (TaskRabbit style)
CREATE TABLE public.handyman_availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_type TEXT NOT NULL CHECK (slot_type IN ('regular', 'same_day', 'emergency')),
  is_booked BOOLEAN DEFAULT false,
  booking_id UUID,
  price_multiplier DECIMAL(3,2) DEFAULT 1.0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add work areas table for multiple service zones
CREATE TABLE public.handyman_work_areas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  area_name TEXT NOT NULL,
  center_latitude DECIMAL(10,8) NOT NULL,
  center_longitude DECIMAL(11,8) NOT NULL,
  radius_miles INTEGER NOT NULL CHECK (radius_miles <= 50),
  is_primary BOOLEAN DEFAULT false,
  travel_time_minutes INTEGER DEFAULT 0,
  additional_travel_fee DECIMAL(6,2) DEFAULT 0.00,
  priority_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for skill rates
ALTER TABLE public.handyman_skill_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own skill rates" 
  ON public.handyman_skill_rates 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own skill rates" 
  ON public.handyman_skill_rates 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skill rates" 
  ON public.handyman_skill_rates 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skill rates" 
  ON public.handyman_skill_rates 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for work settings
ALTER TABLE public.handyman_work_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own work settings" 
  ON public.handyman_work_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work settings" 
  ON public.handyman_work_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work settings" 
  ON public.handyman_work_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for availability slots
ALTER TABLE public.handyman_availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own availability slots" 
  ON public.handyman_availability_slots 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own availability slots" 
  ON public.handyman_availability_slots 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own availability slots" 
  ON public.handyman_availability_slots 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own availability slots" 
  ON public.handyman_availability_slots 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for work areas
ALTER TABLE public.handyman_work_areas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own work areas" 
  ON public.handyman_work_areas 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own work areas" 
  ON public.handyman_work_areas 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own work areas" 
  ON public.handyman_work_areas 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own work areas" 
  ON public.handyman_work_areas 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at triggers
CREATE TRIGGER update_handyman_skill_rates_updated_at
  BEFORE UPDATE ON public.handyman_skill_rates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_handyman_work_settings_updated_at
  BEFORE UPDATE ON public.handyman_work_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_handyman_availability_slots_updated_at
  BEFORE UPDATE ON public.handyman_availability_slots
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_handyman_work_areas_updated_at
  BEFORE UPDATE ON public.handyman_work_areas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX idx_handyman_skill_rates_user_id ON public.handyman_skill_rates(user_id);
CREATE INDEX idx_handyman_work_settings_user_id ON public.handyman_work_settings(user_id);
CREATE INDEX idx_handyman_availability_slots_user_date ON public.handyman_availability_slots(user_id, date);
CREATE INDEX idx_handyman_work_areas_user_id ON public.handyman_work_areas(user_id);
CREATE INDEX idx_handyman_work_areas_location ON public.handyman_work_areas(center_latitude, center_longitude);
