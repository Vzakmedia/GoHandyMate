
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useLocationPermission } from '@/hooks/useLocationPermission';
import { useLocationTracking } from '@/hooks/useLocationTracking';

interface LocationEnableButtonProps {
  onLocationEnabled?: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export const LocationEnableButton = ({ 
  onLocationEnabled, 
  variant = 'default',
  size = 'default',
  className = ''
}: LocationEnableButtonProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { permissionState, requestPermission, showLocationInstructions } = useLocationPermission();
  const { startTracking } = useLocationTracking();

  const handleEnableLocation = async () => {
    setIsRequesting(true);
    
    try {
      const result = await requestPermission();
      
      if (result === 'granted') {
        // Start location tracking after permission is granted
        await startTracking();
        onLocationEnabled?.();
      } else {
        // Show instructions for manual enabling
        showLocationInstructions();
      }
    } catch (error) {
      console.error('Error enabling location:', error);
    } finally {
      setIsRequesting(false);
    }
  };

  if (permissionState === 'granted') {
    return (
      <Button 
        variant="outline" 
        size={size}
        className={`text-green-600 border-green-600 ${className}`}
        disabled
      >
        <MapPin className="w-4 h-4 mr-2" />
        Location Enabled
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleEnableLocation}
      disabled={isRequesting}
      variant={variant}
      size={size}
      className={className}
    >
      {isRequesting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <MapPin className="w-4 h-4 mr-2" />
      )}
      {isRequesting ? 'Requesting Location...' : 'Enable Location'}
    </Button>
  );
};
