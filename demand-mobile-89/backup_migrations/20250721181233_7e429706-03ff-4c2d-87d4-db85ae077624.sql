-- Add approval status to properties table
ALTER TABLE public.properties 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by UUID REFERENCES auth.users(id);

-- Create index for better performance
CREATE INDEX idx_properties_status ON public.properties(status);

-- Update RLS policies to only allow viewing approved properties when adding units
CREATE POLICY "Property managers can view approved properties for unit creation" 
ON public.properties 
FOR SELECT 
USING (status = 'approved' AND auth.uid() = manager_id);