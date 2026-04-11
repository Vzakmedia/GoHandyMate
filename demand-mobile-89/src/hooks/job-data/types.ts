
export interface JobData {
  id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  created_at: string;
  updated_at?: string;
  preferred_schedule: string;
  customer_id: string;
  assigned_to_user_id: string;
  job_type: string;
  priority: string;
  location: string;
  units?: {
    unit_number: string;
    property_address: string;
    tenant_name: string;
    tenant_phone: string;
  };
}

export interface UseJobDataReturn {
  jobs: JobData[];
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
  loading: boolean;
  error: string | null;
  refreshJobs: () => Promise<void>;
}
