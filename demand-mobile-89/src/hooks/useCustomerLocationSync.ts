
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

interface CustomerLocation {
  latitude: number;
  longitude: number;
  address: string;
  accuracy?: number;
}

export const useCustomerLocationSync = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [currentLocation, setCurrentLocation] = useState<CustomerLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Get current location from browser
  const getCurrentLocation = useCallback((): Promise<CustomerLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          try {
            // Reverse geocode to get address
            const { data: geocodeData, error } = await supabase.functions.invoke('map-services/reverse-geocode', {
              body: { latitude, longitude }
            });

            if (error) throw error;

            resolve({
              latitude,
              longitude,
              address: geocodeData.formatted_address,
              accuracy
            });
          } catch (error) {
            console.error('Error reverse geocoding:', error);
            resolve({
              latitude,
              longitude,
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              accuracy
            });
          }
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  // Update customer profile with new location
  const updateCustomerLocation = useCallback(async (location: CustomerLocation) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          address: location.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile to get updated data
      await refreshProfile();
      setLastUpdated(new Date());
      
      console.log('Customer location updated:', location.address);
    } catch (error) {
      console.error('Error updating customer location:', error);
      toast.error('Failed to update location');
    }
  }, [user, refreshProfile]);

  // Start real-time location tracking
  const startLocationTracking = useCallback(async () => {
    if (!user || user.user_metadata?.user_role !== 'customer') return;

    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setIsTracking(true);
      
      // Update profile immediately
      await updateCustomerLocation(location);
      
      toast.success('Location updated successfully');
    } catch (error) {
      console.error('Error starting location tracking:', error);
      toast.error('Failed to get current location');
    }
  }, [user, getCurrentLocation, updateCustomerLocation]);

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    setIsTracking(false);
    toast.success('Location tracking stopped');
  }, []);

  // Initialize location on mount
  useEffect(() => {
    if (profile?.address) {
      // If profile has address, try to get coordinates
      const geocodeAddress = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('map-services/geocode', {
            body: { address: profile.address }
          });

          if (!error && data) {
            setCurrentLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              address: profile.address
            });
          }
        } catch (error) {
          console.error('Error geocoding profile address:', error);
        }
      };

      geocodeAddress();
    }
  }, [profile?.address]);

  // Set up real-time profile updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('customer-profile-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`
        },
        (payload) => {
          console.log('Customer profile updated:', payload);
          if (payload.new.address !== payload.old.address) {
            // Address changed, update location
            setLastUpdated(new Date());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    currentLocation,
    isTracking,
    lastUpdated,
    startLocationTracking,
    stopLocationTracking,
    updateCustomerLocation
  };
};
