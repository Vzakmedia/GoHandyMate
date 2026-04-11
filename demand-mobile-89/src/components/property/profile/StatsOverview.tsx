
import { Card, CardContent } from '@/components/ui/card';

interface StatsOverviewProps {
  profileStats: {
    totalUnits: number;
    totalJobs: number;
    locations: string[];
  };
  jobStats: {
    total: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export const StatsOverview = ({ profileStats, jobStats }: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{profileStats.totalUnits}</div>
          <div className="text-sm text-gray-600">Total Units</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{jobStats.total}</div>
          <div className="text-sm text-gray-600">Jobs Posted</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{jobStats.pending + jobStats.in_progress}</div>
          <div className="text-sm text-gray-600">Active Jobs</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{profileStats.locations.length}</div>
          <div className="text-sm text-gray-600">Locations</div>
        </CardContent>
      </Card>
    </div>
  );
};
