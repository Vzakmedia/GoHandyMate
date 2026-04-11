import { useState } from 'react';
import { Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui';
import { Search, Filter, SortAsc } from 'lucide-react';
import { JobCard } from './JobCard';
import { JOB_STATUSES, JOB_PRIORITIES } from '@/shared/constants';
import type { JobData, JobFilters } from '../types';

interface JobsListProps {
  jobs: JobData[];
  loading?: boolean;
  onJobAction?: (action: string, jobId: string) => void;
  showActions?: boolean;
  emptyMessage?: string;
  title?: string;
}

export const JobsList = ({ 
  jobs, 
  loading = false, 
  onJobAction,
  showActions = false,
  emptyMessage = "No jobs found",
  title = "Jobs"
}: JobsListProps) => {
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'title'>('date');

  const filteredJobs = jobs
    .filter(job => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        if (!job.title.toLowerCase().includes(searchLower) &&
            !job.description.toLowerCase().includes(searchLower) &&
            !job.location.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(job.status)) {
          return false;
        }
      }

      // Priority filter
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(job.priority)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'budget':
          return b.budget - a.budget;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse bg-gray-200 rounded-lg h-48"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-gray-600">
          {filteredJobs.length} of {jobs.length} jobs
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={filters.status?.[0] || 'all'}
          onValueChange={(value) => 
            setFilters(prev => ({
              ...prev,
              status: value === 'all' ? undefined : [value as any]
            }))
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {Object.values(JOB_STATUSES).map(status => (
              <SelectItem key={status} value={status}>
                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by Date</SelectItem>
            <SelectItem value="budget">Sort by Budget</SelectItem>
            <SelectItem value="title">Sort by Title</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredJobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              showActions={showActions}
              onViewDetails={(jobId) => onJobAction?.('view', jobId)}
              onAccept={(jobId) => onJobAction?.('accept', jobId)}
              onDecline={(jobId) => onJobAction?.('decline', jobId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};