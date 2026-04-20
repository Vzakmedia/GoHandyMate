import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, MapPin, User, Calendar } from 'lucide-react';
import { useContractorQuotes } from '@/hooks/useContractorQuotes';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export const ContractorQuoteSubmissionsSection = () => {
  const { receivedRequests, loading, submitQuote } = useContractorQuotes();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading received requests...</div>
        </CardContent>
      </Card>
    );
  }

  const urgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'destructive';
      case 'same_day':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span>Quote Requests From Contractors</span>
          <Badge variant="secondary">{receivedRequests.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {receivedRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No quote requests received</p>
            <p className="text-sm">Contractors will send quote requests here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {receivedRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={request.profiles?.avatar_url} alt="Customer" />
                      <AvatarFallback>
                        {request.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-green-600">
                        {request.service_name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>From: {request.profiles?.full_name || 'Contractor'}</span>
                        </div>
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
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={urgencyColor(request.urgency)}>
                      {request.urgency === 'emergency' ? 'Emergency' :
                       request.urgency === 'same_day' ? 'Same Day' : 'Flexible'}
                    </Badge>
                    {request.budget_range && (
                      <div className="text-sm font-medium text-green-600">
                        {request.budget_range}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-3 text-sm">
                  {request.service_description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {request.preferred_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Preferred: {new Date(request.preferred_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    <Badge 
                      variant={request.status === 'pending' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {request.status}
                    </Badge>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm">
                        Submit Quote
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};