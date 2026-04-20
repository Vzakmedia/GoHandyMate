
import { MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface JobDetailsInfoProps {
  job: {
    description: string;
    units?: {
      unit_number: string;
      unit_name?: string;
      property_address: string;
    };
  };
}

export const JobDetailsInfo = ({ job }: JobDetailsInfoProps) => {
  return (
    <>
      {/* Unit Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Property Unit
        </h3>
        <div className="space-y-1">
          <p className="font-medium">
            Unit {job.units?.unit_number}
            {job.units?.unit_name && ` - ${job.units.unit_name}`}
          </p>
          <p className="text-sm text-gray-600">{job.units?.property_address}</p>
        </div>
      </div>

      <Separator />

      {/* Job Description */}
      <div>
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
      </div>
    </>
  );
};
