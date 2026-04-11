
import { useMemo } from 'react';

interface HandymanData {
  skillRates?: Array<{
    is_active: boolean;
  }>;
  servicePricing?: Array<{
    is_active: boolean;
  }>;
}

interface JobMetrics {
  completedJobs: number;
  monthlyEarnings: number;
  activeJobs: number;
  thisMonthCompletedJobs: number;
  totalEarnings: number;
  todayEarnings: number;
}

interface OverviewMetricsInput {
  handymanData: HandymanData;
  jobMetrics: JobMetrics;
}

export interface LiveMetrics {
  todayEarnings: number;
  monthlyEarnings: number;
  activeSkills: number;
  activeJobs: number;
  completedJobs: number;
  thisMonthCompleted: number;
  totalEarnings: number;
}

export const useOverviewMetrics = ({ 
  handymanData, 
  jobMetrics 
}: OverviewMetricsInput): LiveMetrics => {
  return useMemo(() => {
    // Calculate active skills from handyman data
    const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
    const activeServices = handymanData.servicePricing?.filter(service => service.is_active) || [];
    const totalActiveServices = Math.max(activeSkills.length, activeServices.length);

    return {
      todayEarnings: jobMetrics.todayEarnings || 0,
      monthlyEarnings: jobMetrics.monthlyEarnings || 0,
      activeSkills: totalActiveServices,
      activeJobs: jobMetrics.activeJobs || 0,
      completedJobs: jobMetrics.completedJobs || 0,
      thisMonthCompleted: jobMetrics.thisMonthCompletedJobs || 0,
      totalEarnings: jobMetrics.totalEarnings || 0
    };
  }, [handymanData, jobMetrics]);
};
