
import { Separator } from '@/components/ui/separator';

interface JobDetailsTimelineProps {
  job: {
    created_at: string;
    updated_at: string;
    preferred_schedule?: string;
  };
}

export const JobDetailsTimeline = ({ job }: JobDetailsTimelineProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Separator />
      <div>
        <h3 className="font-medium mb-3">Timeline</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">Job Created</p>
              <p className="text-xs text-gray-600">{formatDate(job.created_at)}</p>
            </div>
          </div>
          
          {job.preferred_schedule && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Preferred Schedule</p>
                <p className="text-xs text-gray-600">{formatDate(job.preferred_schedule)}</p>
              </div>
            </div>
          )}

          {job.updated_at !== job.created_at && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-xs text-gray-600">{formatDate(job.updated_at)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
