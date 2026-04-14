-- Fix RLS policies for system_config table to allow admin operations

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Staff can view all system config" ON public.system_config;
DROP POLICY IF EXISTS "Staff can update all system config" ON public.system_config;

-- Create proper policies for system_config table
CREATE POLICY "Admins can manage all system config"
ON public.system_config
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.email = 'admin@gohandymate.com' OR profiles.email LIKE '%@admin.gohandymate.com')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.email = 'admin@gohandymate.com' OR profiles.email LIKE '%@admin.gohandymate.com')
  )
);

-- Allow public read access for configs marked as public
CREATE POLICY "Public can view public system config"
ON public.system_config
FOR SELECT
USING (is_public = true);