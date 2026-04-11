
import { useMemo } from 'react';
import type { HandymanData } from '@/hooks/handyman-data/types';

interface MetricsInput {
  handymanData: HandymanData;
  jobMetrics: {
    completedJobs: number;
    activeJobs: number;
    totalEarnings: number;
    thisMonthCompletedJobs: number;
    todayCompletedJobs: number;
    todayEarnings: number;
    monthlyEarnings: number;
  };
}

interface LiveMetrics {
  todayEarnings: number;
  monthlyEarnings: number;
  activeSkills: number;
  activeJobs: number;
  completedJobs: number;
  thisMonthCompleted: number;
  totalEarnings: number;
  averageRating?: number;
  totalRatings?: number;
}

export const useMetricsCalculator = ({ handymanData, jobMetrics }: MetricsInput): LiveMetrics => {
  return useMemo(() => {
    const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
    const activeServices = handymanData.servicePricing?.filter(service => service.is_active) || [];
    
    return {
      todayEarnings: jobMetrics.todayEarnings,
      monthlyEarnings: jobMetrics.monthlyEarnings,
      activeSkills: Math.max(activeSkills.length, activeServices.length), // Use the higher count
      activeJobs: jobMetrics.activeJobs,
      completedJobs: jobMetrics.completedJobs,
      thisMonthCompleted: jobMetrics.thisMonthCompletedJobs,
      totalEarnings: jobMetrics.totalEarnings,
      averageRating: (handymanData as any).averageRating || 0,
      totalRatings: (handymanData as any).totalRatings || 0
    };
  }, [handymanData, jobMetrics]);
};
