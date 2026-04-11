
-- Add formatted_address column to handyman_work_areas table
ALTER TABLE public.handyman_work_areas 
ADD COLUMN IF NOT EXISTS formatted_address text;
