import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Calendar, User, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { QuoteSubmissionModal } from '../quotes/QuoteSubmissionModal';
import { useToast } from '@/hooks/use-toast';

interface QuoteRequest {
  id: string;
  service_name: string;
  service_description: string;
  location: string;
  preferred_date: string | null;
  budget_range: string | null;
  urgency: string;
  created_at: string;
  customer_id: string;
  quote_type: string;
  status: string;
  profiles?: {
    full_name: string;
  } | null;
}

export const ContractorJobFeed = () => {
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<QuoteRequest | null>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPublicQuoteRequests();
  }, []);

  const fetchPublicQuoteRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_quote_requests')
        .select(`
          *,
          profiles!customer_id (
            full_name
          )
        `)
        .eq('quote_type', 'public')
        .eq('status', 'pending')
        .is('accepted_quote_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuoteRequests((data as any[]) || []);
    } catch (error) {
      console.error('Error fetching quote requests:', error);
      toast({
        title: "Error",
        description: "Failed to load quote requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = (request: QuoteRequest) => {
    setSelectedRequest(request);
    setShowQuoteModal(true);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'same_day':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'Emergency (+100%)';
      case 'same_day':
        return 'Same Day (+50%)';
      default:
        return 'Flexible';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (quoteRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Public Quote Requests</h3>
          <p className="text-gray-600">
            There are currently no public quote requests available. Check back later for new opportunities.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Public Quote Requests</h2>
          <Button onClick={fetchPublicQuoteRequests} variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {quoteRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                    {request.service_name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{request.profiles?.full_name || 'Customer'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(request.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Badge className={getUrgencyColor(request.urgency)}>
                  {getUrgencyLabel(request.urgency)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-700 mb-4">{request.service_description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{request.location}</span>
                </div>
                
                {request.preferred_date && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {new Date(request.preferred_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {request.budget_range && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{request.budget_range}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleSubmitQuote(request)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Submit Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedRequest && (
        <QuoteSubmissionModal
          isOpen={showQuoteModal}
          onClose={() => {
            setShowQuoteModal(false);
            setSelectedRequest(null);
          }}
          quoteRequest={selectedRequest as any}
          onQuoteSubmitted={fetchPublicQuoteRequests}
        />
      )}
    </>
  );
};