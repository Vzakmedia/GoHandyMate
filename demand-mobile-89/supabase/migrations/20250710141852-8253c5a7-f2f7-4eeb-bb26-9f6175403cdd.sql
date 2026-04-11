-- Create user connections table
CREATE TABLE IF NOT EXISTS public.user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  connected_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Create community groups table
CREATE TABLE IF NOT EXISTS public.community_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT,
  is_public BOOLEAN DEFAULT true,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group members table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create user reviews table
CREATE TABLE IF NOT EXISTS public.user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(reviewer_id, reviewed_user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_connections
CREATE POLICY "Users can view their own connections" ON public.user_connections
  FOR SELECT USING (user_id = auth.uid() OR connected_user_id = auth.uid());

CREATE POLICY "Users can create connection requests" ON public.user_connections
  FOR INSERT WITH CHECK (user_id = auth.uid() OR connected_user_id = auth.uid());

CREATE POLICY "Users can update their connection status" ON public.user_connections
  FOR UPDATE USING (user_id = auth.uid() OR connected_user_id = auth.uid());

-- RLS Policies for community_groups
CREATE POLICY "Anyone can view public groups" ON public.community_groups
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create groups" ON public.community_groups
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Group creators can update their groups" ON public.community_groups
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for group_members
CREATE POLICY "Group members can view group membership" ON public.group_members
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.community_groups 
    WHERE id = group_id AND (is_public = true OR created_by = auth.uid())
  ) OR user_id = auth.uid());

CREATE POLICY "Users can join groups" ON public.group_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave groups or admins can manage" ON public.group_members
  FOR DELETE USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.community_groups 
    WHERE id = group_id AND created_by = auth.uid()
  ));

-- RLS Policies for user_reviews
CREATE POLICY "Anyone can view reviews" ON public.user_reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.user_reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "Users can update their own reviews" ON public.user_reviews
  FOR UPDATE USING (reviewer_id = auth.uid());

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_connections_updated_at BEFORE UPDATE ON public.user_connections FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_community_groups_updated_at BEFORE UPDATE ON public.community_groups FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_user_reviews_updated_at BEFORE UPDATE ON public.user_reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.community_groups 
    SET member_count = member_count + 1 
    WHERE id = NEW.group_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.community_groups 
    SET member_count = member_count - 1 
    WHERE id = OLD.group_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_group_member_count_trigger
  AFTER INSERT OR DELETE ON public.group_members
  FOR EACH ROW EXECUTE PROCEDURE update_group_member_count();