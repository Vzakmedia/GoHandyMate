
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, DollarSign, User, MapPin, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { QuoteSubmissionsList } from './QuoteSubmissionsList';
import { useCustomQuotes } from '@/hooks/useCustomQuotes';
import { toast } from 'sonner';

interface QuoteRequestCardProps {
  request: {
    id: string;
    service_name: string;
    service_description: string;
    location: string;
    preferred_date?: string;
    budget_range?: string;
    urgency: string;
    status: string;
    created_at: string;
    accepted_quote_id?: string;
    submissions: Array<{
      id: string;
      handyman_id: string;
      quoted_price: number;
      description: string;
      status: string;
      created_at: string;
      estimated_hours?: number;
      availability_note?: string;
      materials_included?: boolean;
      materials_cost?: number;
      travel_fee?: number;
      profiles?: {
        full_name: string;
        email: string;
      };
    }>;
  };
  onAcceptQuote: (requestId: string, quoteId: string) => void;
  onRatingSubmitted: () => void;
}

export const QuoteRequestCard = ({ request, onAcceptQuote, onRatingSubmitted }: QuoteRequestCardProps) => {
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { getQuotesForRequest } = useCustomQuotes();

  const urgencyColor = request.urgency === 'emergency' ? 'destructive' :
    request.urgency === 'same_day' ? 'default' : 'secondary';

  const statusColor = request.status === 'accepted' ? 'default' :
    request.status === 'cancelled' ? 'destructive' : 'secondary';

  const handleAcceptQuote = async (quoteId: string) => {
    setIsAccepting(true);
    try {
      await onAcceptQuote(request.id, quoteId);
      toast.success('Quote accepted successfully!');
    } catch (error) {
      toast.error('Failed to accept quote');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleCancelQuote = async (quoteId: string) => {
    setIsCancelling(true);
    try {
      // For now, we'll just show a message since cancellation logic isn't implemented
      toast.info('Quote cancellation functionality will be implemented soon');
    } catch (error) {
      toast.error('Failed to cancel quote');
    } finally {
      setIsCancelling(false);
    }
  };

  const canAcceptQuotes = request.status === 'pending' || request.status === 'quotes_received';
  const hasSubmissions = request.submissions && request.submissions.length > 0;

  return (
    <Card className="border-black/5 rounded-[2rem] overflow-hidden shadow-none transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-slate-900 mb-2">
              {request.service_name}
            </CardTitle>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#166534] rounded-full flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">My Quote Requests</h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{request.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(request.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={statusColor}>
              {request.status.replace('_', ' ')}
            </Badge>
            <Badge variant={urgencyColor} className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest">
              {request.urgency === 'emergency' ? 'Emergency' :
                request.urgency === 'same_day' ? 'Same Day' : 'Flexible'}
            </Badge>
            {request.budget_range && (
              <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                <DollarSign className="w-4 h-4" />
                <span>{request.budget_range}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700">{request.service_description}</p>

        {request.preferred_date && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Preferred Date: {new Date(request.preferred_date).toLocaleDateString()}</span>
          </div>
        )}

        {hasSubmissions && (
          <div className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSubmissions(!showSubmissions)}
              className="w-full flex items-center justify-between rounded-full px-6 h-10 border-black/10 hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <span>
                Quotes Received ({request.submissions.length})
                {request.status === 'accepted' && request.accepted_quote_id && ' - 1 Accepted'}
              </span>
              {showSubmissions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>

            {showSubmissions && (
              <div className="mt-4">
                <QuoteSubmissionsList
                  submissions={request.submissions}
                  requestStatus={request.status}
                  acceptedQuoteId={request.accepted_quote_id}
                  onAcceptQuote={handleAcceptQuote}
                  onCancelQuote={handleCancelQuote}
                  isAccepting={isAccepting}
                  isCancelling={isCancelling}
                />
              </div>
            )}
          </div>
        )}

        {!hasSubmissions && request.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Your quote request is active. Handymen will submit quotes soon.
            </p>
          </div>
        )}

        {request.status === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
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
};
