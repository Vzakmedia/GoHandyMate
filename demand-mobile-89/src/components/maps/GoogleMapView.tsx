
import { useEffect, useRef, useState } from 'react';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { supabase } from '@/integrations/supabase/client';

interface GoogleMapViewProps {
  center?: { lat: number; lng: number } | { latitude: number; longitude: number };
  zoom?: number;
  markers?: Array<{
    lat: number;
    lng: number;
    title?: string;
  }>;
  className?: string;
  showHandymen?: boolean;
  showTrafficLayer?: boolean;
  height?: string;
  realTimeUpdates?: boolean;
}

export const GoogleMapView = ({ 
  center = { lat: 40.7128, lng: -74.0060 }, 
  zoom = 12, 
  markers = [],
  className = "w-full h-64 rounded-lg",
  showHandymen = false,
  showTrafficLayer = false,
  height = "400px",
  realTimeUpdates = false
}: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const handymenMarkersRef = useRef<any[]>([]);
  const [handymenLocations, setHandymenLocations] = useState<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  
  const { currentLocation, isTracking } = useLocationTracking();

  // Convert location format if needed
  const getMapCenter = () => {
    if ('lat' in center) {
      return center;
    } else {
      return { lat: center.latitude, lng: center.longitude };
    }
  };

  // Load nearby handymen when component mounts or location changes
  useEffect(() => {
    const loadNearbyHandymen = async () => {
      if (!currentLocation || !showHandymen) return;

      try {
        const { data, error } = await supabase.functions.invoke('location-tracking', {
          body: { 
            action: 'get-nearby-handymen',
            location: { 
              latitude: currentLocation.latitude, 
              longitude: currentLocation.longitude, 
              radius: 25 
            }
          }
        });

        if (error) {
          console.error('Error loading nearby handymen:', error);
          return;
        }

        console.log('Loaded nearby handymen:', data);
        setHandymenLocations(data || []);
      } catch (error) {
        console.error('Error loading nearby handymen:', error);
      }
    };

    loadNearbyHandymen();
  }, [currentLocation, showHandymen]);

  // Initialize map
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      // Check if Google Maps API is available
      if (typeof window.google === 'undefined' || !window.google.maps) {
        console.error('Google Maps API not loaded');
        setMapError('Google Maps API failed to load');
        return;
      }

      try {
        const mapCenter = getMapCenter();
        const map = new window.google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;

        // Add traffic layer if requested
        if (showTrafficLayer) {
          const trafficLayer = new window.google.maps.TrafficLayer();
          trafficLayer.setMap(map);
        }

        console.log('Google Map initialized successfully');
        setMapError(null);
      } catch (error) {
        console.error('Error initializing Google Map:', error);
        setMapError('Failed to initialize Google Map');
      }
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps API with proper error handling
      const loadGoogleMaps = async () => {
        try {
          // Get API key from Supabase secrets
          const response = await fetch('https://iexcqvcuzmmiruqcssdz.supabase.co/functions/v1/map-services/get-api-key', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGNxdmN1em1taXJ1cWNzc2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDU5NjcsImV4cCI6MjA2NjE4MTk2N30.G7BnxSnKEC7mDYEltnyFvntdpAID5AEGkdwFu8FfAyE`,
              'Content-Type': 'application/json'
            }
          });
          
          const apiKeyData = await response.json();
          
          if (!response.ok || !apiKeyData?.apiKey) {
            console.error('Failed to get Google Maps API key:', apiKeyData);
            setMapError('Google Maps API key not configured');
            return;
          }

          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeyData.apiKey}&libraries=places&callback=initGoogleMap`;
          script.async = true;
          script.defer = true;

          // Set up global callback
          (window as any).initGoogleMap = () => {
            console.log('Google Maps API loaded via callback');
            initMap();
          };

          // Handle script loading errors
          script.onerror = () => {
            console.error('Failed to load Google Maps script');
            setMapError('Failed to load Google Maps script');
          };

          document.head.appendChild(script);

          // Cleanup function
          return () => {
            if (document.head.contains(script)) {
              document.head.removeChild(script);
            }
            delete (window as any).initGoogleMap;
          };
        } catch (error) {
          console.error('Error loading Google Maps:', error);
          setMapError('Error loading Google Maps');
        }
      };

      loadGoogleMaps();
    }
  }, [center, zoom, showTrafficLayer]);

  // Update user's real-time location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !currentLocation || !realTimeUpdates) return;

    console.log('Updating user location marker:', currentLocation);

    // Remove existing user marker
    if (userMarkerRef.current) {
      if (userMarkerRef.current.marker) {
        userMarkerRef.current.marker.setMap(null);
      }
      if (userMarkerRef.current.circle) {
        userMarkerRef.current.circle.setMap(null);
      }
    }

    try {
      // Create new user location marker with pulsing animation
      const userMarker = new window.google.maps.Marker({
        position: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        map: mapInstanceRef.current,
        title: 'Your Location (Live)',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        animation: window.google.maps.Animation.BOUNCE,
      });

      // Add accuracy circle
      const accuracyCircle = new window.google.maps.Circle({
        strokeColor: '#4285F4',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        map: mapInstanceRef.current,
        center: { lat: currentLocation.latitude, lng: currentLocation.longitude },
        radius: currentLocation.accuracy || 50,
      });

      userMarkerRef.current = { marker: userMarker, circle: accuracyCircle };

      // Center map on user location if tracking
      if (isTracking) {
        mapInstanceRef.current.panTo({ lat: currentLocation.latitude, lng: currentLocation.longitude });
      }
    } catch (error) {
      console.error('Error updating user location marker:', error);
    }
  }, [currentLocation, realTimeUpdates, isTracking]);

  // Update handymen markers on map
  useEffect(() => {
    if (!mapInstanceRef.current || !showHandymen) return;

    console.log('Updating handymen markers:', handymenLocations);

    try {
      // Clear existing handymen markers
      handymenMarkersRef.current.forEach(marker => marker.setMap(null));
      handymenMarkersRef.current = [];

      // Add new handymen markers
      handymenLocations.forEach((handyman) => {
        if (!handyman.coordinates) return;

        const isOnline = handyman.is_online || false;
        const marker = new window.google.maps.Marker({
          position: { 
            lat: handyman.coordinates.latitude, 
            lng: handyman.coordinates.longitude 
          },
          map: mapInstanceRef.current,
          title: `${handyman.full_name} - ${isOnline ? 'Online' : 'Offline'}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: isOnline ? '#10B981' : '#6B7280',
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        });

        // Add info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-semibold text-sm">${handyman.full_name}</h3>
              <p class="text-xs text-gray-600">Plan: ${handyman.subscription_plan || 'Free'}</p>
              <p class="text-xs ${isOnline ? 'text-green-600' : 'text-gray-500'}">
                ${isOnline ? '🟢 Online' : '⚫ Offline'}
              </p>
              ${handyman.distance ? `<p class="text-xs text-blue-600">${handyman.distance} miles away</p>` : ''}
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
        });

        handymenMarkersRef.current.push(marker);
      });
    } catch (error) {
      console.error('Error updating handymen markers:', error);
    }
  }, [handymenLocations, showHandymen]);

  // Add static markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    try {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add new markers
      markers.forEach(marker => {
        const mapMarker = new window.google.maps.Marker({
          position: { lat: marker.lat, lng: marker.lng },
          map: mapInstanceRef.current,
          title: marker.title,
        });
        markersRef.current.push(mapMarker);
      });
    } catch (error) {
      console.error('Error adding static markers:', error);
    }
  }, [markers]);

  // Real-time handymen locations subscription
  useEffect(() => {
    if (!showHandymen || !realTimeUpdates) return;

    console.log('Setting up real-time handymen location subscription');

    const channel = supabase
      .channel('handymen-locations')
      .on('broadcast', { event: 'location-changed' }, (payload) => {
        console.log('Received handyman location update:', payload);
        // Update handymen markers in real-time
        setHandymenLocations(prev => {
          const updated = prev.filter(h => h.id !== payload.payload.userId);
          const newHandyman = {
            id: payload.payload.userId,
            full_name: 'Live Handyman',
            coordinates: payload.payload.location,
            is_online: true,
            subscription_plan: 'Unknown'
          };
          return [...updated, newHandyman];
        });
      })
      .subscribe();

    return () => {
      console.log('Cleaning up handymen location subscription');
      supabase.removeChannel(channel);
    };
  }, [showHandymen, realTimeUpdates]);

  // Show error state if Google Maps failed to load
  if (mapError) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg`} style={{ minHeight: height }}>
        <div className="text-center p-4">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-sm text-gray-600 mb-2">{mapError}</div>
          <div className="text-xs text-gray-500">
            Please check your Google Maps API configuration
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className={className}
        style={{ minHeight: height }}
      />
      {realTimeUpdates && isTracking && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
          🔴 Live Tracking
        </div>
      )}
      {showHandymen && handymenLocations.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs">
          {handymenLocations.length} handymen nearby
        </div>
      )}
    </div>
  );
};

declare global {
  interface Window {
    google: any;
  }
}
