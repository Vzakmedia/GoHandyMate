
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Phone, MessageSquare } from 'lucide-react';

interface JobDetailsAssignmentProps {
  job: {
    profiles?: {
      full_name: string;
    };
  };
}

export const JobDetailsAssignment = ({ job }: JobDetailsAssignmentProps) => {
  if (!job.profiles?.full_name) {
    return null;
  }

  return (
    <>
      <Separator />
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <User className="w-4 h-4 text-green-600" />
          Assigned Technician
        </h3>
        <div className="space-y-2">
          <p className="font-medium">{job.profiles.full_name}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
