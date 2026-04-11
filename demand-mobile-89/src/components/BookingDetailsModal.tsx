import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Phone, Mail, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { RescheduleModal } from './booking/RescheduleModal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BookingDetailsModalProps {
  booking: {
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    preferred_schedule?: string;
    created_at: string;
    location?: string;
    budget?: number;
    handyman?: {
      full_name: string;
      avatar_url?: string;
      phone?: string;
    };
  };
  onClose: () => void;
  onBookingUpdated?: () => void;
}

export const BookingDetailsModal = ({ booking, onClose, onBookingUpdated }: BookingDetailsModalProps) => {
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
      return format(new Date(dateString), "EEEE, MMMM do, yyyy 'at' h:mm a");
    } catch {
      return 'Invalid date';
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('job_requests')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', booking.id);

      if (error) throw error;

      toast.success('Booking cancelled successfully');
      onBookingUpdated?.();
      onClose();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRescheduleSuccess = () => {
    onBookingUpdated?.();
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.replace('_', ' ')}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{booking.title}</h3>
                {booking.description && (
                  <p className="text-gray-600 mt-2">{booking.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Scheduled Date</p>
                    <p className="text-sm text-gray-600">{formatDate(booking.preferred_schedule)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Priority</p>
                    <p className="text-sm text-gray-600">{getPriorityLabel(booking.priority)}</p>
                  </div>
                </div>

                {booking.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">{booking.location}</p>
                    </div>
                  </div>
                )}

                {booking.budget && booking.budget > 0 && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Budget</p>
                      <p className="text-sm text-green-600 font-semibold">${booking.budget}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Handyman Information */}
            {booking.handyman && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Assigned Handyman</h4>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {booking.handyman.avatar_url ? (
                    <img
                      src={booking.handyman.avatar_url}
                      alt={booking.handyman.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{booking.handyman.full_name}</p>
                    {booking.handyman.phone && (
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{booking.handyman.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span>{format(new Date(booking.created_at), "MMM do, yyyy 'at' h:mm a")}</span>
                </div>
                {booking.preferred_schedule && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Scheduled:</span>
                    <span>{formatDate(booking.preferred_schedule)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-4 flex gap-2 justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {booking.status === 'pending' && (
                <>
                  <Button 
                    variant="outline"
                    onClick={() => setShowRescheduleModal(true)}
                    disabled={isUpdating}
                  >
                    Reschedule
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleCancelBooking}
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Cancelling...' : 'Cancel Booking'}
                  </Button>
                </>
              )}
              {booking.status === 'completed' && (
                <Button>
                  Book Again
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showRescheduleModal && (
        <RescheduleModal
          booking={booking}
          isOpen={showRescheduleModal}
          onClose={() => setShowRescheduleModal(false)}
          onRescheduleSuccess={handleRescheduleSuccess}
        />
      )}
    </>
  );
};
