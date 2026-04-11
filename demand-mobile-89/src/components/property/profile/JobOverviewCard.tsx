
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase } from 'lucide-react';

interface JobStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

interface JobOverviewCardProps {
  jobStats: JobStats;
}

export const JobOverviewCard = ({ jobStats }: JobOverviewCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-600" />
          Job Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-yellow-600">{jobStats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-orange-600">{jobStats.in_progress}</div>
            <div className="text-xs text-gray-600">In Progress</div>
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">{jobStats.completed}</div>
          <div className="text-xs text-gray-600">Completed</div>
        </div>
        <Button className="w-full" variant="outline">
          Go to Job Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};
