
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { toast } from 'sonner';

export const LocationPermissionBanner = () => {
  const { 
    currentLocation, 
    isTracking, 
    startTracking, 
    locationPermissionState 
  } = useLocationTracking();
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  const handleEnableLocation = async () => {
    setIsRequestingLocation(true);
    
    try {
      await startTracking();
      console.log('Location tracking started successfully');
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      toast.error('Failed to enable location. Please check your browser permissions.');
    } finally {
      setIsRequestingLocation(false);
    }
  };

  const handleRetryLocation = () => {
    handleEnableLocation();
  };

  // Don't show banner if location is already granted and we have location
  if (locationPermissionState === 'granted' && currentLocation) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Location Enabled</h3>
                <p className="text-sm text-green-600">
                  Showing professionals within 25 miles of your location
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Navigation className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show permission denied state
  if (locationPermissionState === 'denied') {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium text-orange-800">Location Access Blocked</h3>
                <p className="text-sm text-orange-600">
                  Enable location in your browser settings to see nearby professionals
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRetryLocation}
              disabled={isRequestingLocation}
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              {isRequestingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Trying...
                </>
              ) : (
                'Try Again'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show main permission request banner
  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Enable Location for Better Results</h3>
              <p className="text-blue-700 mt-1">
                We'll show professionals near you with accurate distances
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-blue-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Find nearby professionals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Accurate travel distances</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Faster response times</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={handleEnableLocation}
              disabled={isRequestingLocation}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isRequestingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Requesting...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Enable Location
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Your location is never shared with professionals
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
