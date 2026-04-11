
import { useState } from 'react';
import { JobsHeader } from './JobsHeader';
import { JobFilters } from './JobFilters';
import { JobsList } from './JobsList';
import { EmptyJobsState } from './EmptyJobsState';
import { PostJobModal } from '../PostJobModal';
import { JobDetailsModal } from '../JobDetailsModal';
import { useJobsData } from './useJobsData';
import { JobRequest } from './types';

export const JobsContainer = () => {
  const { jobs, units, loading, fetchJobs, updateJobStatus, getJobCounts } = useJobsData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);
  const [showJobDetailsModal, setShowJobDetailsModal] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.job_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.units?.unit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.units?.property_address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const jobCounts = getJobCounts();

  const handleJobDetails = (job: JobRequest) => {
    setSelectedJob(job);
    setShowJobDetailsModal(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading jobs...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header Section */}
      <JobsHeader 
        totalJobs={jobs.length}
        onJobPosted={() => setShowPostJobModal(true)}
      />

      {/* Filters and Search */}
      <JobFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        jobCounts={jobCounts}
      />

      {/* Jobs List */}
      {filteredJobs.length > 0 ? (
        <JobsList
          jobs={filteredJobs}
          onJobDetails={handleJobDetails}
          updateJobStatus={updateJobStatus}
        />
      ) : (
        <EmptyJobsState
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onPostJob={() => setShowPostJobModal(true)}
        />
      )}

      {/* Modals */}
      <PostJobModal
        open={showPostJobModal}
        onOpenChange={setShowPostJobModal}
        units={units}
        onJobPosted={() => {
          fetchJobs();
          setShowPostJobModal(false);
        }}
      />

      {selectedJob && (
        <JobDetailsModal
          open={showJobDetailsModal}
          onOpenChange={setShowJobDetailsModal}
          job={selectedJob}
          onJobUpdated={fetchJobs}
        />
      )}
    </div>
  );
};
