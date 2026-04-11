
import { useMemo } from 'react';
import type { HandymanData } from '@/hooks/handyman-data/types';
import type { LiveMetrics } from '@/components/handyman/overview/types';
import { calculateLiveMetrics } from '@/utils/metricsCalculations';
import { useAuth } from '@/features/auth';

interface MetricsInput {
  handymanData: HandymanData;
  jobMetrics: {
    jobs: any[];
    completedJobs: number;
    activeJobs: number;
    totalEarnings: number;
    thisMonthJobs: number;
    thisMonthCompletedJobs: number;
    todayCompletedJobs: number;
    todayEarnings: number;
    weeklyEarnings: number;
    monthlyEarnings: number;
    loading: boolean;
  };
}

export const useOptimizedOverviewMetrics = ({ handymanData, jobMetrics }: MetricsInput): LiveMetrics => {
  const { user } = useAuth();

  return useMemo(() => {
    const metrics = calculateLiveMetrics(handymanData, jobMetrics, {
      averageRating: 4.5, // Static rating since ratings were removed
      totalRatings: 0 // No ratings since ratings were removed
    });

    console.log('useOptimizedOverviewMetrics: Final calculated metrics:', metrics);
    
    return metrics;
  }, [handymanData, jobMetrics]);
};
