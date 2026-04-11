
import { useState, useEffect } from 'react';
import { useMapServices } from "@/hooks/useMapServices";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { GoogleMapView } from "@/components/maps/GoogleMapView";
import { ServiceAreaSettings } from "./ServiceAreaSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationsAndMapsProps {
  isEditing: boolean;
  currentLocation?: LocationData;
  serviceAreas: string[];
  onServiceAreasChange: (areas: string[]) => void;
}

export const LocationsAndMaps = ({ 
  isEditing, 
  currentLocation, 
  serviceAreas, 
  onServiceAreasChange 
}: LocationsAndMapsProps) => {
  const [currentAddress, setCurrentAddress] = useState('');

  const { 
    geocodeAddress, 
    reverseGeocode, 
    loading 
  } = useMapServices();

  const {
    currentLocation: trackedLocation,
    isTracking,
    startTracking,
    stopTracking,
    settings,
    updateSettings
  } = useLocationTracking();

  // Use tracked location if available, otherwise fall back to prop
  const displayLocation = trackedLocation || currentLocation;

  // Convert location to map format
  const getMapLocation = () => {
    if (!displayLocation) return undefined;
    return {
      latitude: displayLocation.latitude,
      longitude: displayLocation.longitude
    };
  };

  useEffect(() => {
    if (displayLocation) {
      reverseGeocode(displayLocation.latitude, displayLocation.longitude)
        .then(result => {
          if (result) {
            setCurrentAddress(result.formatted_address);
          }
        });
    }
  }, [displayLocation, reverseGeocode]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <Tabs defaultValue="areas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="areas">Service Areas</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
        </TabsList>

        <TabsContent value="areas" className="space-y-6">
          <ServiceAreaSettings isEditing={isEditing} />
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          {/* Interactive Google Map */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Live Location & Service Areas</h3>
              <p className="text-sm text-gray-600">
                Track your location and view nearby opportunities
              </p>
            </div>
            <div className="p-4">
              <GoogleMapView
                center={getMapLocation()}
                zoom={13}
                showHandymen={true}
                showTrafficLayer={false}
                height="500px"
                realTimeUpdates={true}
                className="w-full"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
