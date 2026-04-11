
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Wifi } from "lucide-react";
import { useCustomerLocationSync } from "@/hooks/useCustomerLocationSync";
import { useAuth } from '@/features/auth';

export const CustomerLocationCard = () => {
  const { profile } = useAuth();
  const {
    currentLocation,
    lastUpdated
  } = useCustomerLocationSync();

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Your Location</span>
          </div>
          <Badge variant="default" className="bg-green-500 text-white flex items-center space-x-1">
            <Wifi className="w-3 h-3" />
            <span>Active (50 mile radius)</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm font-medium">Service Area:</div>
          <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
            {currentLocation?.address || profile?.address || 'Detecting your location...'}
          </div>
        </div>

        {currentLocation && (
          <div className="text-xs text-gray-500 flex items-center space-x-2">
            <Navigation className="w-3 h-3" />
            <span>
              {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
            </span>
            {currentLocation.accuracy && (
              <span>(±{Math.round(currentLocation.accuracy)}m)</span>
            )}
          </div>
        )}

        {lastUpdated && (
          <div className="text-xs text-green-600">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
          <p>📍 Automatically showing professionals within 50 miles of your location.</p>
          <p>🔒 Your exact location is private and only used for distance calculations.</p>
          <p>✅ Location service is permanently enabled for better results.</p>
        </div>
      </CardContent>
    </Card>
  );
};
