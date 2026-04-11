
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingCalendar } from "@/components/BookingCalendar";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: number;
  date: Date;
  timeSlot: string;
  duration: string;
  service: string;
  provider: string;
  status: 'confirmed' | 'pending' | 'completed';
  address?: string;
  price?: number;
}

interface BookingManagerProps {
  onTabChange?: (tab: string) => void;
}

export const BookingManager = ({ onTabChange }: BookingManagerProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      date: new Date(2024, 11, 20),
      timeSlot: "10:00 AM",
      duration: "2 hours",
      service: "House Cleaning",
      provider: "Sarah Johnson",
      status: 'confirmed',
      address: "123 Main St, Downtown",
      price: 120
    },
    {
      id: 2,
      date: new Date(2024, 11, 22),
      timeSlot: "2:00 PM", 
      duration: "1 hour",
      service: "Plumbing Repair",
      provider: "Mike Rodriguez",
      status: 'pending',
      address: "456 Oak Ave, Midtown",
      price: 85
    }
  ]);

  const handleNewBooking = (booking: { date: Date; timeSlot: string; duration: string }) => {
    const newBooking: Booking = {
      id: bookings.length + 1,
      date: booking.date,
      timeSlot: booking.timeSlot,
      duration: booking.duration,
      service: "New Service Request",
      provider: "TBD",
      status: 'pending',
      address: "To be determined",
      price: 0
    };
    
    setBookings([...bookings, newBooking]);
    setShowCalendar(false);
    
    console.log('New booking created:', newBooking);
  };

  const handleNewBookingClick = () => {
    if (onTabChange) {
      onTabChange('search');
    } else {
      navigate('/?tab=search');
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Bookings</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={() => setShowCalendar(true)}
            variant="outline"
            className="bg-white border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button 
            onClick={handleNewBookingClick}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-4">Schedule your first service appointment</p>
            <Button 
              onClick={handleNewBookingClick} 
              className="bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
            >
              Book Now
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <CardTitle className="text-lg">{booking.service}</CardTitle>
                  <div className="flex items-center gap-2">
                    {booking.price && booking.price > 0 && (
                      <span className="text-lg font-bold text-green-600">${booking.price}</span>
                    )}
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{format(booking.date, "MMM do, yyyy")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{booking.timeSlot} ({booking.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{booking.provider}</span>
                  </div>
                  {booking.address && (
                    <div className="flex items-center gap-2 md:col-span-2 lg:col-span-1">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate text-xs">{booking.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto transition-all duration-200 hover:scale-105"
                  >
                    Reschedule
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 transition-all duration-200 hover:scale-105"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCalendar && (
        <BookingCalendar
          onClose={() => setShowCalendar(false)}
          onBooking={handleNewBooking}
        />
      )}
    </div>
  );
};
