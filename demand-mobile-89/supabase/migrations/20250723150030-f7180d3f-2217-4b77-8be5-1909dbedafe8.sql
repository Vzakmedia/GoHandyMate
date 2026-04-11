-- Fix infinite recursion in staff_members policies by dropping and recreating them

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Staff can view other staff members" ON public.staff_members;
DROP POLICY IF EXISTS "Staff members can view staff with lower role" ON public.staff_members;
DROP POLICY IF EXISTS "Super admins can manage all staff" ON public.staff_members;
DROP POLICY IF EXISTS "Admins can manage staff with lower privileges" ON public.staff_members;

-- Create simplified, non-recursive policies
CREATE POLICY "Super admins can manage all staff"
ON public.staff_members
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND (profiles.email = 'admin@gohandymate.com' OR profiles.email LIKE '%@admin.gohandymate.com')
  )
);

CREATE POLICY "Staff can view own record"
ON public.staff_members
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Staff can update own record"
ON public.staff_members
FOR UPDATE
USING (user_id = auth.uid());