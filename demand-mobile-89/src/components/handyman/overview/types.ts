
export interface LiveMetrics {
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

export interface PerformanceMetrics {
  jobCompletion: number;
  customerSatisfaction: number;
  responseTime: number;
  skillUtilization: number;
}

export interface JobMetrics {
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
}
