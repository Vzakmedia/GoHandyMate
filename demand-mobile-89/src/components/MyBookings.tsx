
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, DollarSign, User, Star, Eye } from 'lucide-react';
import { useBookings } from '@/hooks/useBookings';
import { BookingDetailsModal } from '@/components/customer/BookingDetailsModal';
import { MessageButton } from '@/components/messaging/MessageButton';
import { MyQuoteRequestsSection } from '@/components/customer/MyQuoteRequestsSection';
import type { Booking } from '@/hooks/useBookings';

interface MyBookingsProps {
  onBack: () => void;
}

export const MyBookings = ({ onBack }: MyBookingsProps) => {
  const { bookings, loading, refetch } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleRatingSubmitted = () => {
    refetch();
    setShowDetailsModal(false);
  };

  // Simplified messaging check - show if there's a handyman assigned
  const shouldShowMessaging = (booking: Booking) => {
    const hasAssignedHandyman = booking.handyman_id && booking.handyman_id !== null;
    console.log('Message button check for booking:', booking.id, {
      handyman_id: booking.handyman_id,
      handyman: booking.handyman,
      status: booking.status,
      shouldShow: hasAssignedHandyman
    });
    return hasAssignedHandyman;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">My Bookings & Quotes</h2>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">My Bookings & Quotes</h2>
      </div>

      <div className="flex flex-col">
        {/* Pill-style Sub-Navigation */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="inline-flex items-center gap-2 p-1.5 bg-white/50 backdrop-blur-sm border border-black/5 rounded-[2rem]">
            <Button
              variant={activeTab === 'bookings' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('bookings')}
              className={`rounded-full px-6 transition-all duration-300 ${activeTab === 'bookings' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
            >
              <Calendar className="w-3.5 h-3.5 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">My Bookings</span>
            </Button>

            <Button
              variant={activeTab === 'quotes' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('quotes')}
              className={`rounded-full px-6 transition-all duration-300 ${activeTab === 'quotes' ? 'bg-[#166534] text-white' : 'text-slate-500 hover:text-[#166534]'}`}
            >
              <DollarSign className="w-3.5 h-3.5 mr-2" />
              <span className="text-[10px] font-black uppercase tracking-widest">My Quotes</span>
            </Button>
          </div>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-[3rem] border border-black/5 overflow-hidden">
          <div className="p-6">
            {activeTab === 'bookings' ? (
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <Card key={booking.id} className="border-black/5 rounded-[2rem] overflow-hidden shadow-none transition-all duration-300">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg font-bold text-slate-900">{booking.service_type}</CardTitle>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center text-slate-500">
                                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                  <span className="text-xs font-medium">
                                    {new Date(booking.scheduled_date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest ${booking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                              {booking.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-black/5 pt-4">
                            <div className="space-y-3">
                              {booking.handyman && (
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                    <User className="w-3 h-3 text-slate-500" />
                                  </div>
                                  <span className="text-xs font-semibold text-slate-700">{booking.handyman.full_name}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-[#166534]/10 flex items-center justify-center">
                                  <DollarSign className="w-3 h-3 text-[#166534]" />
                                </div>
                                <span className="text-xs font-bold text-[#166534]">${booking.total_amount}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 items-end justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(booking)}
                                className="rounded-full px-4 h-9 border-black/10 hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest"
                              >
                                <Eye className="w-3.5 h-3.5 mr-2" />
                                Details
                              </Button>

                              {shouldShowMessaging(booking) && (
                                <MessageButton
                                  jobId={booking.id}
                                  jobTitle={booking.service_type}
                                  jobStatus={booking.status}
                                  jobUpdatedAt={booking.updated_at}
                                  otherParticipantId={booking.handyman_id!}
                                  otherParticipantName={booking.handyman?.full_name || 'Handyman'}
                                  variant="outline"
                                  size="sm"
                                  className="rounded-full px-4 h-9 border-black/10 hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest"
                                />
                              )}

                              {booking.status === 'completed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(booking)}
                                  className="rounded-full px-4 h-9 border-green-200 text-green-600 hover:bg-green-50 text-[10px] font-black uppercase tracking-widest"
                                >
                                  <Star className="w-3.5 h-3.5 mr-2" />
                                  Rate
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <MyQuoteRequestsSection />
            )}
          </div>
        </div>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onRatingSubmitted={handleRatingSubmitted}
      />
    </div>
  );
};
