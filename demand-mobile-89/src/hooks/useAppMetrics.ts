import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AppMetrics {
  totalProjects: number;
  totalProfessionals: number;
  totalUsers: number;
  averageRating: number;
  totalReviews: number;
  satisfactionRate: number;
  loading: boolean;
}

export const useAppMetrics = (): AppMetrics => {
  const [metrics, setMetrics] = useState<AppMetrics>({
    totalProjects: 0,
    totalProfessionals: 0,
    totalUsers: 0,
    averageRating: 0,
    totalReviews: 0,
    satisfactionRate: 0,
    loading: true
  });

  const fetchMetrics = async () => {
    try {
      console.log('useAppMetrics: Fetching app metrics');

      // Fetch total completed projects
      const { count: totalProjects } = await supabase
        .from('job_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Fetch total active professionals (handymen and contractors only)
      const { count: totalProfessionals } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('user_role', ['handyman', 'contractor'])
        .eq('account_status', 'active')
        .in('subscription_status', ['active', 'trialing']);

      // Fetch total users (all app users)
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch ratings data
      const { data: ratings, error: ratingsError } = await supabase
        .from('job_ratings')
        .select('rating');

      if (ratingsError) {
        console.error('useAppMetrics: Error fetching ratings:', ratingsError);
      }

      // Calculate average rating and satisfaction rate
      const totalReviews = ratings?.length || 0;
      const averageRating = totalReviews > 0 
        ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / totalReviews 
        : 0;

      // Calculate satisfaction rate (4+ star ratings)
      const positiveRatings = ratings?.filter(rating => rating.rating >= 4).length || 0;
      const satisfactionRate = totalReviews > 0 ? (positiveRatings / totalReviews) * 100 : 0;

      console.log('useAppMetrics: Metrics calculated:', {
        totalProjects: totalProjects || 0,
        totalProfessionals: totalProfessionals || 0,
        totalUsers: totalUsers || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        satisfactionRate: Math.round(satisfactionRate)
      });

      setMetrics({
        totalProjects: totalProjects || 0,
        totalProfessionals: totalProfessionals || 0,
        totalUsers: totalUsers || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        satisfactionRate: Math.round(satisfactionRate),
        loading: false
      });

    } catch (error) {
      console.error('useAppMetrics: Error fetching metrics:', error);
      setMetrics(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Set up real-time subscriptions for key tables
    const jobsChannel = supabase
      .channel('jobs-metrics-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_requests' },
        () => {
          console.log('useAppMetrics: Job update received, refreshing metrics');
          fetchMetrics();
        }
      )
      .subscribe();

    const ratingsChannel = supabase
      .channel('ratings-metrics-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'job_ratings' },
        () => {
          console.log('useAppMetrics: Rating update received, refreshing metrics');
          fetchMetrics();
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('profiles-metrics-updates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: 'user_role=in.(handyman,contractor)'
        },
        () => {
          console.log('useAppMetrics: Profile update received, refreshing metrics');
          fetchMetrics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(ratingsChannel);
      supabase.removeChannel(profilesChannel);
    };
  }, []);

  return metrics;
};