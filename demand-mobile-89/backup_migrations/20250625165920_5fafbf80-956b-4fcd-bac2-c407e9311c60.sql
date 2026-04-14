
-- Add experience_level column to handyman_skill_rates table
ALTER TABLE public.handyman_skill_rates 
ADD COLUMN experience_level text DEFAULT 'Intermediate';

-- Update any existing records to have a default experience level
UPDATE public.handyman_skill_rates 
SET experience_level = 'Intermediate' 
WHERE experience_level IS NULL;
