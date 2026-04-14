
-- Create storage bucket for advertisement images
INSERT INTO storage.buckets (id, name, public)
VALUES ('ad-images', 'ad-images', true);

-- Create RLS policies for the ad-images bucket
CREATE POLICY "Users can upload their own ad images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ad-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view all ad images"
ON storage.objects FOR SELECT
USING (bucket_id = 'ad-images');

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
