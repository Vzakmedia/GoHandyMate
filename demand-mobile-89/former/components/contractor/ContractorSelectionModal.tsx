import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Star, Users, ArrowRight, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCustomQuotes } from '@/hooks/useCustomQuotes';

interface Contractor {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  average_rating: number;
  total_ratings: number;
  address?: string;
  city?: string;
  zip_code?: string;
  services_offered: string[];
  distance?: number;
}

interface ContractorSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteData: {
    service_name: string;
    service_description: string;
    location: string;
    preferred_date?: string;
    budget_range?: string;
    urgency: string;
  };
}

export const ContractorSelectionModal = ({
  isOpen,
  onClose,
  quoteData
}: ContractorSelectionModalProps) => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [selectedContractors, setSelectedContractors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { createQuoteRequest } = useCustomQuotes();

  useEffect(() => {
    if (isOpen) {
      fetchContractors();
    }
  }, [isOpen]);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      
      // Get user's location for distance filtering
      let userLocation = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: false
            });
          });
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        } catch (error) {
          console.log('Location access denied or unavailable');
        }
      }
      
      // Fetch contractors from the profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url, average_rating, total_ratings, address, city, zip_code')
        .eq('user_role', 'contractor')
        .eq('account_status', 'active')
        .order('average_rating', { ascending: false })
        .limit(50); // Increased limit for better filtering

      if (error) {
        console.error('Error fetching contractors:', error);
        return;
      }

      // Transform the data
      const contractorsWithServices = (data || []).map(contractor => {
        // Calculate distance if location is available (placeholder for future implementation)
        const distance = 0; // Will be calculated when GPS integration is added
        
        return {
          ...contractor,
          services_offered: [], // Will be populated from business_profiles in future
          distance: 0
        };
      });

      setContractors(contractorsWithServices);
    } catch (error) {
      console.error('Error fetching contractors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContractors = contractors.filter(contractor => {
    const searchLower = searchQuery.toLowerCase();
    return (
      contractor.full_name?.toLowerCase().includes(searchLower) ||
      contractor.services_offered.some(service => 
        service.toLowerCase().includes(searchLower)
      ) ||
      contractor.address?.toLowerCase().includes(searchLower) ||
      contractor.city?.toLowerCase().includes(searchLower) ||
      contractor.zip_code?.toLowerCase().includes(searchLower)
    );
  });

  const handleContractorToggle = (contractorId: string) => {
    setSelectedContractors(prev =>
      prev.includes(contractorId)
        ? prev.filter(id => id !== contractorId)
        : [...prev, contractorId]
    );
  };

  const handleSubmitToSelected = async () => {
    if (selectedContractors.length === 0) return;

    setSubmitting(true);
    try {
      // Create quote request with specific contractors
      await createQuoteRequest({
        ...quoteData,
        quote_type: 'direct'
      });

      onClose();
      setSelectedContractors([]);
    } catch (error) {
      console.error('Error submitting quote request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitToAll = async () => {
    setSubmitting(true);
    try {
      // Create public quote request
      await createQuoteRequest({
        ...quoteData,
        quote_type: 'public'
      });

      onClose();
    } catch (error) {
      console.error('Error submitting quote request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              Choose Contractors for Your Quote Request
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button
              onClick={handleSubmitToAll}
              disabled={submitting}
              className="h-auto p-4 flex flex-col items-start text-left bg-blue-600 hover:bg-blue-700"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">Post to All Contractors</span>
              </div>
              <span className="text-sm opacity-90">
                Send to all qualified contractors in your area
              </span>
            </Button>

            <Button
              onClick={handleSubmitToSelected}
              disabled={submitting || selectedContractors.length === 0}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start text-left border-2"
            >
              <div className="flex items-center space-x-2 mb-2">
                <ArrowRight className="w-5 h-5" />
                <span className="font-medium">
                  Send to Selected ({selectedContractors.length})
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                Choose specific contractors to receive your request
              </span>
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search contractor by services or by your location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quote Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <h4 className="font-medium text-blue-800 mb-2">Your Quote Request</h4>
            <p className="text-sm text-blue-700">
              <strong>Service:</strong> {quoteData.service_name}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Location:</strong> {quoteData.location}
            </p>
            {quoteData.budget_range && (
              <p className="text-sm text-blue-700">
                <strong>Budget:</strong> {quoteData.budget_range}
              </p>
            )}
          </div>

          {/* Contractors List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Loading contractors...</p>
                </div>
              </div>
            ) : filteredContractors.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No contractors found within 80 miles of your location.</p>
                <p className="text-sm text-gray-500">Try expanding your search criteria or location.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredContractors.map((contractor) => (
                  <Card 
                    key={contractor.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedContractors.includes(contractor.id) 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : ''
                    }`}
                    onClick={() => handleContractorToggle(contractor.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          checked={selectedContractors.includes(contractor.id)}
                          onChange={() => handleContractorToggle(contractor.id)}
                          className="mt-1"
                        />
                        
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={contractor.avatar_url} />
                          <AvatarFallback>
                            {contractor.full_name?.charAt(0) || 'C'}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900">
                              {contractor.full_name || 'Contractor'}
                            </h3>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium">
                                {contractor.average_rating?.toFixed(1) || '0.0'}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({contractor.total_ratings || 0})
                              </span>
                            </div>
                          </div>

                          {contractor.address && (
                            <div className="flex items-center space-x-1 mt-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {contractor.city}, {contractor.zip_code}
                              </span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1 mt-2">
                            {contractor.services_offered.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {contractor.services_offered.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{contractor.services_offered.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};