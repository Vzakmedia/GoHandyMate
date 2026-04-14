
-- Add missing columns to community_messages table for image uploads and replies
ALTER TABLE public.community_messages 
ADD COLUMN image_url TEXT,
ADD COLUMN reply_to_id UUID REFERENCES public.community_messages(id) ON DELETE SET NULL,
ADD COLUMN reply_to_message TEXT,
ADD COLUMN reply_to_user TEXT;

-- Create storage bucket for community images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community_images', 
  'community_images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
);

-- Create policy for community images bucket - allow authenticated users to upload
CREATE POLICY "Authenticated users can upload community images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'community_images' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access to community images
CREATE POLICY "Public can view community images" ON storage.objects
FOR SELECT USING (bucket_id = 'community_images');

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete their own community images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'community_images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
