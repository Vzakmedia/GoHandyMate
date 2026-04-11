
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HandymanServicePricing {
  handyman_id: string;
  handyman_name: string;
  category_id: string;
  subcategory_id?: string;
  base_price: number;
  custom_price?: number;
  same_day_multiplier: number;
  emergency_multiplier: number;
  distance_miles: number;
  rating: number;
  reviews_count: number;
  availability: 'available' | 'busy' | 'unavailable';
}

interface LiveServicePricingProps {
  selectedCategoryId?: string;
  selectedSubcategoryId?: string;
  userLocation?: { lat: number; lng: number };
}

export const LiveServicePricing = ({ 
  selectedCategoryId, 
  selectedSubcategoryId,
  userLocation 
}: LiveServicePricingProps) => {
  const [serviceProviders, setServiceProviders] = useState<HandymanServicePricing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUrgency, setSelectedUrgency] = useState<'standard' | 'same_day' | 'emergency'>('standard');
  const [estimatedHours, setEstimatedHours] = useState<number>(2);

  const fetchLiveServicePricing = useCallback(async () => {
    if (!selectedCategoryId) return;

    setLoading(true);
    try {
      console.log('LiveServicePricing: Fetching pricing for category:', selectedCategoryId);

      // Simulate real-time pricing fetch from multiple handymen
      const { data, error } = await supabase.functions.invoke('get-live-service-pricing', {
        body: {
          category_id: selectedCategoryId,
          subcategory_id: selectedSubcategoryId,
          user_location: userLocation
        }
      });

      if (error) {
        console.error('LiveServicePricing: Error fetching data:', error);
        // Fallback to mock data for demonstration
        setServiceProviders(generateMockPricingData());
      } else {
        setServiceProviders(data?.providers || []);
      }
    } catch (error) {
      console.error('LiveServicePricing: Error:', error);
      // Use mock data when service is unavailable
      setServiceProviders(generateMockPricingData());
    } finally {
      setLoading(false);
    }
  }, [selectedCategoryId, selectedSubcategoryId, userLocation, generateMockPricingData]);

  useEffect(() => {
    if (selectedCategoryId) {
      fetchLiveServicePricing();
    }
  }, [selectedCategoryId, fetchLiveServicePricing]);

  const generateMockPricingData = useCallback((): HandymanServicePricing[] => {
    if (!selectedCategoryId) return [];

    const category = expandedServiceCategories.find(cat => cat.id === selectedCategoryId);
    if (!category) return [];

    // Generate mock handymen with realistic pricing variations
    return Array.from({ length: 5 }, (_, index) => ({
      handyman_id: `handyman_${index + 1}`,
      handyman_name: ['Mike Johnson', 'Sarah Chen', 'David Rodriguez', 'Emily Watson', 'John Smith'][index],
      category_id: selectedCategoryId,
      subcategory_id: selectedSubcategoryId,
      base_price: 75 + (index * 15) + Math.random() * 20,
      custom_price: undefined,
      same_day_multiplier: 1.3 + (Math.random() * 0.4),
      emergency_multiplier: 1.8 + (Math.random() * 0.4),
      distance_miles: 2 + (Math.random() * 8),
      rating: 4.2 + (Math.random() * 0.8),
      reviews_count: 15 + Math.floor(Math.random() * 100),
      availability: (['available', 'busy', 'available', 'available', 'unavailable'][index]) as 'available' | 'busy' | 'unavailable'
    }));
  }, [selectedCategoryId, selectedSubcategoryId]);

  const calculateFinalPrice = (provider: HandymanServicePricing) => {
    const basePrice = provider.custom_price || provider.base_price;
    let multiplier = 1;

    switch (selectedUrgency) {
      case 'same_day':
        multiplier = provider.same_day_multiplier;
        break;
      case 'emergency':
        multiplier = provider.emergency_multiplier;
        break;
      default:
        multiplier = 1;
    }

    return basePrice * multiplier * estimatedHours;
  };

  const getUrgencyBadgeColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'same_day':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available Now</Badge>;
      case 'busy':
        return <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>;
      default:
        return <Badge className="bg-red-100 text-red-800">Unavailable</Badge>;
    }
  };

  if (!selectedCategoryId) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">Select a service category to see live pricing</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Live Service Pricing</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Service Urgency</Label>
              <Select value={selectedUrgency} onValueChange={(value: 'standard' | 'same_day' | 'emergency') => setSelectedUrgency(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Booking</SelectItem>
                  <SelectItem value="same_day">Same Day Service</SelectItem>
                  <SelectItem value="emergency">Emergency Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estimated Hours</Label>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(parseFloat(e.target.value) || 1)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={getUrgencyBadgeColor(selectedUrgency)}>
              {selectedUrgency === 'emergency' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {selectedUrgency === 'same_day' && <Clock className="w-3 h-3 mr-1" />}
              {selectedUrgency === 'standard' && <Calendar className="w-3 h-3 mr-1" />}
              {selectedUrgency.replace('_', ' ').toUpperCase()}
            </Badge>
            <span className="text-sm text-gray-600">
              for {estimatedHours} hour{estimatedHours !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Live Pricing Results */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          serviceProviders.map((provider) => (
            <Card key={provider.handyman_id} className="transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {provider.handyman_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{provider.handyman_name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{provider.distance_miles.toFixed(1)} mi away</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>⭐ {provider.rating.toFixed(1)}</span>
                          <span>({provider.reviews_count} reviews)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    {getAvailabilityBadge(provider.availability)}
                    <div className="text-2xl font-bold text-green-600">
                      ${calculateFinalPrice(provider).toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Base: ${provider.base_price}/hr
                      {selectedUrgency !== 'standard' && (
                        <span className="ml-1">
                          × {selectedUrgency === 'same_day' ? provider.same_day_multiplier.toFixed(1) : provider.emergency_multiplier.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Total for {estimatedHours} hour{estimatedHours !== 1 ? 's' : ''} 
                    {selectedUrgency !== 'standard' && (
                      <span className="ml-1 text-orange-600">
                        ({selectedUrgency.replace('_', ' ')} rate)
                      </span>
                    )}
                  </div>
                  <Button 
                    disabled={provider.availability !== 'available'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {provider.availability === 'available' ? 'Book Now' : 'Unavailable'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {serviceProviders.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No service providers found for this category</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchLiveServicePricing}
            >
              Refresh Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
