
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Clock, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { JobDetailsHeader } from './job-details/JobDetailsHeader';
import { JobDetailsInfo } from './job-details/JobDetailsInfo';
import { JobDetailsAssignment } from './job-details/JobDetailsAssignment';
import { JobDetailsTimeline } from './job-details/JobDetailsTimeline';
import { JobDetailsActions } from './job-details/JobDetailsActions';

interface JobDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: {
    id: string;
    job_type: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    preferred_schedule?: string;
    created_at: string;
    updated_at: string;
    units?: {
      unit_number: string;
      unit_name?: string;
      property_address: string;
    };
    assigned_to_user_id?: string;
    profiles?: {
      full_name: string;
    };
  };
  onJobUpdated: () => void;
}

const statusIcons = {
  pending: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle
};

export const JobDetailsModal = ({ open, onOpenChange, job, onJobUpdated }: JobDetailsModalProps) => {
  const StatusIcon = statusIcons[job.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StatusIcon className="w-5 h-5" />
            Job Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Header */}
          <div className="space-y-4">
            <JobDetailsHeader job={job} />
            <JobDetailsInfo job={job} />
          </div>

          {/* Assignment Information */}
          <JobDetailsAssignment job={job} />

          {/* Timeline */}
          <JobDetailsTimeline job={job} />

          {/* Actions */}
          <JobDetailsActions 
            job={job} 
            onJobUpdated={onJobUpdated} 
            onClose={() => onOpenChange(false)} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
