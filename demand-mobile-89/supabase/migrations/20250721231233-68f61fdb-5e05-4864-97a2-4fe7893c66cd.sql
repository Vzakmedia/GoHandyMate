-- Create comprehensive admin management tables

-- Staff roles and permissions
CREATE TYPE public.staff_role_type AS ENUM (
  'super_admin',
  'admin', 
  'manager',
  'supervisor',
  'support_agent',
  'moderator',
  'analyst'
);

CREATE TYPE public.permission_type AS ENUM (
  'user_management',
  'content_moderation', 
  'financial_access',
  'system_settings',
  'analytics_view',
  'promotion_management',
  'reward_management',
  'staff_management',
  'verification_access',
  'support_access'
);

-- Staff management table
CREATE TABLE public.staff_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  staff_role staff_role_type NOT NULL DEFAULT 'support_agent',
  department TEXT NOT NULL DEFAULT 'general',
  permissions permission_type[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  hired_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  manager_id UUID REFERENCES public.staff_members(id),
  access_level INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Promotions system
CREATE TABLE public.promotions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  promotion_type TEXT NOT NULL CHECK (promotion_type IN ('discount', 'bogo', 'free_service', 'cashback', 'referral')),
  value_type TEXT NOT NULL CHECK (value_type IN ('percentage', 'fixed_amount', 'free')),
  value_amount NUMERIC,
  minimum_order_amount NUMERIC DEFAULT 0,
  maximum_discount_amount NUMERIC,
  code TEXT UNIQUE,
  target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'new_customers', 'existing_customers', 'handymen', 'contractors', 'property_managers')),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Rewards system
CREATE TABLE public.rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('points', 'badge', 'discount', 'free_service', 'cash_reward')),
  points_required INTEGER,
  cash_value NUMERIC,
  badge_icon TEXT,
  requirements JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expiry_days INTEGER,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User reward tracking
CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  redeemed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redemption_code TEXT,
  UNIQUE(user_id, reward_id, earned_at)
);

-- User points system
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  available_points INTEGER NOT NULL DEFAULT 0,
  lifetime_points INTEGER NOT NULL DEFAULT 0,
  tier_level TEXT NOT NULL DEFAULT 'bronze' CHECK (tier_level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- System configuration
CREATE TABLE public.system_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  config_value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  updated_by UUID NOT NULL REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- TaskRabbit/Thumbtack integration tracking
CREATE TABLE public.external_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('taskrabbit', 'thumbtack', 'angie', 'homeadvisor')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  external_user_id TEXT NOT NULL,
  integration_data JSONB NOT NULL DEFAULT '{}',
  sync_status TEXT NOT NULL DEFAULT 'active' CHECK (sync_status IN ('active', 'paused', 'error', 'disconnected')),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(provider, user_id)
);

-- Enable RLS
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_integrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_members
CREATE POLICY "Super admins can manage all staff" 
ON public.staff_members 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.staff_members sm 
  WHERE sm.user_id = auth.uid() AND sm.staff_role = 'super_admin' AND sm.is_active = true
));

CREATE POLICY "Staff can view their own record" 
ON public.staff_members 
FOR SELECT 
USING (user_id = auth.uid());

-- RLS Policies for promotions
CREATE POLICY "Staff can manage promotions" 
ON public.promotions 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.staff_members sm 
  WHERE sm.user_id = auth.uid() AND 'promotion_management' = ANY(sm.permissions) AND sm.is_active = true
));

CREATE POLICY "Users can view active promotions" 
ON public.promotions 
FOR SELECT 
USING (is_active = true AND start_date <= now() AND end_date >= now());

-- RLS Policies for rewards
CREATE POLICY "Staff can manage rewards" 
ON public.rewards 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.staff_members sm 
  WHERE sm.user_id = auth.uid() AND 'reward_management' = ANY(sm.permissions) AND sm.is_active = true
));

CREATE POLICY "Users can view active rewards" 
ON public.rewards 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for user_rewards
CREATE POLICY "Users can view their own rewards" 
ON public.user_rewards 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Staff can manage user rewards" 
ON public.user_rewards 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.staff_members sm 
  WHERE sm.user_id = auth.uid() AND 'reward_management' = ANY(sm.permissions) AND sm.is_active = true
));

-- RLS Policies for user_points
CREATE POLICY "Users can view their own points" 
ON public.user_points 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Staff can manage user points" 
ON public.user_points 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.staff_members sm 
  WHERE sm.user_id = auth.uid() AND 'reward_management' = ANY(sm.permissions) AND sm.is_active = true
));

-- RLS Policies for system_config
CREATE POLICY "Super admins can manage system config" 
ON public.system_config 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.staff_members sm 
  WHERE sm.user_id = auth.uid() AND sm.staff_role = 'super_admin' AND sm.is_active = true
));

CREATE POLICY "Users can view public config" 
ON public.system_config 
FOR SELECT 
USING (is_public = true);

-- RLS Policies for external_integrations
CREATE POLICY "Users can manage their own integrations" 
ON public.external_integrations 
FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Staff can view all integrations" 
ON public.external_integrations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.staff_members sm 
  WHERE sm.user_id = auth.uid() AND 'analytics_view' = ANY(sm.permissions) AND sm.is_active = true
));

-- Triggers for automatic updates
CREATE TRIGGER update_staff_members_updated_at
  BEFORE UPDATE ON public.staff_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at
  BEFORE UPDATE ON public.promotions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON public.rewards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at
  BEFORE UPDATE ON public.system_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_external_integrations_updated_at
  BEFORE UPDATE ON public.external_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON public.user_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system configurations
INSERT INTO public.system_config (config_key, config_value, description, is_public, updated_by) VALUES 
('point_values', '{"job_completion": 100, "referral": 500, "review": 50, "profile_complete": 200}', 'Point values for different actions', false, '00000000-0000-0000-0000-000000000000'),
('tier_thresholds', '{"silver": 1000, "gold": 5000, "platinum": 15000, "diamond": 50000}', 'Point thresholds for tier levels', false, '00000000-0000-0000-0000-000000000000'),
('commission_rates', '{"handyman": 0.15, "contractor": 0.12, "property_manager": 0.10}', 'Commission rates by user type', false, '00000000-0000-0000-0000-000000000000'),
('taskrabbit_sync', '{"enabled": true, "sync_interval": 3600, "api_version": "v1"}', 'TaskRabbit integration settings', false, '00000000-0000-0000-0000-000000000000'),
('thumbtack_sync', '{"enabled": true, "sync_interval": 3600, "api_version": "v2"}', 'Thumbtack integration settings', false, '00000000-0000-0000-0000-000000000000');