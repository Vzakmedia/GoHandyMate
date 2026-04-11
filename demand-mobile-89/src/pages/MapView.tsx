
import { GoogleMapView } from "@/components/maps/GoogleMapView";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackButton } from "@/components/navigation/BackButton";
import { MapPin, Users, Navigation, Activity, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function MapView() {
  const {
    currentLocation,
    isTracking,
    startTracking,
    stopTracking,
    settings,
    updateSettings,
    error,
    getCurrentLocation
  } = useLocationTracking();

  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Initialize location on mount
  useEffect(() => {
    const initializeLocation = async () => {
      if (!hasInitialized) {
        try {
          await getCurrentLocation();
        } catch (error) {
          console.error('Failed to get initial location:', error);
        } finally {
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    };

    initializeLocation();
  }, [getCurrentLocation, hasInitialized]);

  // Convert location format for map component
  const getMapLocation = () => {
    if (!currentLocation) return undefined;
    return {
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude
    };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <BackButton label="Back to Home" />
        
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Loading map and location services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Back Button */}
      <BackButton label="Back to Home" />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Map</h1>
          <p className="text-gray-600">Live tracking and nearby handymen</p>
        </div>
        <div className="flex items-center space-x-2">
          {currentLocation && (
            <Badge variant="outline" className="flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Location Active
            </Badge>
          )}
          {isTracking && (
            <Badge className="bg-green-500 animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Live Tracking
            </Badge>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-Time Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="w-5 h-5" />
            <span>Real-Time Location Services</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            onClick={() => isTracking ? stopTracking() : startTracking()}
            variant={isTracking ? "destructive" : "default"}
            className={isTracking ? "animate-pulse" : ""}
          >
            <Navigation className="w-4 h-4 mr-2" />
            {isTracking ? 'Stop Live Tracking' : 'Start Live Tracking'}
          </Button>
          
          {isTracking && (
            <Button
              onClick={() => updateSettings({ sharingEnabled: !settings.sharingEnabled })}
              variant={settings.sharingEnabled ? "default" : "outline"}
            >
              <Users className="w-4 h-4 mr-2" />
              {settings.sharingEnabled ? 'Sharing Location' : 'Share Location'}
            </Button>
          )}

          <Button
            onClick={() => updateSettings({ updateInterval: settings.updateInterval === 5000 ? 1000 : 5000 })}
            variant="outline"
            size="sm"
          >
            Update: {settings.updateInterval / 1000}s
          </Button>
        </CardContent>
      </Card>

      {/* Real-Time Map */}
      <GoogleMapView
        center={getMapLocation()}
        zoom={15}
        showHandymen={true}
        showTrafficLayer={true}
        height="600px"
        realTimeUpdates={true}
        className="w-full rounded-lg shadow-lg border"
      />

      {/* Live Location Info */}
      {currentLocation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className={`w-5 h-5 ${isTracking ? 'text-green-500 animate-pulse' : 'text-gray-500'}`} />
              <span>Live Location Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Latitude</p>
                <p className="font-mono text-lg">{currentLocation.latitude.toFixed(6)}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Longitude</p>
                <p className="font-mono text-lg">{currentLocation.longitude.toFixed(6)}</p>
              </div>
              {currentLocation.accuracy && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-lg">{currentLocation.accuracy.toFixed(0)}m</p>
                </div>
              )}
              {currentLocation.timestamp && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-sm">{new Date(currentLocation.timestamp).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
            
            {isTracking && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-600 animate-pulse" />
                  <span className="text-green-700 font-medium">Real-time tracking active</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Location updates every {settings.updateInterval / 1000} seconds
                  {settings.sharingEnabled && " • Sharing with other users"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
