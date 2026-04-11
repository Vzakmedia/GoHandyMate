
-- Add years_experience column to handyman table
ALTER TABLE public.handyman 
ADD COLUMN IF NOT EXISTS years_experience integer DEFAULT 1;

-- Update existing records to have a default value based on their creation date
UPDATE public.handyman 
SET years_experience = GREATEST(1, EXTRACT(YEAR FROM age(now(), created_at))::integer)
WHERE years_experience IS NULL;
