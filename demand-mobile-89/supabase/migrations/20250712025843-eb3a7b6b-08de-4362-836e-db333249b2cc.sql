-- Create training_resources table
CREATE TABLE public.training_resources (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  video_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.training_resources ENABLE ROW LEVEL SECURITY;

-- Create policies for training_resources
CREATE POLICY "Anyone can view training resources" 
ON public.training_resources 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage training resources" 
ON public.training_resources 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      email = 'admin@gohandymate.com' 
      OR email LIKE '%@admin.gohandymate.com'
      OR email = 'support@gohandymate.com'
    )
  )
);

-- Create storage bucket for training videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('training-videos', 'training-videos', true);

-- Create storage policies for training videos
CREATE POLICY "Anyone can view training videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'training-videos');

CREATE POLICY "Admins can upload training videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'training-videos' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      email = 'admin@gohandymate.com' 
      OR email LIKE '%@admin.gohandymate.com'
      OR email = 'support@gohandymate.com'
    )
  )
);

CREATE POLICY "Admins can delete training videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'training-videos' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND (
      email = 'admin@gohandymate.com' 
      OR email LIKE '%@admin.gohandymate.com'
      OR email = 'support@gohandymate.com'
    )
  )
);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_training_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_training_resources_updated_at
BEFORE UPDATE ON public.training_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_training_resources_updated_at();

-- Insert existing training resources data
INSERT INTO public.training_resources (id, title, description, duration, level) VALUES
(1, 'Advanced Plumbing Techniques', 'Master complex plumbing repairs and installations with professional techniques used by certified plumbers.', '45 min', 'Advanced'),
(2, 'Electrical Safety & Code Compliance', 'Learn essential electrical safety protocols and how to ensure your work meets local building codes.', '38 min', 'Intermediate'),
(3, 'Business Growth for Handymen', 'Strategies to expand your handyman business, manage clients, and increase your revenue streams.', '52 min', 'Beginner'),
(4, 'HVAC Troubleshooting Guide', 'Comprehensive guide to diagnosing and fixing common HVAC problems in residential properties.', '41 min', 'Advanced'),
(5, 'Carpentry & Woodworking Mastery', 'From basic repairs to custom installations, learn carpentry skills that set you apart from the competition.', '49 min', 'Intermediate'),
(6, 'Digital Marketing for Service Providers', 'Build your online presence and attract more customers through effective digital marketing strategies.', '35 min', 'Beginner'),
(7, 'Advanced Wood Joinery Techniques', 'Master traditional and modern wood joinery methods including dovetails, mortise and tenon, and finger joints.', '56 min', 'Advanced'),
(8, 'Custom Cabinet Making', 'Learn professional cabinet construction techniques, from design to installation and finishing.', '67 min', 'Advanced'),
(9, 'Finish Carpentry Essentials', 'Perfect your trim work, crown molding, and baseboards with professional finishing techniques.', '43 min', 'Intermediate'),
(10, 'Hardwood Floor Installation', 'Complete guide to hardwood flooring installation, from subfloor preparation to final finishing.', '58 min', 'Intermediate'),
(11, 'Deck Building & Outdoor Structures', 'Build professional-grade decks, pergolas, and outdoor structures with proper foundation and safety techniques.', '72 min', 'Advanced'),
(12, 'Power Tool Mastery & Safety', 'Advanced techniques for using power tools safely and efficiently in woodworking and construction projects.', '39 min', 'Beginner');