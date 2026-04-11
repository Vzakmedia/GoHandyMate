
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Share2, Loader2, Wifi, WifiOff } from "lucide-react";

interface CurrentLocationCardProps {
  isEditing: boolean;
  currentAddress: string;
  onAddressChange: (address: string) => void;
  onLocationUpdate: (address: string) => void;
  loading: boolean;
  isTracking?: boolean;
  onTrackingToggle?: () => void;
  sharingEnabled?: boolean;
  onSharingToggle?: () => void;
}

export const CurrentLocationCard = ({
  isEditing,
  currentAddress,
  onAddressChange,
  onLocationUpdate,
  loading,
  isTracking = false,
  onTrackingToggle,
  sharingEnabled = false,
  onSharingToggle
}: CurrentLocationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Current Location</span>
          </div>
          <div className="flex items-center space-x-2">
            {isTracking && (
              <Badge variant="default" className="bg-green-500 text-white flex items-center space-x-1">
                <Wifi className="w-3 h-3" />
                <span>Live</span>
              </Badge>
            )}
            {!isTracking && currentAddress && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <WifiOff className="w-3 h-3" />
                <span>Offline</span>
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-address">Address</Label>
          <div className="flex space-x-2">
            <Input
              id="current-address"
              value={currentAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              placeholder="Enter your current address"
              disabled={!isEditing || loading}
            />
            {isEditing && (
              <Button
                onClick={() => onLocationUpdate(currentAddress)}
                disabled={loading || !currentAddress.trim()}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Update'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Real-time Location Status */}
        {isTracking && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Location updating in real-time</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Your location is being tracked and updated every few seconds
            </p>
          </div>
        )}

        {/* Location Tracking Controls */}
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4" />
              <Label htmlFor="location-tracking">Real-time Location Tracking</Label>
            </div>
            <Switch
              id="location-tracking"
              checked={isTracking}
              onCheckedChange={onTrackingToggle}
              disabled={!isEditing}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <Label htmlFor="location-sharing">Share Location with Customers</Label>
            </div>
            <Switch
              id="location-sharing"
              checked={sharingEnabled}
              onCheckedChange={onSharingToggle}
              disabled={!isEditing || !isTracking}
            />
          </div>

          {isTracking && (
            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded space-y-1">
              <p className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                <span>Your location is being tracked in real-time</span>
              </p>
              {sharingEnabled && (
                <p className="flex items-center space-x-1">
                  <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                  <span>Customers can see your approximate location</span>
                </p>
              )}
              <p className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                <span>Updates every 5 seconds for optimal accuracy</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
