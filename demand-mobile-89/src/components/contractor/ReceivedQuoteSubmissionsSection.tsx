import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle, User, Eye } from 'lucide-react';
import { useContractorQuotes } from '@/hooks/useContractorQuotes';

export const ReceivedQuoteSubmissionsSection = () => {
  const { receivedSubmissions, loading, acceptQuote } = useContractorQuotes();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading received submissions...</div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleAcceptQuote = async (requestId: string, quoteId: string) => {
    try {
      await acceptQuote(requestId, quoteId);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span>Quote Responses Received</span>
          <Badge variant="secondary">{receivedSubmissions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {receivedSubmissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No quote responses received yet</p>
            <p className="text-sm">Customer quote responses will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedSubmissions.map((submission) => (
              <div key={submission.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      Quote Response for {submission.contractor_quote_requests?.service_name || 'Service Request'}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>Customer: {submission.profiles?.full_name || 'Unknown Customer'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(submission.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(submission.status)}
                        <span className="capitalize">{submission.status}</span>
                      </div>
                    </Badge>
                    <div className="text-lg font-bold text-green-600">
                      ${submission.quoted_price}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 text-sm">
                  {submission.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-gray-600">
                    {submission.estimated_hours && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{submission.estimated_hours}h</span>
                      </div>
                    )}
                    {submission.materials_included && (
                      <Badge variant="outline" className="text-xs">
                        Materials Included
                      </Badge>
                    )}
                    <span>Received {new Date(submission.created_at).toLocaleDateString()}</span>
                  </div>

                  {submission.status === 'pending' ? (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptQuote(submission.quote_request_id, submission.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Handle rejection - could add a proper handler
                          console.log('Rejecting quote:', submission.id);
                        }}
                      >
                        Decline
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  )}
                </div>

                {submission.availability_note && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                    <strong>Availability:</strong> {submission.availability_note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};