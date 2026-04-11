// Example of how to use the new organized structure
import { JobsList, useJobData } from '@/features/jobs';
import { useAuth } from '@/features/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { formatCurrency } from '@/shared/utils';
import { JOB_STATUSES } from '@/shared/constants';

export const ModernJobsPage = () => {
  const { user, profile } = useAuth();
  const { jobs, loading, completedJobs, totalEarnings } = useJobData();

  const handleJobAction = (action: string, jobId: string) => {
    console.log(`Action: ${action} on job: ${jobId}`);
    // Handle job actions here
  };

  if (!user) {
    return <div>Please log in to view jobs</div>;
  }

  const activeJobs = jobs.filter(job => 
    job.status === JOB_STATUSES.ASSIGNED || 
    job.status === JOB_STATUSES.IN_PROGRESS
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{jobs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{activeJobs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(totalEarnings)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <JobsList
        jobs={jobs}
        loading={loading}
        onJobAction={handleJobAction}
        showActions={profile?.user_role === 'handyman'}
        title={`Jobs for ${profile?.user_role || 'User'}`}
      />
    </div>
  );
};

// Usage example in a route:
/*
import { ModernJobsPage } from '@/examples/ModernJobsPage';

// In your router:
<Route path="/jobs" element={<ModernJobsPage />} />
*/