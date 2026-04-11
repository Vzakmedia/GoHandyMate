
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { User, Clock, DollarSign, CheckCircle, X, Check, Loader2 } from 'lucide-react';
import { MessageButton } from '@/components/messaging/MessageButton';

interface QuoteSubmission {
  id: string;
  handyman_id: string;
  quoted_price: number;
  description: string;
  status: string;
  created_at: string;
  updated_at?: string;
  estimated_hours?: number;
  availability_note?: string;
  materials_included?: boolean;
  materials_cost?: number;
  travel_fee?: number;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface QuoteSubmissionsListProps {
  submissions: QuoteSubmission[];
  requestStatus: string;
  acceptedQuoteId?: string;
  onAcceptQuote: (quoteId: string) => void;
  onCancelQuote?: (quoteId: string) => void;
  isAccepting: boolean;
  isCancelling?: boolean;
}

export const QuoteSubmissionsList = ({
  submissions,
  requestStatus,
  acceptedQuoteId,
  onAcceptQuote,
  onCancelQuote,
  isAccepting,
  isCancelling = false
}: QuoteSubmissionsListProps) => {
  const canAcceptQuotes = requestStatus === 'quotes_received' || requestStatus === 'pending';

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">Quotes Received ({submissions.length})</h4>

      {submissions.map((submission) => {
        const isAccepted = submission.id === acceptedQuoteId;
        const totalCost = submission.quoted_price + (submission.materials_cost || 0) + (submission.travel_fee || 0);

        return (
          <Card key={submission.id} className={`border ${isAccepted ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">
                    {submission.profiles?.full_name || 'Handyman'}
                  </span>
                  {isAccepted && (
                    <Badge className="bg-green-100 text-[#166534] rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border-none whitespace-nowrap">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accepted
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    ${totalCost > submission.quoted_price ? totalCost.toFixed(2) : submission.quoted_price}
                  </div>
                  {submission.estimated_hours && (
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {submission.estimated_hours}h estimated
                    </div>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{submission.description}</p>

              {/* Price Breakdown */}
              {(submission.materials_cost || submission.travel_fee) && (
                <div className="bg-gray-50 p-2 rounded text-xs mb-3">
                  <div className="flex justify-between">
                    <span>Base Quote:</span>
                    <span>${submission.quoted_price}</span>
                  </div>
                  {submission.materials_cost && submission.materials_cost > 0 && (
                    <div className="flex justify-between">
                      <span>Materials:</span>
                      <span>${submission.materials_cost}</span>
                    </div>
                  )}
                  {submission.travel_fee && submission.travel_fee > 0 && (
                    <div className="flex justify-between">
                      <span>Travel Fee:</span>
                      <span>${submission.travel_fee}</span>
                    </div>
                  )}
                  <hr className="my-1" />
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {(submission.materials_included || submission.availability_note) && (
                <div className="flex gap-4 text-xs text-gray-600 mb-3">
                  {submission.materials_included && (
                    <span className="bg-[#166534]/10 text-[#166534] px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest">Materials included</span>
                  )}
                </div>
              )}

              {submission.availability_note && (
                <p className="text-xs text-gray-600 mb-3">
                  <strong>Availability:</strong> {submission.availability_note}
                </p>
              )}

              <div className="text-xs text-gray-500 mb-3">
                Submitted {new Date(submission.created_at).toLocaleDateString()} at{' '}
                {new Date(submission.created_at).toLocaleTimeString()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {canAcceptQuotes && !isAccepted && (
                  <>
                    <Button
                      onClick={() => onAcceptQuote(submission.id)}
                      disabled={isAccepting}
                      className="flex-1 bg-[#166534] hover:bg-[#14532d] rounded-full h-9 text-[10px] font-black uppercase tracking-widest transition-all"
                      size="sm"
                    >
                      {isAccepting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Accept Quote
                        </>
                      )}
                    </Button>

                    {onCancelQuote && (
                      <Button
                        onClick={() => onCancelQuote(submission.id)}
                        disabled={isCancelling}
                        variant="outline"
                        className="flex-1 rounded-full h-9 border-black/10 hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest transition-all text-slate-600"
                        size="sm"
                      >
                        {isCancelling ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </>
                        )}
                      </Button>
                    )}
                  </>
                )}

                {/* Message Button - Always visible for communication */}
                <MessageButton
                  jobId={`quote-${submission.id}`}
                  jobTitle={`Quote Discussion`}
                  jobStatus="active"
                  jobUpdatedAt={submission.updated_at || submission.created_at}
                  otherParticipantId={submission.handyman_id}
                  otherParticipantName={submission.profiles?.full_name || 'Handyman'}
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4 h-9 border-black/10 hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest transition-all"
                />
              </div>

              {isAccepted && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 mt-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Quote Accepted!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    A job has been created and the handyman will contact you soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
