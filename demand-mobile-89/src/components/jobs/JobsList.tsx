
import { Job, JobStatus } from "@/types/job";
import { JobCard } from "./JobCard";

interface JobsListProps {
  jobs: Job[];
  status?: JobStatus;
  onJobStatusUpdate?: (jobId: string, newStatus: string) => void;
}

export const JobsList = ({ jobs, status, onJobStatusUpdate }: JobsListProps) => {
  const filteredJobs = status ? jobs.filter(job => job.status === status) : jobs;

  return (
    <div className="space-y-4 mt-4 sm:mt-6">
      {filteredJobs.map((job) => (
        <JobCard key={job.id} job={job} onJobStatusUpdate={onJobStatusUpdate} />
      ))}
    </div>
  );
};
