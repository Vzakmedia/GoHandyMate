
-- Remove the NOT NULL constraints from center_latitude and center_longitude
-- since work settings don't necessarily need location data
ALTER TABLE public.handyman_work_settings 
ALTER COLUMN center_latitude DROP NOT NULL,
ALTER COLUMN center_longitude DROP NOT NULL,
ALTER COLUMN work_radius_miles DROP NOT NULL;

-- Set default values for these columns
ALTER TABLE public.handyman_work_settings 
ALTER COLUMN work_radius_miles SET DEFAULT 25;
