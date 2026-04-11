
import { DollarSign } from 'lucide-react';
import { useQuoteRequests } from './quote-requests/useQuoteRequests';
import { LoadingState } from './quote-requests/LoadingState';
import { EmptyQuoteRequestsState } from './quote-requests/EmptyQuoteRequestsState';
import { QuoteRequestCard } from './quote-requests/QuoteRequestCard';

export const MyQuoteRequestsSection = () => {
  const { quoteRequests, loading, acceptQuote, refetch } = useQuoteRequests();

  const handleRateJob = () => {
    refetch();
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-[#166534] rounded-full flex items-center justify-center">
          <DollarSign className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">My Quote Requests</h3>
      </div>

      {quoteRequests.length === 0 ? (
        <EmptyQuoteRequestsState />
      ) : (
        <div className="space-y-4">
          {quoteRequests.map((request) => (
            <QuoteRequestCard
              key={request.id}
              request={request}
              onAcceptQuote={acceptQuote}
              onRatingSubmitted={handleRateJob}
            />
          ))}
        </div>
      )}
    </div>
  );
};
