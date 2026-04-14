
-- Create table for handyman locations
CREATE TABLE IF NOT EXISTS public.handyman_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  accuracy DECIMAL(8, 2),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for location settings
CREATE TABLE IF NOT EXISTS public.location_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  tracking_enabled BOOLEAN NOT NULL DEFAULT false,
  sharing_enabled BOOLEAN NOT NULL DEFAULT false,
  update_interval INTEGER NOT NULL DEFAULT 30000,
  accuracy_threshold INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for handyman_locations
ALTER TABLE public.handyman_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own location data" 
  ON public.handyman_locations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own location data" 
  ON public.handyman_locations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location data" 
  ON public.handyman_locations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for location_settings
ALTER TABLE public.location_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own location settings" 
  ON public.location_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own location settings" 
  ON public.location_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own location settings" 
  ON public.location_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to find nearby handymen using PostGIS
CREATE OR REPLACE FUNCTION public.find_nearby_handymen(
  user_lat DECIMAL,
  user_lng DECIMAL,
  search_radius INTEGER DEFAULT 25
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  email TEXT,
  subscription_plan TEXT,
  distance DECIMAL,
  coordinates JSONB,
  last_seen TIMESTAMP WITH TIME ZONE,
  is_online BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.email,
    p.subscription_plan,
    ROUND(
      ST_Distance(
        ST_Point(user_lng, user_lat)::geography,
        ST_Point(hl.longitude, hl.latitude)::geography
      ) / 1609.34, 2
    ) as distance,
    jsonb_build_object(
      'latitude', hl.latitude,
      'longitude', hl.longitude
    ) as coordinates,
    hl.last_updated as last_seen,
    (hl.last_updated > now() - interval '15 minutes') as is_online
  FROM public.profiles p
  JOIN public.handyman_locations hl ON p.id = hl.user_id
  WHERE p.user_role = 'handyman'
    AND p.account_status = 'active'
    AND hl.is_active = true
    AND ST_DWithin(
      ST_Point(user_lng, user_lat)::geography,
      ST_Point(hl.longitude, hl.latitude)::geography,
      search_radius * 1609.34
    )
  ORDER BY distance;
END;
$$;

-- Create trigger to update location_settings updated_at
CREATE OR REPLACE FUNCTION update_location_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_location_settings_updated_at
    BEFORE UPDATE ON public.location_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_location_settings_timestamp();
