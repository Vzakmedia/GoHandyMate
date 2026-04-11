import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

export interface Advertisement {
  id: number;
  user_id: string;
  ad_title: string;
  ad_description: string;
  content: string;
  image_url?: string;
  plan_type: 'basic' | 'premium' | 'featured';
  start_date: string;
  end_date: string;
  target_zip_codes: string[];
  target_audience: string;
  auto_renew: boolean;
  cost: number;
  status: 'active' | 'paused' | 'expired' | 'payment_pending' | 'rejected';
  views_count: number;
  clicks_count: number;
  likes_count: number;
  shares_count: number;
  comments_count: number;
  bookings_count: number;
  created_at: string;
  updated_at: string;
}

export interface AdAnalytics {
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  click_through_rate: number;
  conversion_rate: number;
  cost_per_click: number;
  cost_per_conversion: number;
  roi_percentage: number;
  daily_performance: Array<{
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
  }>;
}

export interface PlanFeatures {
  basic: {
    max_ads: 1;
    duration_days: 7;
    targeting: ['location'];
    analytics: 'basic';
    auto_optimization: false;
    ab_testing: false;
    priority_placement: false;
    dedicated_support: false;
  };
  premium: {
    max_ads: 3;
    duration_days: 14;
    targeting: ['location', 'audience', 'behavior'];
    analytics: 'advanced';
    auto_optimization: true;
    ab_testing: true;
    priority_placement: true;
    dedicated_support: false;
  };
  featured: {
    max_ads: 10;
    duration_days: 30;
    targeting: ['location', 'audience', 'behavior', 'lookalike', 'retargeting'];
    analytics: 'enterprise';
    auto_optimization: true;
    ab_testing: true;
    priority_placement: true;
    dedicated_support: true;
  };
}

export const useAdvertisements = () => {
  const { user } = useAuth();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AdAnalytics | null>(null);

  // Fetch user's advertisements
  const fetchAdvertisements = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('advertisements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type-safe mapping with proper plan_type handling
      const typedData = (data || []).map(ad => ({
        ...ad,
        plan_type: ad.plan_type as 'basic' | 'premium' | 'featured'
      })) as Advertisement[];
      
      setAdvertisements(typedData);
    } catch (error: any) {
      console.error('Error fetching advertisements:', error);
      toast.error('Failed to load advertisements');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch analytics for all user ads
  const fetchAnalytics = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('get-ad-analytics', {
        body: { user_id: user.id }
      });

      if (error) throw error;
      setAnalytics(data);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    }
  }, [user]);

  // Create advertisement with payment
  const createAdWithPayment = async (adData: any) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('Creating ad with payment:', adData);

      const { data, error } = await supabase.functions.invoke('create-ad-payment', {
        body: adData,
        headers: {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });

      if (error) {
        console.error('Payment creation error:', error);
        throw error;
      }

      if (data.checkout_url) {
        // Open Stripe checkout in a new tab
        window.open(data.checkout_url, '_blank');
        
        toast.success('Redirecting to secure payment...');
        return data;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Error creating ad with payment:', error);
      toast.error(error.message || 'Failed to create advertisement');
      throw error;
    }
  };

  // Pause/Resume advertisement
  const toggleAdStatus = async (adId: number, newStatus: 'active' | 'paused') => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', adId)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchAdvertisements();
      toast.success(`Advertisement ${newStatus === 'active' ? 'resumed' : 'paused'} successfully`);
    } catch (error: any) {
      console.error('Error updating ad status:', error);
      toast.error('Failed to update advertisement status');
    }
  };

  // Delete advertisement
  const deleteAdvertisement = async (adId: number) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .delete()
        .eq('id', adId)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchAdvertisements();
      toast.success('Advertisement deleted successfully');
    } catch (error: any) {
      console.error('Error deleting advertisement:', error);
      toast.error('Failed to delete advertisement');
    }
  };

  // Update advertisement
  const updateAdvertisement = async (adId: number, updates: Partial<Omit<Advertisement, 'id' | 'user_id' | 'created_at'>>) => {
    try {
      const { error } = await supabase
        .from('advertisements')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', adId)
        .eq('user_id', user?.id);

      if (error) throw error;

      await fetchAdvertisements();
      toast.success('Advertisement updated successfully');
    } catch (error: any) {
      console.error('Error updating advertisement:', error);
      toast.error('Failed to update advertisement');
    }
  };

  // Update ad status (alias for compatibility)
  const updateAdStatus = async (adId: string, status: 'active' | 'paused') => {
    await toggleAdStatus(parseInt(adId), status);
  };

  // Fetch active ads for public display
  const fetchActiveAds = async (location?: string) => {
    try {
      let query = supabase
        .from('advertisements')
        .select('*')
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (location) {
        query = query.contains('target_zip_codes', [location]);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []).map(ad => ({
        ...ad,
        plan_type: ad.plan_type as 'basic' | 'premium' | 'featured'
      })) as Advertisement[];
    } catch (error: any) {
      console.error('Error fetching active ads:', error);
      return [];
    }
  };

  // Track ad interaction
  const trackInteraction = async (adId: number, interactionType: string, additionalData?: any) => {
    try {
      await supabase.functions.invoke('track-ad-interaction', {
        body: {
          advertisement_id: adId,
          event_type: interactionType,
          user_id: user?.id,
          ...additionalData
        }
      });
    } catch (error: any) {
      console.error('Error tracking interaction:', error);
    }
  };

  // Get plan features
  const getPlanFeatures = (planType: string) => {
    const features: PlanFeatures = {
      basic: {
        max_ads: 1,
        duration_days: 7,
        targeting: ['location'],
        analytics: 'basic',
        auto_optimization: false,
        ab_testing: false,
        priority_placement: false,
        dedicated_support: false,
      },
      premium: {
        max_ads: 3,
        duration_days: 14,
        targeting: ['location', 'audience', 'behavior'],
        analytics: 'advanced',
        auto_optimization: true,
        ab_testing: true,
        priority_placement: true,
        dedicated_support: false,
      },
      featured: {
        max_ads: 10,
        duration_days: 30,
        targeting: ['location', 'audience', 'behavior', 'lookalike', 'retargeting'],
        analytics: 'enterprise',
        auto_optimization: true,
        ab_testing: true,
        priority_placement: true,
        dedicated_support: true,
      },
    };

    return features[planType as keyof PlanFeatures] || features.basic;
  };

  // Initialize
  useEffect(() => {
    if (user) {
      fetchAdvertisements();
      fetchAnalytics();
    }
  }, [user, fetchAdvertisements, fetchAnalytics]);

  return {
    advertisements,
    analytics,
    loading,
    createAdWithPayment,
    toggleAdStatus,
    updateAdStatus,
    deleteAdvertisement,
    updateAdvertisement,
    trackInteraction,
    getPlanFeatures,
    fetchAdvertisements,
    fetchAnalytics,
    fetchActiveAds,
    refetch: fetchAdvertisements, // Alias for compatibility
  };
};