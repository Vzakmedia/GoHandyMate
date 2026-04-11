// Job-related TypeScript interfaces and types

export interface JobData {
  id: string;
  title: string;
  description: string;
  status: string; // Keep as string for backward compatibility
  budget: number;
  created_at: string;
  updated_at?: string;
  preferred_schedule: string;
  customer_id: string;
  assigned_to_user_id: string;
  job_type: string;
  priority: string; // Keep as string for backward compatibility
  location: string;
  units?: any;
}

export type JobStatus = 
  | 'pending' 
  | 'assigned' 
  | 'in_progress' 
  | 'ongoing'
  | 'completed' 
  | 'cancelled';

export interface JobFilters {
  status?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: string;
  jobType?: string[];
  priority?: string[];
}

export interface UseJobDataReturn {
  jobs: JobData[];
  loading: boolean;
  error: string | null;
  refreshJobs: () => Promise<void>;
  completedJobs: JobData[];
  activeJobs: JobData[];
  pendingJobs: JobData[];
  totalEarnings: number;
  thisMonthJobs: number;
  thisMonthCompletedJobs: number;
  todayCompletedJobs: number;
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
}