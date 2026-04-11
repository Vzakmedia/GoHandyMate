import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MonthlyData {
  month: string;
  jobs: number;
  completed: number;
  revenue: number;
  customers: number;
}

interface AnalyticsData {
  totalJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  pendingJobs: number;
  totalProfessionals: number;
  handymen: number;
  contractors: number;
  customers: number;
  propertyManagers: number;
  monthlyData: MonthlyData[];
  averageRating: number;
  totalRevenue: number;
  loading: boolean;
}

export const useRealTimeAnalytics = (): AnalyticsData => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    pendingJobs: 0,
    totalProfessionals: 0,
    handymen: 0,
    contractors: 0,
    customers: 0,
    propertyManagers: 0,
    monthlyData: [],
    averageRating: 0,
    totalRevenue: 0,
    loading: true,
  });

  const fetchAnalytics = async () => {
    try {
      console.log('Fetching real-time analytics data...');

      // Fetch job statistics
      const { data: jobStats } = await supabase
        .from('job_requests')
        .select('status, created_at, budget')
        .order('created_at', { ascending: false });

      // Fetch user statistics
      const { data: userStats } = await supabase
        .from('profiles')
        .select('user_role, created_at')
        .order('created_at', { ascending: false });

      // Fetch ratings
      const { data: ratings } = await supabase
        .from('job_ratings')
        .select('rating');

      // Calculate job statistics
      const totalJobs = jobStats?.length || 0;
      const completedJobs = jobStats?.filter(job => job.status === 'completed').length || 0;
      const inProgressJobs = jobStats?.filter(job => job.status === 'in_progress').length || 0;
      const pendingJobs = jobStats?.filter(job => job.status === 'pending').length || 0;

      // Calculate user statistics
      const totalProfessionals = userStats?.length || 0;
      const handymen = userStats?.filter(user => user.user_role === 'handyman').length || 0;
      const contractors = userStats?.filter(user => user.user_role === 'contractor').length || 0;
      const customers = userStats?.filter(user => user.user_role === 'customer').length || 0;
      const propertyManagers = userStats?.filter(user => user.user_role === 'property_manager').length || 0;

      // Calculate average rating
      const totalRatings = ratings?.length || 0;
      const averageRating = totalRatings > 0 
        ? ratings!.reduce((sum, rating) => sum + rating.rating, 0) / totalRatings 
        : 0;

      // Calculate total revenue (estimated from completed jobs)
      const totalRevenue = jobStats
        ?.filter(job => job.status === 'completed' && job.budget)
        .reduce((sum, job) => sum + (job.budget || 0), 0) || 0;

      // Generate monthly data for the last 6 months
      const monthlyData: MonthlyData[] = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        const monthJobs = jobStats?.filter(job => {
          const jobDate = new Date(job.created_at);
          return jobDate >= monthStart && jobDate <= monthEnd;
        }) || [];

        const monthUsers = userStats?.filter(user => {
          const userDate = new Date(user.created_at);
          return userDate >= monthStart && userDate <= monthEnd;
        }) || [];

        const monthRevenue = monthJobs
          .filter(job => job.status === 'completed' && job.budget)
          .reduce((sum, job) => sum + (job.budget || 0), 0);

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          jobs: monthJobs.length,
          completed: monthJobs.filter(job => job.status === 'completed').length,
          revenue: monthRevenue,
          customers: monthUsers.filter(user => user.user_role === 'customer').length,
        });
      }

      setAnalytics({
        totalJobs,
        completedJobs,
        inProgressJobs,
        pendingJobs,
        totalProfessionals,
        handymen,
        contractors,
        customers,
        propertyManagers,
        monthlyData,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRevenue,
        loading: false,
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      setAnalytics(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscriptions
    const jobChannel = supabase
      .channel('analytics-jobs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_requests' }, fetchAnalytics)
      .subscribe();

    const profileChannel = supabase
      .channel('analytics-profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchAnalytics)
      .subscribe();

    const ratingChannel = supabase
      .channel('analytics-ratings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'job_ratings' }, fetchAnalytics)
      .subscribe();

    return () => {
      supabase.removeChannel(jobChannel);
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(ratingChannel);
    };
  }, []);

  return analytics;
};