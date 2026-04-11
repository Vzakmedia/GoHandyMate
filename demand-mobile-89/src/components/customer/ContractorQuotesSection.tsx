import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { useContractorQuotes } from '@/hooks/useContractorQuotes';
import { ContractorQuoteResponseCard } from './ContractorQuoteResponseCard';

export const ContractorQuotesSection = () => {
  const { receivedRequests, loading } = useContractorQuotes();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading contractor quote requests...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span>Quote Requests from Contractors</span>
          <Badge variant="secondary">{receivedRequests.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {receivedRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No quote requests from contractors yet</p>
            <p className="text-sm">Contractors can send you direct quote requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <ContractorQuoteResponseCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};