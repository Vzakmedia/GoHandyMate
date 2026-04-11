
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface JobCounts {
  all: number;
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
}

interface JobFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  jobCounts: JobCounts;
}

export const JobFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  jobCounts 
}: JobFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All', count: jobCounts.all },
          { key: 'pending', label: 'Pending', count: jobCounts.pending },
          { key: 'in_progress', label: 'In Progress', count: jobCounts.in_progress },
          { key: 'completed', label: 'Completed', count: jobCounts.completed },
          { key: 'cancelled', label: 'Cancelled', count: jobCounts.cancelled }
        ].map((filter) => (
          <Button
            key={filter.key}
            variant={statusFilter === filter.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter(filter.key)}
            className="text-xs"
          >
            {filter.label} ({filter.count})
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by job type, unit, or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};
