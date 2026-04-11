
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, User, Phone, Mail, DollarSign, Star, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { MessageButton } from '@/components/messaging/MessageButton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Booking {
  id: string;
  service_type: string;
  status: string;
  scheduled_date: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  customer_rating?: number;
  customer_review?: string;
  handyman_id?: string | null;
  handyman?: {
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
}

interface BookingDetailsModalProps {
  booking: Booking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRatingSubmitted?: () => void;
}

export const BookingDetailsModal = ({ booking, open, onOpenChange, onRatingSubmitted }: BookingDetailsModalProps) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingRating, setExistingRating] = useState<any>(null);
  const [loadingRating, setLoadingRating] = useState(false);

  // Check for existing rating when booking changes
  useEffect(() => {
    const checkExistingRating = async () => {
      if (!booking || booking.status !== 'completed') return;
      
      setLoadingRating(true);
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('job_ratings')
          .select('*')
          .eq('job_id', booking.id)
          .eq('customer_id', user.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking existing rating:', error);
          return;
        }

        if (data) {
          setExistingRating(data);
          setRating(data.rating);
          setReview(data.review_text || '');
        } else {
          setExistingRating(null);
          setRating(0);
          setReview('');
        }
      } catch (error) {
        console.error('Error checking rating:', error);
      } finally {
        setLoadingRating(false);
      }
    };

    checkExistingRating();
  }, [booking]);

  if (!booking) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "EEEE, MMMM do, yyyy 'at' h:mm a");
    } catch {
      return 'Invalid date';
    }
  };

  const handleRatingSubmit = async () => {
    if (!booking.handyman_id || rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    if (existingRating) {
      toast.error('You have already rated this job');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        toast.error('You must be logged in to rate');
        return;
      }

      const { error } = await supabase
        .from('job_ratings')
        .insert({
          job_id: booking.id,
          customer_id: user.user.id,
          provider_id: booking.handyman_id,
          rating,
          review_text: review.trim() || null
        });

      if (error) throw error;

      toast.success('Rating submitted successfully!');
      setExistingRating({ rating, review_text: review.trim() || null });
      onRatingSubmitted?.();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if messaging should be enabled
  const canShowMessaging = () => {
    const hasHandyman = booking.handyman_id && booking.handyman;
    const validStatus = ['assigned', 'in_progress', 'completed'].includes(booking.status);
    const notCancelled = booking.status !== 'cancelled';
    
    return hasHandyman && validStatus && notCancelled;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <h3 className="text-xl font-semibold">{booking.service_type}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium">Scheduled Date</p>
                  <p className="text-sm text-gray-600">{formatDate(booking.scheduled_date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Total Amount</p>
                  <p className="text-sm text-green-600 font-semibold">${booking.total_amount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Handyman Information */}
          {booking.handyman && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Assigned Handyman</h4>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="relative w-12 h-12">
                  {booking.handyman.avatar_url ? (
                    <img
                      src={booking.handyman.avatar_url}
                      alt={booking.handyman.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        // Fallback to default avatar if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center ${
                      booking.handyman.avatar_url ? 'hidden' : ''
                    }`}
                  >
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-lg">{booking.handyman.full_name}</p>
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
              <div className="flex justify-between">
                <span className="text-gray-600">Scheduled:</span>
                <span>{formatDate(booking.scheduled_date)}</span>
              </div>
            </div>
          </div>

          {/* Rating Section for Completed Jobs */}
          {booking.status === 'completed' && (
            <div className="border-t pt-4">
              {loadingRating ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                </div>
              ) : existingRating ? (
                <div className="space-y-3">
                  <h4 className="font-medium">Your Rating</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= existingRating.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({existingRating.rating}/5)</span>
                  </div>
                  {existingRating.review_text && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Your Review:</p>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {existingRating.review_text}
                      </p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    You have already rated this job. Ratings can only be submitted once.
                  </p>
                </div>
              ) : (
                <div>
                  <h4 className="font-medium mb-3">Rate This Service</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">How would you rate this service?</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`p-1 ${
                              star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review (Optional)
                      </label>
                      <Textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="Share your experience with this service..."
                        rows={3}
                      />
                    </div>

                    <Button
                      onClick={handleRatingSubmit}
                      disabled={isSubmitting || rating === 0}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="border-t pt-4 flex gap-3 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            
            {/* Message Button for Active Jobs */}
            {canShowMessaging() && booking.handyman && (
              <MessageButton
                jobId={booking.id}
                jobTitle={booking.service_type}
                jobStatus={booking.status}
                jobUpdatedAt={booking.updated_at}
                otherParticipantId={booking.handyman_id!}
                otherParticipantName={booking.handyman.full_name}
                variant="outline"
                size="default"
              />
            )}
            
            {/* Rating Submit Button - removed since it's now inside the rating form */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
