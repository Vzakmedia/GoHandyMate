
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MessageSquare, Star, Award } from "lucide-react";
import { format } from "date-fns";
import { PreviousTechnician } from './types';

interface TechnicianCardProps {
  technician: PreviousTechnician;
  onViewCalendar: (technician: PreviousTechnician) => void;
}

export const TechnicianCard = ({ technician, onViewCalendar }: TechnicianCardProps) => {
  const formatLastService = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM do, yyyy");
    } catch {
      return 'Recently';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const getProfileImageUrl = (technician: PreviousTechnician) => {
    if (technician.avatar_url) {
      return technician.avatar_url;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(technician.full_name)}`;
  };

  return (
    <Card className="transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
              <img
                src={getProfileImageUrl(technician)}
                alt={technician.full_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(technician.full_name)}`;
                }}
              />
            </div>
            {technician.isRecommended && (
              <div className="absolute -top-1 -right-1 bg-blue-600 rounded-full p-1">
                <Award className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-xl text-gray-900 truncate">
                {technician.full_name}
              </h3>
              {technician.isRecommended && (
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                  Recommended
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-1 mb-3">
              {renderStars(technician.rating)}
              <span className="text-sm text-gray-600 ml-2 font-medium">
                {technician.rating.toFixed(1)} rating
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  Last service: <span className="font-medium text-gray-900">{technician.last_service}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  {formatLastService(technician.last_service_date)} • {technician.total_jobs} completed job{technician.total_jobs !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {technician.skills && technician.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {technician.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {technician.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{technician.skills.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              onClick={() => onViewCalendar(technician)}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
