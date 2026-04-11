
import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface BookingCalendarProps {
  onClose?: () => void;
  onBooking?: (booking: { date: Date; timeSlot: string; duration: string }) => void;
}

export const BookingCalendar = ({ onClose, onBooking }: BookingCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("1 hour");

  const timeSlots = [
    "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
    "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  const durations = ["30 minutes", "1 hour", "2 hours", "3 hours", "4+ hours"];

  const unavailableDates = [
    new Date(2024, 11, 25), // Christmas
    new Date(2024, 11, 31), // New Year's Eve
  ];

  const isDateUnavailable = (date: Date) => {
    return unavailableDates.some(unavailable => 
      date.toDateString() === unavailable.toDateString()
    ) || date < new Date();
  };

  const handleBooking = () => {
    if (selectedDate && selectedTimeSlot && onBooking) {
      onBooking({
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        duration: selectedDuration
      });
    }
  };

  const isBookingComplete = selectedDate && selectedTimeSlot;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-green-800 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Book Appointment
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateUnavailable}
                className="rounded-md border pointer-events-auto"
              />
              {selectedDate && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Selected: {format(selectedDate, "EEEE, MMMM do, yyyy")}
                  </p>
                </div>
              )}
            </div>

            {/* Time Slots Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Select Time
              </h3>
              
              {!selectedDate ? (
                <p className="text-gray-500 text-center py-8">
                  Please select a date first
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTimeSlot === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTimeSlot(time)}
                      className={selectedTimeSlot === time ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              )}

              {/* Duration Selection */}
              {selectedTimeSlot && (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Estimated Duration</h4>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((duration) => (
                      <Badge
                        key={duration}
                        variant={selectedDuration === duration ? "default" : "outline"}
                        className={`cursor-pointer ${
                          selectedDuration === duration 
                            ? "bg-green-600 hover:bg-green-700" 
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedDuration(duration)}
                      >
                        {duration}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          {isBookingComplete && (
            <div className="border-t pt-6">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Booking Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">{format(selectedDate, "MMM do, yyyy")}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <p className="font-medium">{selectedTimeSlot}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium">{selectedDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button 
              onClick={handleBooking}
              disabled={!isBookingComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
