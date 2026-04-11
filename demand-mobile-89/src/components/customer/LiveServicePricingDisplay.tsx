
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Clock, Zap, Star, MapPin } from 'lucide-react';

interface PricingItem {
  handyman_id: string;
  handyman_name: string;
  rating: number;
  reviews_count: number;
  distance_miles: number;
  availability: 'available' | 'busy' | 'unavailable';
}

interface LiveServicePricingDisplayProps {
  pricingData: PricingItem[];
  serviceCategory?: string;
  onBookService?: (handymanId: string, pricing: PricingItem) => void;
}

export const LiveServicePricingDisplay = ({ 
  pricingData, 
  serviceCategory,
  onBookService 
}: LiveServicePricingDisplayProps) => {
  if (pricingData.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-800 text-sm sm:text-base">
              Live Service Pricing {serviceCategory && `- ${serviceCategory}`}
            </span>
          </div>
          <Badge className="bg-blue-600 text-white self-start sm:ml-auto text-xs">
            {pricingData.length} Available Now
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {/* Mobile: Horizontal scrollable cards */}
        <div className="block sm:hidden">
          <div className="flex space-x-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
            {pricingData.slice(0, 9).map((pricing, index) => (
              <div key={index} className="flex-none w-72 snap-start">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{pricing.handyman_name}</h4>
                      <div className="flex items-center space-x-1.5 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-yellow-500 mr-0.5" />
                          <span>{pricing.rating.toFixed(1)}</span>
                        </div>
                        <span>•</span>
                        <span>{pricing.reviews_count} reviews</span>
                      </div>
                      {pricing.distance_miles > 0 && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3 mr-0.5" />
                          <span>{pricing.distance_miles.toFixed(1)} mi</span>
                        </div>
                      )}
                    </div>
                    <Badge 
                      className={`text-xs px-2 py-0.5 ${pricing.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {pricing.availability === 'available' ? 'Available' : 'Busy'}
                    </Badge>
                  </div>
                  
                  <Button 
                    onClick={() => onBookService?.(pricing.handyman_id, pricing)}
                    disabled={pricing.availability !== 'available'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                    size="sm"
                  >
                    {pricing.availability === 'available' ? 'Book Now' : 'Currently Busy'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop/Tablet: Grid layout */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pricingData.slice(0, 9).map((pricing, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{pricing.handyman_name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span>{pricing.rating.toFixed(1)}</span>
                    </div>
                    <span>•</span>
                    <span>{pricing.reviews_count} reviews</span>
                  </div>
                  {pricing.distance_miles > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{pricing.distance_miles.toFixed(1)} miles away</span>
                    </div>
                  )}
                </div>
                <Badge 
                  className={pricing.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                >
                  {pricing.availability === 'available' ? 'Available' : 'Busy'}
                </Badge>
              </div>
              
              <Button 
                onClick={() => onBookService?.(pricing.handyman_id, pricing)}
                disabled={pricing.availability !== 'available'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                {pricing.availability === 'available' ? 'Book Now' : 'Currently Busy'}
              </Button>
            </div>
          ))}
        </div>
        
        {pricingData.length > 9 && (
          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-blue-600">
              +{pricingData.length - 9} more professionals available
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
