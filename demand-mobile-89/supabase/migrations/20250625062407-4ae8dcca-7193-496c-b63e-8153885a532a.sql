
-- First, let's make sure the profiles table has all the necessary columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS zip_code text;

-- Update the existing profiles table to ensure avatar_url exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;
