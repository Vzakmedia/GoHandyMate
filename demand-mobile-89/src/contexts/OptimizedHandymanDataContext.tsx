import { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { useOptimizedHandymanData } from '@/hooks/useOptimizedHandymanData';
import { useOptimizedJobData } from '@/hooks/useOptimizedJobData';
import type { HandymanDataContextType, JobMetrics } from './types/handymanDataTypes';

const OptimizedHandymanDataContext = createContext<HandymanDataContextType | undefined>(undefined);

interface OptimizedHandymanDataProviderProps {
  children: ReactNode;
}

export const OptimizedHandymanDataProvider = ({ children }: OptimizedHandymanDataProviderProps) => {
  const { 
    data: handymanData, 
    loading: handymanLoading, 
    error: handymanError,
    refreshData: refreshHandymanData 
  } = useOptimizedHandymanData();

  const { 
    jobs,
    completedJobs, 
    activeJobs, 
    totalEarnings, 
    thisMonthJobs,
    thisMonthCompletedJobs,
    todayCompletedJobs,
    todayEarnings,
    weeklyEarnings,
    monthlyEarnings,
    loading: jobsLoading 
  } = useOptimizedJobData();

  // Memoize job metrics to prevent unnecessary recalculations
  const jobMetrics: JobMetrics = useMemo(() => ({
    jobs: jobs || [],
    completedJobs: Array.isArray(completedJobs) ? completedJobs.length : (completedJobs || 0),
    activeJobs: Array.isArray(activeJobs) ? activeJobs.length : (activeJobs || 0),
    totalEarnings: totalEarnings || 0,
    thisMonthJobs: thisMonthJobs || 0,
    thisMonthCompletedJobs: thisMonthCompletedJobs || 0,
    todayCompletedJobs: todayCompletedJobs || 0,
    todayEarnings: todayEarnings || 0,
    weeklyEarnings: weeklyEarnings || 0,
    monthlyEarnings: monthlyEarnings || 0,
    loading: jobsLoading
  }), [jobs, completedJobs, activeJobs, totalEarnings, thisMonthJobs, thisMonthCompletedJobs, todayCompletedJobs, todayEarnings, weeklyEarnings, monthlyEarnings, jobsLoading]);

  const refreshData = useCallback(async () => {
    await refreshHandymanData();
  }, [refreshHandymanData]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: HandymanDataContextType = useMemo(() => ({
    handymanData,
    jobMetrics,
    loading: handymanLoading || jobsLoading,
    error: handymanError,
    refreshData
  }), [handymanData, jobMetrics, handymanLoading, jobsLoading, handymanError, refreshData]);

  return (
    <OptimizedHandymanDataContext.Provider value={contextValue}>
      {children}
    </OptimizedHandymanDataContext.Provider>
  );
};

export const useOptimizedHandymanDataContext = () => {
  const context = useContext(OptimizedHandymanDataContext);
  if (context === undefined) {
    throw new Error('useOptimizedHandymanDataContext must be used within an OptimizedHandymanDataProvider');
  }
  return context;
};
