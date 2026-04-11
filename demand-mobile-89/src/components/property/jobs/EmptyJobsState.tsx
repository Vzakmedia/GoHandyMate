
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';

interface EmptyJobsStateProps {
  searchTerm: string;
  statusFilter: string;
  onPostJob: () => void;
}

export const EmptyJobsState = ({ searchTerm, statusFilter, onPostJob }: EmptyJobsStateProps) => {
  const hasFilters = searchTerm || statusFilter !== 'all';
  
  return (
    <Card className="p-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasFilters 
              ? 'No jobs match your filters' 
              : "You haven't posted any jobs yet"
            }
          </h3>
          <p className="text-gray-600 mb-4">
            {hasFilters
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first maintenance request'
            }
          </p>
          {!hasFilters && (
            <Button 
              onClick={onPostJob}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Job
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
