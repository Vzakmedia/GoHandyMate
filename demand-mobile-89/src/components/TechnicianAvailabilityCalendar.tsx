
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, Star, User, CheckCircle } from "lucide-react";
import { format, addDays, isSameDay, isAfter, startOfDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from '@/features/auth';

interface Technician {
  id: string;
  full_name: string;
  avatar_url?: string;
  rating: number;
  last_service: string;
  skills: string[];
  total_jobs?: number;
  email?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
}

interface TechnicianAvailabilityCalendarProps {
  technician: Technician;
  onClose: () => void;
  onBooking: (booking: { date: Date; timeSlot: string; duration: string }) => void;
}

export const TechnicianAvailabilityCalendar = ({ 
  technician, 
  onClose, 
  onBooking 
}: TechnicianAvailabilityCalendarProps) => {
  const { user, profile } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [duration, setDuration] = useState<string>('2 hours');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Generate time slots based on date selection
  const generateTimeSlots = async (date: Date) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const slots: TimeSlot[] = [];
      const startHour = 9;
      const endHour = 17;
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute of [0, 30]) {
          const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const displayTime = format(new Date(2024, 0, 1, hour, minute), 'h:mm a');
          
          // Mock availability - randomly make some slots unavailable
          const isAvailable = Math.random() > 0.3;
          
          slots.push({
            time: displayTime,
            available: isAvailable,
            price: 85 + Math.floor(Math.random() * 20)
          });
        }
      }
      
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      generateTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    if (date && isAfter(date, startOfDay(new Date()))) {
      setSelectedDate(date);
      setSelectedSlot('');
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedDate || !selectedSlot || !selectedService || !user) {
      toast.error('Please select a date, time, and service');
      return;
    }

    setSubmitting(true);
    try {
      // Create a job request in the database
      const { data, error } = await supabase
        .from('job_requests')
        .insert({
          customer_id: user.id,
          assigned_to_user_id: technician.id,
          title: `${selectedService} - ${technician.full_name}`,
          description: `${selectedService} service requested`,
          category: selectedService,
          location: profile?.address || 'Customer Location',
          budget: 100, // Base budget, can be adjusted
          status: 'pending',
          job_type: 'handyman_service',
          preferred_schedule: new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            parseInt(selectedSlot.split(':')[0]),
            selectedSlot.includes('30') ? 30 : 0
          ).toISOString(),
          priority: 'medium'
        });

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      console.log('Booking created successfully:', data);
      
      // Call the parent callback
      onBooking({
        date: selectedDate,
        timeSlot: selectedSlot,
        duration: duration
      });

      toast.success(`Booking request sent to ${technician.full_name}!`);
      onClose();
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking request');
    } finally {
      setSubmitting(false);
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

  const getProfileImageUrl = (technician: Technician) => {
    if (technician.avatar_url) {
      return technician.avatar_url;
    }
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(technician.full_name)}`;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Button onClick={onClose} variant="ghost" size="sm" className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            Book with {technician.full_name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Technician Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technician Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Section */}
                <div className="flex items-center gap-4">
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{technician.full_name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(technician.rating)}
                      <span className="text-sm text-gray-600 ml-1">
                        ({technician.rating.toFixed(1)})
                      </span>
                    </div>
                    {technician.total_jobs && (
                      <p className="text-sm text-gray-600 mt-1">
                        {technician.total_jobs} completed job{technician.total_jobs !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <h4 className="font-medium mb-3">Select Service</h4>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {technician.skills && technician.skills.length > 0 ? (
                        technician.skills.map((skill, index) => (
                          <SelectItem key={index} value={skill}>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              {skill}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="General Handyman Service">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            General Handyman Service
                          </div>
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skills Display */}
                {technician.skills && technician.skills.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Available Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {technician.skills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant={selectedService === skill ? "default" : "outline"} 
                          className="text-xs cursor-pointer"
                          onClick={() => setSelectedService(skill)}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Duration Selection */}
                <div>
                  <h4 className="font-medium mb-2">Service Duration</h4>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 hour">1 hour</SelectItem>
                      <SelectItem value="2 hours">2 hours</SelectItem>
                      <SelectItem value="3 hours">3 hours</SelectItem>
                      <SelectItem value="4 hours">4 hours</SelectItem>
                      <SelectItem value="Half day">Half day (4-6 hours)</SelectItem>
                      <SelectItem value="Full day">Full day (8+ hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Contact Info */}
                {technician.email && (
                  <div>
                    <h4 className="font-medium mb-1">Contact</h4>
                    <p className="text-sm text-gray-600">{technician.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calendar and Time Slots */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < startOfDay(new Date())}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>

            {selectedDate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Available Times - {format(selectedDate, 'EEEE, MMMM do')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedSlot === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot.time)}
                          className={`h-12 text-sm ${
                            selectedSlot === slot.time 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : slot.available 
                                ? 'hover:bg-green-50 hover:border-green-300' 
                                : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium">{slot.time}</div>
                            {slot.available && slot.price && (
                              <div className="text-xs opacity-75">${slot.price}</div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}

                  {availableSlots.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-600 rounded"></div>
                          <span>Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-300 rounded"></div>
                          <span>Unavailable</span>
                        </div>
                      </div>
                      
                      {selectedSlot && selectedService && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-2">Booking Summary</h4>
                          <div className="space-y-1 text-sm text-green-700">
                            <p><strong>Service:</strong> {selectedService}</p>
                            <p><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM do, yyyy')}</p>
                            <p><strong>Time:</strong> {selectedSlot}</p>
                            <p><strong>Duration:</strong> {duration}</p>
                            <p><strong>Technician:</strong> {technician.full_name}</p>
                          </div>
                        </div>
                      )}
                      
                      <Button
                        onClick={handleBookingSubmit}
                        disabled={!selectedSlot || !selectedService || submitting}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        {submitting ? 'Submitting...' : 'Confirm Booking Request'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
