
import { useMemo } from 'react';
import type { PerformanceMetrics } from '@/components/handyman/overview/types';
import { calculatePerformanceMetrics } from '@/utils/performanceCalculations';

interface PerformanceInput {
  activeSkills: number;
  workAreas: number;
  completedJobs: number;
  totalEarnings: number;
}

export const useOptimizedOverviewPerformance = ({ 
  activeSkills, 
  workAreas, 
  completedJobs, 
  totalEarnings 
}: PerformanceInput): PerformanceMetrics => {
  return useMemo(() => {
    return calculatePerformanceMetrics({
      activeSkills,
      workAreas,
      completedJobs,
      totalEarnings
    });
  }, [activeSkills, workAreas, completedJobs, totalEarnings]);
};
