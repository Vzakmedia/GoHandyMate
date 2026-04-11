
-- Create storage bucket for demo videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'demo-videos', 
  'demo-videos', 
  true, 
  52428800, -- 50MB limit
  ARRAY['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['video/mp4', 'video/mov', 'video/avi', 'video/quicktime', 'video/x-msvideo'];

-- Create RLS policies for the demo-videos bucket
CREATE POLICY "Anyone can view demo videos" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'demo-videos');

CREATE POLICY "Authenticated users can upload demo videos" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'demo-videos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own demo videos" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'demo-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own demo videos" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'demo-videos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
