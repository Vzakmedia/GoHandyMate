-- Create project_photos table for photo documentation
CREATE TABLE public.project_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contractor_id UUID NOT NULL,
  project_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('before', 'progress', 'after')),
  photo_url TEXT NOT NULL,
  location TEXT,
  taken_date DATE NOT NULL DEFAULT CURRENT_DATE,
  file_size BIGINT,
  mime_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;

-- Create policies for project photos
CREATE POLICY "Contractors can manage their own project photos" 
ON public.project_photos 
FOR ALL 
USING (auth.uid() = contractor_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_photos_updated_at
BEFORE UPDATE ON public.project_photos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for project photos
INSERT INTO storage.buckets (id, name, public) VALUES ('project-photos', 'project-photos', true);

-- Create policies for project photo uploads
CREATE POLICY "Users can upload their own project photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own project photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-photos' AND auth.uid()::text = (storage.foldername(name))[1]);