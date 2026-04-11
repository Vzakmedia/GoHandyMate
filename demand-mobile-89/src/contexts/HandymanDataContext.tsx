
import { createContext, useContext, ReactNode } from 'react';
import { useHandymanData } from '@/hooks/useHandymanData';
import { useJobData } from '@/hooks/useJobData';
import type { HandymanDataContextType, JobMetrics } from './types/handymanDataTypes';

const HandymanDataContext = createContext<HandymanDataContextType | undefined>(undefined);

interface HandymanDataProviderProps {
  children: ReactNode;
}

export const HandymanDataProvider = ({ children }: HandymanDataProviderProps) => {
  const { 
    data: handymanData, 
    loading: handymanLoading, 
    error: handymanError,
    refreshData: refreshHandymanData 
  } = useHandymanData();

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
  } = useJobData();

  const jobMetrics: JobMetrics = {
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
  };

  const refreshData = async () => {
    await refreshHandymanData();
  };

  const contextValue: HandymanDataContextType = {
    handymanData,
    jobMetrics,
    loading: handymanLoading || jobsLoading,
    error: handymanError,
    refreshData
  };

  return (
    <HandymanDataContext.Provider value={contextValue}>
      {children}
    </HandymanDataContext.Provider>
  );
};

export const useHandymanDataContext = () => {
  const context = useContext(HandymanDataContext);
  if (context === undefined) {
    throw new Error('useHandymanDataContext must be used within a HandymanDataProvider');
  }
  return context;
};
