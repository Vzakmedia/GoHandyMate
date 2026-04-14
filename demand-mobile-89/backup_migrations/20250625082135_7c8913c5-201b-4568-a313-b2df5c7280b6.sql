
-- Enable RLS on notifications table if not already enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert notifications (for system-generated notifications)
CREATE POLICY "Allow system to insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Allow users to read their relevant notifications
CREATE POLICY "Users can read relevant notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (
    recipient_role = 'all' OR 
    (recipient_role = 'customer' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'customer'
    )) OR
    (recipient_role = 'handyman' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'handyman'
    )) OR
    (recipient_role = 'contractor' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'contractor'
    )) OR
    (recipient_role = 'property_manager' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'property_manager'
    ))
  );

-- Allow users to update notifications (mark as read)
CREATE POLICY "Users can update their notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (
    recipient_role = 'all' OR 
    (recipient_role = 'customer' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'customer'
    )) OR
    (recipient_role = 'handyman' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'handyman'
    )) OR
    (recipient_role = 'contractor' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'contractor'
    )) OR
    (recipient_role = 'property_manager' AND EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'property_manager'
    ))
  );
