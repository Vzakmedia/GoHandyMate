
import { useState } from 'react';
import { QuoteSubmissionCard } from './QuoteSubmissionCard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReceivedQuotesProps {
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
  onAcceptQuote: (quoteId: string) => void;
}

export const ReceivedQuotes = ({ submissions, onAcceptQuote }: ReceivedQuotesProps) => {
  const [acceptingQuote, setAcceptingQuote] = useState<string | null>(null);

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      setAcceptingQuote(quoteId);
      await onAcceptQuote(quoteId);
      toast.success('Quote accepted successfully!');
    } catch (error) {
      console.error('Error accepting quote:', error);
      toast.error('Failed to accept quote');
    } finally {
      setAcceptingQuote(null);
    }
  };

  console.log('ReceivedQuotes rendering with submissions:', submissions);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">
          Received Quotes ({submissions.length})
        </h4>
      </div>
      
      <div className="space-y-3">
        {submissions.map((submission) => {
          console.log('Rendering submission:', submission.id, submission);
          return (
            <QuoteSubmissionCard
              key={submission.id}
              submission={submission}
              onAccept={handleAcceptQuote}
              isAccepted={submission.status === 'accepted'}
              isAccepting={acceptingQuote === submission.id}
            />
          );
        })}
      </div>
    </div>
  );
};
