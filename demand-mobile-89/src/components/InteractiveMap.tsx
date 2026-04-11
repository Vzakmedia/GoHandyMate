
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useMapServices } from '@/hooks/useMapServices';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Users, 
  Clock,
  Star,
  Phone,
  Mail,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface HandymanMarker {
  id: string;
  full_name: string;
  email: string;
  subscription_plan: string;
  distance: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface ServiceAreaData {
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  coverage: {
    square_miles: number;
    estimated_customers: number;
    avg_job_distance: number;
  };
}

export const InteractiveMap = () => {
  const [searchAddress, setSearchAddress] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [searchRadius, setSearchRadius] = useState([25]);
  const [nearbyHandymen, setNearbyHandymen] = useState<HandymanMarker[]>([]);
  const [selectedHandyman, setSelectedHandyman] = useState<HandymanMarker | null>(null);
  const [serviceArea, setServiceArea] = useState<ServiceAreaData | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const { isMobile, isTablet, screenWidth } = useResponsiveBreakpoints();
  
  const { 
    loading, 
    error, 
    findNearbyHandymen, 
    geocodeAddress, 
    reverseGeocode,
    getServiceArea 
  } = useMapServices();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationPermission('granted');
          handleReverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
          // Default to NYC coordinates
          setCurrentLocation({
            latitude: 40.7128,
            longitude: -74.0060
          });
        }
      );
    }
  }, []);

  // Search for nearby handymen when location or radius changes
  useEffect(() => {
    if (currentLocation) {
      handleFindNearbyHandymen();
    }
  }, [currentLocation, searchRadius]);

  const handleReverseGeocode = async (lat: number, lng: number) => {
    const address = await reverseGeocode(lat, lng);
    if (address) {
      console.log('Current address:', address);
    }
  };

  const handleFindNearbyHandymen = async () => {
    if (!currentLocation) return;
    
    try {
      const handymen = await findNearbyHandymen(
        currentLocation.latitude,
        currentLocation.longitude,
        searchRadius[0]
      );
      setNearbyHandymen(handymen);
    } catch (err) {
      console.error('Error finding handymen:', err);
    }
  };

  const handleAddressSearch = async () => {
    if (!searchAddress.trim()) return;
    
    const location = await geocodeAddress(searchAddress);
    if (location) {
      setCurrentLocation({
        latitude: location.latitude,
        longitude: location.longitude
      });
    }
  };

  const handleGetServiceArea = async (userId: string) => {
    const area = await getServiceArea(userId);
    if (area) {
      setServiceArea(area);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter': return 'bg-blue-500';
      case 'pro': return 'bg-green-500';
      case 'elite': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getMapHeight = () => {
    if (isMobile) return 'h-64';
    if (isTablet) return 'h-80';
    return 'h-96';
  };

  const getGridCols = () => {
    if (isMobile) return 'grid-cols-4';
    if (isTablet) return 'grid-cols-6';
    return 'grid-cols-8';
  };

  const getGridRows = () => {
    if (isMobile) return 'grid-rows-4';
    if (isTablet) return 'grid-rows-5';
    return 'grid-rows-6';
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-6">
      {/* Search Controls */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Find Handymen Near You</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              placeholder="Enter address or zip code"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
              className="text-sm sm:text-base"
            />
            <Button 
              onClick={handleAddressSearch} 
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center space-x-1"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span className="sm:hidden">Search</span>
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">
              Search Radius: {searchRadius[0]} miles
            </label>
            <Slider
              value={searchRadius}
              onValueChange={setSearchRadius}
              max={50}
              min={5}
              step={5}
              className="w-full"
            />
          </div>

          {/* Location Status */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm">
            {locationPermission === 'granted' ? (
              <>
                <Navigation className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-green-600">Location enabled</span>
              </>
            ) : locationPermission === 'denied' ? (
              <>
                <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                <span className="text-orange-600">Using default location (NYC)</span>
              </>
            ) : (
              <>
                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                <span className="text-gray-600">Getting location...</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Service Area Info */}
      {serviceArea && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base text-blue-800">Service Area Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex flex-col">
                <span className="font-medium text-blue-700">Coverage</span>
                <span className="text-blue-600">{serviceArea.coverage.square_miles.toFixed(0)} sq mi</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-blue-700">Est. Customers</span>
                <span className="text-blue-600">{serviceArea.coverage.estimated_customers.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-blue-700">Avg Distance</span>
                <span className="text-blue-600">{serviceArea.coverage.avg_job_distance} miles</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Placeholder */}
      <Card>
        <CardContent className="p-3 sm:p-6">
          <div className={`bg-gray-100 rounded-lg ${getMapHeight()} flex items-center justify-center relative overflow-hidden`}>
            {/* Map background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className={`grid ${getGridCols()} ${getGridRows()} h-full`}>
                {Array.from({ length: isMobile ? 16 : isTablet ? 30 : 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>
            </div>
            
            {/* Current location marker */}
            {currentLocation && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-red-500 rounded-full p-1 sm:p-2 shadow-lg animate-pulse">
                  <Navigation className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="text-2xs sm:text-xs mt-1 bg-white px-1 sm:px-2 py-0.5 sm:py-1 rounded shadow whitespace-nowrap">
                  You are here
                </div>
              </div>
            )}
            
            {/* Service area radius visualization */}
            {serviceArea && (
              <div 
                className="absolute border-2 border-blue-300 border-dashed rounded-full opacity-50"
                style={{
                  width: `${Math.min(searchRadius[0] * 4, isMobile ? 120 : 200)}px`,
                  height: `${Math.min(searchRadius[0] * 4, isMobile ? 120 : 200)}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            )}
            
            {/* Handyman markers */}
            {nearbyHandymen.map((handyman, index) => (
              <div
                key={handyman.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                  selectedHandyman?.id === handyman.id ? 'z-10' : 'z-0'
                }`}
                style={{
                  top: `${45 + (index % 3 - 1) * (isMobile ? 10 : 15)}%`,
                  left: `${45 + (index % 4 - 1.5) * (isMobile ? 10 : 15)}%`
                }}
                onClick={() => setSelectedHandyman(handyman)}
              >
                <div className={`${getPlanColor(handyman.subscription_plan)} rounded-full p-1 sm:p-2 shadow-lg hover:shadow-xl transition-shadow`}>
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                {selectedHandyman?.id === handyman.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 sm:mt-2 bg-white p-2 sm:p-3 rounded-lg shadow-lg border min-w-32 sm:min-w-48 z-20">
                    <div className="text-xs sm:text-sm font-medium truncate">{handyman.full_name}</div>
                    <div className="text-2xs sm:text-xs text-gray-600 flex items-center mt-1">
                      <MapPin className="w-2 h-2 sm:w-3 sm:h-3 mr-1 flex-shrink-0" />
                      {handyman.distance.toFixed(1)} miles away
                    </div>
                    <Badge className={`${getPlanColor(handyman.subscription_plan)} text-white text-2xs sm:text-xs mt-1`}>
                      {handyman.subscription_plan}
                    </Badge>
                    <Button 
                      size="sm" 
                      className="w-full mt-2 text-2xs sm:text-xs py-1"
                      onClick={() => handleGetServiceArea(handyman.id)}
                    >
                      View Service Area
                    </Button>
                  </div>
                )}
              </div>
            ))}
            
            {!currentLocation && !loading && (
              <div className="text-center text-gray-500 p-4">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="text-xs sm:text-sm">Enable location access to see nearby handymen</p>
              </div>
            )}

            {loading && (
              <div className="text-center text-gray-500 p-4">
                <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 animate-spin" />
                <p className="text-xs sm:text-sm">Loading map data...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      {nearbyHandymen.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Nearby Handymen ({nearbyHandymen.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {nearbyHandymen.map((handyman) => (
                <div 
                  key={handyman.id}
                  className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedHandyman?.id === handyman.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedHandyman(handyman)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                        <h3 className="font-medium text-sm sm:text-base">{handyman.full_name}</h3>
                        <Badge className={`${getPlanColor(handyman.subscription_plan)} text-white self-start text-2xs sm:text-xs`}>
                          {handyman.subscription_plan}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {handyman.distance.toFixed(1)} miles
                        </div>
                        <div className="flex items-center">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-500" />
                          4.8
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Available
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs sm:text-sm">
                        <div className="flex items-center text-blue-600 truncate">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{handyman.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2">
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none text-xs">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" className="flex-1 sm:flex-none text-xs">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-red-600 text-xs sm:text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Stats */}
      {nearbyHandymen.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
              <div>
                <div className="text-lg sm:text-2xl font-bold text-green-600">{nearbyHandymen.length}</div>
                <div className="text-2xs sm:text-xs text-green-700">Available</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-green-600">{searchRadius[0]}</div>
                <div className="text-2xs sm:text-xs text-green-700">Mile Radius</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {nearbyHandymen.filter(h => h.subscription_plan === 'pro' || h.subscription_plan === 'elite').length}
                </div>
                <div className="text-2xs sm:text-xs text-green-700">Premium</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold text-green-600">
                  {Math.round(nearbyHandymen.reduce((acc, h) => acc + h.distance, 0) / nearbyHandymen.length)}
                </div>
                <div className="text-2xs sm:text-xs text-green-700">Avg Distance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
