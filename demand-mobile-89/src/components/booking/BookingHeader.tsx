
import { Button } from "@/components/ui/button";
import { Calendar, Plus, ArrowLeft } from "lucide-react";

interface BookingHeaderProps {
  onBack: () => void;
  onScheduleAppointment: () => void;
  onNewBooking: () => void;
}

export const BookingHeader = ({ onBack, onScheduleAppointment, onNewBooking }: BookingHeaderProps) => {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Bookings</h2>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button 
            onClick={onScheduleAppointment}
            variant="outline"
            className="bg-white border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Appointment
          </Button>
          <Button 
            onClick={onNewBooking}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>
    </>
  );
};
