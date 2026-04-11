
export interface CronLog {
  id: string;
  job_name: string;
  status: string;
  execution_time: string;
  details: any;
}

export interface SystemJob {
  name: string;
  description: string;
  lastRun?: string;
  nextRun?: string;
  status: 'active' | 'paused' | 'error';
  frequency: string;
  functionName?: string;
}
