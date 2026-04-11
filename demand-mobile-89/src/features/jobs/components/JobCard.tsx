import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/shared/components/ui';
import { formatCurrency, formatDate, capitalize } from '@/shared/utils';
import { JOB_STATUSES, JOB_PRIORITIES } from '@/shared/constants';
import { Calendar, MapPin, DollarSign, User } from 'lucide-react';
import type { JobData } from '../types';

interface JobCardProps {
  job: JobData;
  onViewDetails?: (jobId: string) => void;
  onAccept?: (jobId: string) => void;
  onDecline?: (jobId: string) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const JobCard = ({ 
  job, 
  onViewDetails, 
  onAccept, 
  onDecline, 
  showActions = false,
  compact = false 
}: JobCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case JOB_STATUSES.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case JOB_STATUSES.ASSIGNED:
        return 'bg-blue-100 text-blue-800';
      case JOB_STATUSES.IN_PROGRESS:
      case JOB_STATUSES.ONGOING:
        return 'bg-orange-100 text-orange-800';
      case JOB_STATUSES.COMPLETED:
        return 'bg-green-100 text-green-800';
      case JOB_STATUSES.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case JOB_PRIORITIES.HIGH:
        return 'bg-red-100 text-red-800';
      case JOB_PRIORITIES.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case JOB_PRIORITIES.LOW:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`transition-shadow ${compact ? 'p-3' : ''}`}>
      <CardHeader className={compact ? 'pb-2' : ''}>
        <div className="flex justify-between items-start">
          <CardTitle className={`${compact ? 'text-lg' : 'text-xl'} line-clamp-2`}>
            {job.title}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={getStatusColor(job.status)}>
              {capitalize(job.status.replace('_', ' '))}
            </Badge>
            <Badge className={getPriorityColor(job.priority)}>
              {capitalize(job.priority)}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className={compact ? 'pt-0' : ''}>
        <p className={`text-gray-600 mb-4 ${compact ? 'text-sm' : ''} line-clamp-3`}>
          {job.description}
        </p>

        <div className={`grid grid-cols-2 gap-4 ${compact ? 'text-sm' : ''}`}>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="font-semibold">{formatCurrency(job.budget)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(job.created_at)}</span>
          </div>

          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="truncate">{job.location}</span>
          </div>

          {job.job_type && (
            <div className="flex items-center gap-2 col-span-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {capitalize(job.job_type.replace('_', ' '))}
              </span>
            </div>
          )}
        </div>

        {showActions && (
          <div className="flex gap-2 mt-4">
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewDetails(job.id)}
                className="flex-1"
              >
                View Details
              </Button>
            )}
            {onAccept && job.status === JOB_STATUSES.PENDING && (
              <Button 
                size="sm" 
                onClick={() => onAccept(job.id)}
                className="flex-1"
              >
                Accept
              </Button>
            )}
            {onDecline && job.status === JOB_STATUSES.PENDING && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onDecline(job.id)}
                className="flex-1"
              >
                Decline
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};