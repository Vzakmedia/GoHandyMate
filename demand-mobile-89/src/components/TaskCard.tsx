
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, DollarSign } from "lucide-react";
import { useResponsiveBreakpoints } from "@/hooks/useResponsiveBreakpoints";

interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    location: string;
    timeAgo: string;
    taskerCount: number;
    urgency: string;
  };
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const { isMobile, isTablet } = useResponsiveBreakpoints();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'today':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'this week':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className={`
      bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md 
      transition-all duration-200 hover:border-gray-300
      ${isMobile ? 'p-4' : isTablet ? 'p-5' : 'p-6'}
    `}>
      <div className={`
        flex ${isMobile ? 'flex-col space-y-3' : 'flex-row justify-between items-start'}
        ${isTablet && !isMobile ? 'space-x-4' : ''}
      `}>
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className={`
            flex ${isMobile ? 'flex-col space-y-2' : 'items-start justify-between'} 
            mb-3
          `}>
            <div className="flex-1 min-w-0">
              <h3 className={`
                font-semibold text-gray-900 mb-2 leading-tight
                ${isMobile ? 'text-base' : isTablet ? 'text-lg' : 'text-xl'}
              `}>
                {task.title}
              </h3>
              <p className={`
                text-gray-600 mb-3 leading-relaxed
                ${isMobile ? 'text-sm line-clamp-2' : isTablet ? 'text-base line-clamp-3' : 'text-base'}
              `}>
                {task.description}
              </p>
            </div>
            
            {/* Price - mobile shows at top */}
            {isMobile && (
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${task.price}</div>
                  <div className="text-xs text-gray-500">{task.timeAgo}</div>
                </div>
                <Badge className={getUrgencyColor(task.urgency)}>
                  {task.urgency}
                </Badge>
              </div>
            )}
          </div>

          {/* Task Details */}
          <div className={`
            grid gap-3 mb-4
            ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-3'}
          `}>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className={`truncate ${isMobile ? 'text-sm' : 'text-base'}`}>
                {task.location}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className={isMobile ? 'text-sm' : 'text-base'}>
                {task.taskerCount} available
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className={isMobile ? 'text-sm' : 'text-base'}>
                {task.timeAgo}
              </span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <Badge variant="outline" className={`
              ${isMobile ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1'}
            `}>
              {task.category}
            </Badge>
          </div>
        </div>

        {/* Price and Actions - tablet and desktop */}
        {!isMobile && (
          <div className="flex flex-col items-end space-y-3 flex-shrink-0">
            <div className="text-right">
              <div className={`
                font-bold text-green-600 mb-1
                ${isTablet ? 'text-2xl' : 'text-3xl'}
              `}>
                ${task.price}
              </div>
              <div className="text-sm text-gray-500">{task.timeAgo}</div>
            </div>
            
            <Badge className={`
              ${getUrgencyColor(task.urgency)}
              ${isTablet ? 'text-xs' : 'text-sm'}
            `}>
              {task.urgency}
            </Badge>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className={`
        flex gap-3 pt-4 border-t border-gray-100
        ${isMobile ? 'flex-col' : 'flex-row justify-end'}
      `}>
        <Button 
          variant="outline" 
          className={`
            ${isMobile ? 'w-full' : isTablet ? 'px-4' : 'px-6'}
            ${isMobile ? 'text-sm' : 'text-base'}
          `}
        >
          View Details
        </Button>
        <Button 
          className={`
            bg-green-600 hover:bg-green-700 text-white
            ${isMobile ? 'w-full' : isTablet ? 'px-4' : 'px-6'}
            ${isMobile ? 'text-sm' : 'text-base'}
          `}
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Make Offer
        </Button>
      </div>
    </div>
  );
};
