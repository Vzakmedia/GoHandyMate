
-- Add missing columns to advertisements table to match the code expectations
ALTER TABLE public.advertisements 
ADD COLUMN IF NOT EXISTS ad_title TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS ad_description TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS plan_type TEXT NOT NULL DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
ADD COLUMN IF NOT EXISTS target_zip_codes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS target_audience TEXT DEFAULT 'all',
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS clicks_count INTEGER DEFAULT 0;

-- Update the status column to use proper enum values
UPDATE public.advertisements SET status = 'active' WHERE status NOT IN ('pending', 'active', 'rejected', 'expired');

-- Add RLS policies for advertisements
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Policy for users to view active advertisements
CREATE POLICY "Users can view active advertisements" 
  ON public.advertisements 
  FOR SELECT 
  USING (status = 'active');

-- Policy for users to manage their own advertisements
CREATE POLICY "Users can manage their own advertisements" 
  ON public.advertisements 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Policy for admins to manage all advertisements
CREATE POLICY "Admins can manage all advertisements" 
  ON public.advertisements 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (email = 'admin@gohandymate.com' OR email LIKE '%@admin.gohandymate.com')
    )
  );
