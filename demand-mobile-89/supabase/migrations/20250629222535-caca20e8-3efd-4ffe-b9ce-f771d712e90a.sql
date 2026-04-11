
-- First, let's make sure the ad-images bucket exists and is properly configured
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ad-images', 
  'ad-images', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own ad images" ON storage.objects;
DROP POLICY IF EXISTS "Users can view all ad images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own ad images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own ad images" ON storage.objects;

-- Create new policies for the ad-images bucket
CREATE POLICY "Anyone can view ad images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'ad-images');

CREATE POLICY "Authenticated users can upload ad images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'ad-images' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own ad images" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'ad-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own ad images" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'ad-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
