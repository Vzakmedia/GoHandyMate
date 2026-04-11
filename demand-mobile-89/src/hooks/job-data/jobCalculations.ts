
import { JobData } from './types';

export const calculateJobMetrics = (jobs: JobData[]) => {
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const activeJobs = jobs.filter(job => job.status === 'in_progress' || job.status === 'ongoing' || job.status === 'assigned');
  const pendingJobs = jobs.filter(job => job.status === 'pending');

  // Calculate total earnings from completed jobs
  const totalEarnings = completedJobs.reduce((sum, job) => sum + (job.budget || 0), 0);

  // Calculate this month's jobs and completed jobs
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthJobs = jobs.filter(job => {
    const jobDate = new Date(job.created_at);
    return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear;
  }).length;

  const thisMonthCompletedJobs = completedJobs.filter(job => {
    const completionDate = new Date(job.updated_at || job.created_at);
    return completionDate.getMonth() === currentMonth && completionDate.getFullYear() === currentYear;
  }).length;

  // Calculate today's completed jobs and earnings based on completion date
  const today = new Date();
  const todayCompletedJobs = completedJobs.filter(job => {
    const completionDate = new Date(job.updated_at || job.created_at);
    return completionDate.toDateString() === today.toDateString();
  }).length;

  // Calculate today's earnings from jobs completed today
  const todayEarnings = completedJobs
    .filter(job => {
      const completionDate = new Date(job.updated_at || job.created_at);
      return completionDate.toDateString() === today.toDateString();
    })
    .reduce((sum, job) => sum + (job.budget || 0), 0);

  // Calculate monthly earnings from jobs completed this month
  const thisMonthEarnings = completedJobs
    .filter(job => {
      const completionDate = new Date(job.updated_at || job.created_at);
      return completionDate.getMonth() === currentMonth && completionDate.getFullYear() === currentYear;
    })
    .reduce((sum, job) => sum + (job.budget || 0), 0);

  const weeklyEarnings = Math.round(thisMonthEarnings / 4); // Estimate weekly from monthly
  const monthlyEarnings = thisMonthEarnings;

  console.log('jobCalculations: Comprehensive job calculations:', {
    totalJobs: jobs.length,
    completedJobs: completedJobs.length,
    activeJobs: activeJobs.length,
    pendingJobs: pendingJobs.length,
    thisMonthJobs,
    thisMonthCompletedJobs,
    todayCompletedJobs,
    todayEarnings,
    totalEarnings,
    thisMonthEarnings,
    weeklyEarnings,
    monthlyEarnings,
    completedJobsDetails: completedJobs.map(job => ({
      id: job.id,
      status: job.status,
      budget: job.budget,
      updated_at: job.updated_at,
      created_at: job.created_at
    }))
  });

  return {
    completedJobs,
    activeJobs,
    pendingJobs,
    totalEarnings,
    thisMonthJobs,
    thisMonthCompletedJobs,
    todayCompletedJobs,
    todayEarnings,
    weeklyEarnings,
    monthlyEarnings
  };
};
