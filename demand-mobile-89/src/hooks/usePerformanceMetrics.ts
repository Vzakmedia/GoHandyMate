
import { useMemo } from 'react';

interface PerformanceInput {
  activeSkills: number;
  workAreas: number;
  completedJobs: number;
  totalEarnings: number;
}

interface PerformanceMetrics {
  jobCompletion: number;
  customerSatisfaction: number;
  responseTime: number;
  skillUtilization: number;
}

export const usePerformanceMetrics = ({ 
  activeSkills, 
  workAreas, 
  completedJobs, 
  totalEarnings 
}: PerformanceInput): PerformanceMetrics => {
  return useMemo(() => {
    // Calculate performance metrics based on available data
    const jobCompletion = Math.min(95, Math.max(0, (completedJobs * 10) + 40));
    const customerSatisfaction = Math.min(98, Math.max(0, (completedJobs * 5) + 70));
    const responseTime = Math.min(95, Math.max(0, (activeSkills * 8) + 50));
    const skillUtilization = Math.min(90, Math.max(0, (activeSkills * 15) + 30));

    return {
      jobCompletion,
      customerSatisfaction,
      responseTime,
      skillUtilization
    };
  }, [activeSkills, workAreas, completedJobs, totalEarnings]);
};
