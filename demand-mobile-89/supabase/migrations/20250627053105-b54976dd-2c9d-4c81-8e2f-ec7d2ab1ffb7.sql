
-- Add missing columns for real-time location tracking
ALTER TABLE public.handyman_locations 
ADD COLUMN IF NOT EXISTS is_real_time boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS session_started timestamptz;

-- Create location_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.location_settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    tracking_enabled boolean DEFAULT false,
    sharing_enabled boolean DEFAULT false,
    update_interval integer DEFAULT 5000,
    accuracy_threshold integer DEFAULT 50,
    real_time_enabled boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS on location_settings
ALTER TABLE public.location_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for location_settings
CREATE POLICY "Users can view own location settings" ON public.location_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own location settings" ON public.location_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own location settings" ON public.location_settings
    FOR UPDATE USING (auth.uid() = user_id);

-- Update the find_nearby_handymen function to include real-time data
CREATE OR REPLACE FUNCTION public.find_nearby_handymen(
    user_lat double precision,
    user_lng double precision,
    search_radius double precision DEFAULT 25
)
RETURNS TABLE (
    id uuid,
    full_name text,
    email text,
    subscription_plan text,
    distance double precision,
    coordinates jsonb,
    last_seen timestamptz,
    is_online boolean,
    is_real_time boolean
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.email,
        COALESCE(p.subscription_plan, 'free') as subscription_plan,
        ST_Distance(
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
            ST_SetSRID(ST_MakePoint((hl.longitude)::double precision, (hl.latitude)::double precision), 4326)::geography
        ) / 1609.34 as distance,
        jsonb_build_object(
            'latitude', hl.latitude,
            'longitude', hl.longitude
        ) as coordinates,
        hl.last_updated as last_seen,
        COALESCE(hl.is_active, false) as is_online,
        COALESCE(hl.is_real_time, false) as is_real_time
    FROM profiles p
    INNER JOIN handyman_locations hl ON p.id = hl.user_id
    WHERE 
        p.user_role = 'handyman' 
        AND hl.is_active = true
        AND ST_DWithin(
            ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
            ST_SetSRID(ST_MakePoint((hl.longitude)::double precision, (hl.latitude)::double precision), 4326)::geography,
            search_radius * 1609.34
        )
    ORDER BY distance ASC
    LIMIT 50;
END;
$$;
