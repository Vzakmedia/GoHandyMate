
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface JobDetailsHeaderProps {
  job: {
    title: string;
    job_type: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
  };
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700'
};

const statusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle
};

const priorityColors = {
  low: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-orange-600',
  urgent: 'text-red-600'
};

export const JobDetailsHeader = ({ job }: JobDetailsHeaderProps) => {
  const StatusIcon = statusIcons[job.status];

  const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold">{job.title}</h2>
        <p className="text-gray-600">{job.job_type}</p>
      </div>
      <div className="flex gap-2">
        <Badge className={statusColors[job.status]} variant="outline">
          <StatusIcon className="w-3 h-3 mr-1" />
          {job.status.replace('_', ' ')}
        </Badge>
        <Badge variant="outline" className={priorityColors[job.priority]}>
          {formatPriority(job.priority)} Priority
        </Badge>
      </div>
    </div>
  );
};
