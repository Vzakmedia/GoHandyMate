
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  MapPin, 
  User, 
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';

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

interface JobCardProps {
  job: JobRequest;
  onJobDetails: (job: JobRequest) => void;
  updateJobStatus: (jobId: string, newStatus: string) => void;
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
  low: 'border-l-green-400',
  medium: 'border-l-yellow-400',
  high: 'border-l-orange-400',
  urgent: 'border-l-red-400'
};

export const JobCard = ({ job, onJobDetails, updateJobStatus }: JobCardProps) => {
  const StatusIcon = statusIcons[job.status];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className={`hover:shadow-md transition-shadow border-l-4 ${priorityColors[job.priority]}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <Badge className={statusColors[job.status]} variant="outline">
                <StatusIcon className="w-3 h-3 mr-1" />
                {job.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{job.job_type}</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>
              Unit {job.units?.unit_number}
              {job.units?.unit_name && ` - ${job.units.unit_name}`}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {job.units?.property_address}
          </div>
        </div>

        <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Created {formatDate(job.created_at)}</span>
          </div>
          {job.preferred_schedule && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Scheduled {formatDate(job.preferred_schedule)}</span>
            </div>
          )}
        </div>

        {job.profiles?.full_name && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-green-600" />
            <span>Assigned to {job.profiles.full_name}</span>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onJobDetails(job)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Details
          </Button>
          {job.status === 'pending' && (
            <Button 
              size="sm" 
              onClick={() => updateJobStatus(job.id, 'in_progress')}
            >
              Start Job
            </Button>
          )}
          {job.status === 'in_progress' && (
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => updateJobStatus(job.id, 'completed')}
            >
              Complete
            </Button>
          )}
          <Button size="sm" variant="outline">
            <MessageSquare className="w-4 h-4 mr-1" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
