
import type { HandymanData } from '@/hooks/handyman-data/types';
import type { JobData } from '@/hooks/job-data/types';

export interface JobMetrics {
  jobs: JobData[];
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
}

export interface HandymanDataContextType {
  handymanData: HandymanData;
  jobMetrics: JobMetrics;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}
