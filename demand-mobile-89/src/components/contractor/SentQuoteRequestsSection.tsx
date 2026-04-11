import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, Clock, MapPin, User, Calendar, Eye, Edit, FileText, CheckCircle } from 'lucide-react';
import { useContractorQuotes } from '@/hooks/useContractorQuotes';
import { useState } from 'react';

export const SentQuoteRequestsSection = () => {
  const { sentRequests, loading } = useContractorQuotes();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading sent requests...</div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          <span>Sent Quote Requests</span>
          <Badge variant="secondary">{sentRequests.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sentRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No quote requests sent yet</p>
            <p className="text-sm">Start sending quote requests to customers!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sentRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-blue-600">
                      {request.service_name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{request.profiles?.full_name || 'Customer'}</span>
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
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                    {request.budget_range && (
                      <div className="text-sm font-medium text-green-600">
                        {request.budget_range}
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-3 text-sm line-clamp-2">
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
                      <Badge variant="outline" className="text-xs">
                        {request.urgency}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{request.service_name}</DialogTitle>
                            <DialogDescription>
                              Quote request details and status
                            </DialogDescription>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Request Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Service:</strong> {selectedRequest.service_name}</p>
                                    <p><strong>Location:</strong> {selectedRequest.location}</p>
                                    <p><strong>Urgency:</strong> {selectedRequest.urgency}</p>
                                    {selectedRequest.budget_range && (
                                      <p><strong>Budget:</strong> {selectedRequest.budget_range}</p>
                                    )}
                                    {selectedRequest.preferred_date && (
                                      <p><strong>Preferred Date:</strong> {new Date(selectedRequest.preferred_date).toLocaleDateString()}</p>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-semibold mb-2">Customer Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Name:</strong> {selectedRequest.profiles?.full_name || 'Not provided'}</p>
                                    <p><strong>Email:</strong> {selectedRequest.profiles?.email || 'Not provided'}</p>
                                    <p><strong>Status:</strong> 
                                      <Badge className={`ml-2 ${getStatusColor(selectedRequest.status)}`}>
                                        {selectedRequest.status}
                                      </Badge>
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Description</h4>
                                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                  {selectedRequest.service_description}
                                </p>
                              </div>
                              {selectedRequest.status === 'accepted' && (
                                <div className="bg-green-50 border border-green-200 rounded p-3">
                                  <div className="flex items-center space-x-2 text-green-800">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="font-semibold">Quote Accepted!</span>
                                  </div>
                                  <p className="text-sm text-green-700 mt-1">
                                    This quote has been accepted. You can now create an invoice from the Invoices tab.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {request.status === 'accepted' ? (
                        <Badge className="bg-green-100 text-green-800 px-3 py-1">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Accepted
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit Request
                        </Button>
                      )}
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};