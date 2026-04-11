
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';

export const useSubscription = () => {
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const checkSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionData(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const startFreeTrial = async (planId: string, userRole: 'handyman' | 'contractor') => {
    try {
      const { data, error } = await supabase.functions.invoke('start-trial', {
        body: { planId, userRole }
      });
      if (error) throw error;
      
      // Refresh subscription data after starting trial
      await checkSubscription();
      return { success: true, data };
    } catch (error: any) {
      console.error('Error starting trial:', error);
      return { success: false, error: error.message };
    }
  };

  const canAcceptJob = () => {
    if (!profile || (profile.subscription_status !== 'active' && profile.subscription_status !== 'trial')) {
      return false;
    }

    const limits = {
      handyman: { starter: 15, pro: 40, elite: -1 },
      contractor: { basic: 25, business: 60, enterprise: -1 }
    };

    const userRole = profile.user_role as keyof typeof limits;
    const plan = profile.subscription_plan;
    
    if (!userRole || !plan || !limits[userRole]) {
      return false;
    }

    const limit = limits[userRole][plan as keyof typeof limits.handyman];
    const used = profile.jobs_this_month || 0;

    return limit === -1 || used < limit;
  };

  const getJobLimit = () => {
    if (!profile?.user_role || !profile?.subscription_plan) return 0;
    
    const limits = {
      handyman: { starter: 15, pro: 40, elite: -1 },
      contractor: { basic: 25, business: 60, enterprise: -1 }
    };
    
    return limits[profile.user_role as keyof typeof limits]?.[profile.subscription_plan as keyof typeof limits.handyman] || 0;
  };

  const getPlanFeatures = () => {
    if (!profile?.subscription_plan || !profile?.user_role) return [];
    
    const features = {
      handyman: {
        starter: ['15 jobs per month', 'Basic profile visibility', 'Standard support'],
        pro: ['40 jobs per month', 'Enhanced profile visibility', 'Priority support', 'Advanced analytics'],
        elite: ['Unlimited jobs', 'Premium profile placement', '24/7 dedicated support', 'Custom branding']
      },
      contractor: {
        basic: ['25 leads per month', 'Project management tools', 'Standard support'],
        business: ['60 leads per month', 'Advanced project tools', 'Priority support', 'Team management'],
        enterprise: ['Unlimited leads', 'Full business suite', '24/7 dedicated support', 'White-label options']
      }
    };

    return features[profile.user_role as keyof typeof features]?.[profile.subscription_plan as keyof typeof features.handyman] || [];
  };

  useEffect(() => {
    checkSubscription();
  }, [user]);

  const isOnTrial = () => {
    return profile?.subscription_status === 'trial';
  };

  const getTrialDaysLeft = () => {
    if (!profile?.subscription_end_date || !isOnTrial()) return 0;
    const endDate = new Date(profile.subscription_end_date);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const canStartTrial = () => {
    return !profile?.is_trial_used && 
           (profile?.user_role === 'handyman' || profile?.user_role === 'contractor') &&
           profile?.subscription_status !== 'active' &&
           profile?.subscription_status !== 'trial';
  };

  return {
    subscriptionData,
    loading,
    canAcceptJob,
    checkSubscription,
    startFreeTrial,
    isSubscribed: subscriptionData?.subscribed || false,
    subscriptionPlan: profile?.subscription_plan,
    jobsThisMonth: profile?.jobs_this_month || 0,
    jobLimit: getJobLimit(),
    planFeatures: getPlanFeatures(),
    isOnTrial,
    getTrialDaysLeft,
    canStartTrial,
    subscriptionStatus: profile?.subscription_status || 'inactive'
  };
};
