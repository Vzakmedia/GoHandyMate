import { User, Session } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  avatar_url?: string;
  user_role: 'customer' | 'provider' | 'admin';
  subscription_plan?: string;
  subscription_status?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  jobs_this_month?: number;
  account_status?: 'pending' | 'active' | 'rejected' | 'suspended';
  verified_by_admin_id?: string;
  verified_at?: string;
  rejection_reason?: string;
  business_name?: string;
  company_name?: string;
  // Trial fields
  is_trial_used?: boolean;
  trial_start_date?: string;
  trial_end_date?: string;
  trial_plan?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, userRole: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<Profile | null>;
}

export type AuthUser = User;
export type AuthSession = Session;