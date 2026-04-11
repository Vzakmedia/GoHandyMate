-- Add trial tracking fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN trial_start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN trial_end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN is_trial_used BOOLEAN DEFAULT FALSE,
ADD COLUMN trial_plan TEXT;