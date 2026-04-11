
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Wrench, MapPin, Clock } from "lucide-react";

interface Job {
  id: number;
  title: string;
  location: string;
  price: number;
  status: string;
  timeSlot: string;
}

interface TodayScheduleProps {
  jobs: Job[];
}

export const TodaySchedule = ({ jobs }: TodayScheduleProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>Today's Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Wrench className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">{job.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{job.timeSlot}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-green-600">
                ${job.price}
              </div>
              <Badge className={getStatusColor(job.status)}>
                {job.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
