
import { PostJobButton } from '../PostJobButton';

interface JobsHeaderProps {
  totalJobs?: number; // Add totalJobs as optional prop
  onJobPosted?: () => void;
}

export const JobsHeader = ({ totalJobs, onJobPosted }: JobsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Job Management</h1>
        <p className="text-gray-600 mt-1">
          Manage and track all property maintenance requests
          {totalJobs !== undefined && ` (${totalJobs} total)`}
        </p>
      </div>
      <PostJobButton onJobPosted={onJobPosted} />
    </div>
  );
};
