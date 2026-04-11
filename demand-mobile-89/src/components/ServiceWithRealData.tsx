
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Clock, Star } from 'lucide-react';
import { RealTimeServiceProviders } from '@/components/RealTimeServiceProviders';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { GoogleMapView } from '@/components/maps/GoogleMapView';

interface ServiceWithRealDataProps {
  serviceName: string;
  serviceDescription: string;
  serviceIcon: React.ComponentType<{ className?: string }>;
  onViewAll?: () => void;
}

export const ServiceWithRealData = ({ 
  serviceName, 
  serviceDescription, 
  serviceIcon: Icon,
  onViewAll 
}: ServiceWithRealDataProps) => {
  const { currentLocation, startTracking, isTracking } = useLocationTracking();
  const [showMap, setShowMap] = useState(false);

  const handleEnableLocation = () => {
    startTracking();
  };

  return (
    <div className="space-y-6">
      {/* Service Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{serviceName}</h2>
                <p className="text-gray-600 text-sm">{serviceDescription}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              Live Pricing
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentLocation ? (
                <Badge variant="outline" className="text-green-600 border-green-300">
                  <MapPin className="w-3 h-3 mr-1" />
                  Location enabled
                </Badge>
              ) : (
                <Button 
                  onClick={handleEnableLocation}
                  variant="outline" 
                  size="sm"
                  className="text-green-600 border-green-300 hover:bg-green-50"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Enable Location for Better Results
                </Button>
              )}
              
              <Button 
                onClick={() => setShowMap(!showMap)}
                variant="ghost" 
                size="sm"
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
            </div>
            
            {onViewAll && (
              <Button onClick={onViewAll} variant="outline" size="sm">
                View All Professionals
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map View */}
      {showMap && currentLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Nearby Professionals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleMapView
              center={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
              }}
              zoom={13}
              showHandymen={true}
              height="400px"
              className="w-full h-96 rounded-lg"
            />
          </CardContent>
        </Card>
      )}

      {/* Real-time Service Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Available Professionals</span>
            </div>
            <Badge variant="outline">
              {currentLocation ? 'Near You' : 'All Areas'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RealTimeServiceProviders 
            serviceCategory={serviceName}
            maxResults={6}
            showDistance={!!currentLocation}
          />
        </CardContent>
      </Card>
    </div>
  );
};
