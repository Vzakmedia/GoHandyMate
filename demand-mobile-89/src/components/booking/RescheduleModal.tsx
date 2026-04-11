
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RescheduleModalProps {
  booking: {
    id: string;
    title: string;
    preferred_schedule?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onRescheduleSuccess: () => void;
}

const timeSlots = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'
];

export const RescheduleModal = ({ booking, isOpen, onClose, onRescheduleSuccess }: RescheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    booking.preferred_schedule ? new Date(booking.preferred_schedule) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const [time, period] = selectedTime.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      
      if (period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (period === 'AM' && hour === 12) {
        hour = 0;
      }
      
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hour, parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from('job_requests')
        .update({ 
          preferred_schedule: newDateTime.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast.success('Booking rescheduled successfully');
      onRescheduleSuccess();
      onClose();
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      toast.error('Failed to reschedule booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Reschedule Booking
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">{booking.title}</h4>
            {booking.preferred_schedule && (
              <p className="text-sm text-gray-600">
                Current: {format(new Date(booking.preferred_schedule), "EEEE, MMMM do, yyyy 'at' h:mm a")}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select New Date</label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < today}
              className="rounded-md border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select Time</label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <Clock className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Choose time slot" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleReschedule} 
              disabled={isSubmitting || !selectedDate || !selectedTime}
            >
              {isSubmitting ? 'Rescheduling...' : 'Confirm Reschedule'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
