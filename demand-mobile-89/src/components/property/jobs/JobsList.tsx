
import { JobCard } from './JobCard';

interface JobRequest {
  id: string;
  unit_id: string;
  job_type: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  preferred_schedule: string;
  created_at: string;
  updated_at: string;
  units: {
    unit_number: string;
    unit_name?: string;
    property_address: string;
  };
  assigned_to_user_id?: string;
  profiles?: {
    full_name: string;
  };
}

interface JobsListProps {
  jobs: JobRequest[];
  onJobDetails: (job: JobRequest) => void;
  updateJobStatus: (jobId: string, newStatus: string) => void;
}

export const JobsList = ({ jobs, onJobDetails, updateJobStatus }: JobsListProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onJobDetails={onJobDetails}
          updateJobStatus={updateJobStatus}
        />
      ))}
    </div>
  );
};
