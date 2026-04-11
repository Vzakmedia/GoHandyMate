
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { format } from "date-fns";

interface BookingCardProps {
  booking: {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    preferred_schedule?: string;
    budget?: number;
    location?: string;
    handyman?: {
      full_name: string;
      avatar_url?: string;
      phone?: string;
    };
  };
  onViewDetails: (booking: any) => void;
}

export const BookingCard = ({ booking, onViewDetails }: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Emergency';
      case 'high':
        return 'High Priority';
      case 'medium':
        return 'Same Day';
      case 'low':
        return 'Flexible';
      default:
        return priority;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'To be scheduled';
    try {
      return format(new Date(dateString), "MMM do, yyyy 'at' h:mm a");
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <CardTitle className="text-lg">{booking.title}</CardTitle>
          <div className="flex items-center gap-2">
            {booking.budget && booking.budget > 0 && (
              <span className="text-lg font-bold text-green-600">${booking.budget}</span>
            )}
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {booking.description && (
          <p className="text-gray-600 mb-4">{booking.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>{formatDate(booking.preferred_schedule)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>Priority: {getPriorityLabel(booking.priority)}</span>
          </div>
          
          {booking.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{booking.location}</span>
            </div>
          )}
          
          {booking.handyman && (
            <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
              <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate">{booking.handyman.full_name}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewDetails(booking)}
            className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
          >
            View Details
          </Button>
          {booking.status === 'pending' && (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
            >
              Reschedule
            </Button>
          )}
          {booking.status !== 'completed' && booking.status !== 'cancelled' && (
            <Button 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 transition-all duration-200 hover:scale-105"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
