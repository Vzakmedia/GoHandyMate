
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  avatar_url?: string;
  user_role: 'customer' | 'handyman' | 'admin';
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
  created_at: string;
  updated_at: string;
}

export const useSecureAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!profileData) {
        setProfile(null);
        return null;
      }
      
      // Coerce any unexpected roles to 'customer'
      const rawRole = profileData.user_role as string;
      const resolvedRole: 'customer' | 'handyman' | 'admin' =
        rawRole === 'handyman' ? 'handyman' :
        rawRole === 'admin' ? 'admin' :
        'customer';
      const typedProfile: Profile = {
        ...profileData,
        user_role: resolvedRole,
        account_status: profileData.account_status as 'pending' | 'active' | 'rejected' | 'suspended'
      };
      
      setProfile(typedProfile);
      return typedProfile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, userRole: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_role: userRole
          }
        }
      });

      if (error) throw error;

      return { success: true, error: null, needsConfirmation: !data.session };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message, needsConfirmation: false };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    profile,
    loading,
    isRateLimited,
    signIn,
    signUp,
    signOut,
    refreshProfile: () => user ? fetchProfile(user.id) : null
  };
};
