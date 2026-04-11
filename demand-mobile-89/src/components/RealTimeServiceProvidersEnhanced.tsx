
import { useProfessionalsIntegrated } from '@/hooks/useProfessionalsIntegrated';
import { ProfessionalGrid } from '@/components/professionals/ProfessionalGrid';
import { EmptyProfessionalsState } from '@/components/professionals/EmptyProfessionalsState';
import { ProfessionalsLoadingSkeleton } from '@/components/professionals/ProfessionalsLoadingSkeleton';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { CustomerLocationCard } from '@/components/customer/CustomerLocationCard';
import { LiveServicePricingDisplay } from '@/components/customer/LiveServicePricingDisplay';
import { useAuth } from '@/features/auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { useState } from 'react';

interface RealTimeServiceProvidersEnhancedProps {
  serviceCategory?: string;
  maxResults?: number;
  showDistance?: boolean;
  userRole?: 'customer' | 'property_manager';
}

export const RealTimeServiceProvidersEnhanced = ({ 
  serviceCategory, 
  maxResults = 6,
  showDistance = true,
  userRole = 'customer'
}: RealTimeServiceProvidersEnhancedProps) => {
  const { user } = useAuth();
  const { currentLocation } = useLocationTracking();
  const [debugMode, setDebugMode] = useState(false);
  
  // Convert location format for useProfessionalsIntegrated hook
  const userLocation = currentLocation ? {
    lat: currentLocation.latitude,
    lng: currentLocation.longitude
  } : null;

  const { professionals, loading, hasLocation, pricingData, refetch } = useProfessionalsIntegrated({
    serviceCategory,
    maxResults,
    userLocation
  });

  console.log('RealTimeServiceProvidersEnhanced - DETAILED DEBUG:', {
    serviceCategory,
    professionalsReceived: professionals.length,
    loading,
    hasLocation,
    userLocation,
    professionalsData: professionals.map(p => ({ 
      id: p.id, 
      name: p.full_name,
      user_role: p.user_role,
      account_status: p.account_status,
      subscription_status: p.subscription_status,
      service_pricing_count: p.service_pricing?.length || 0,
      skill_rates_count: p.skill_rates?.length || 0,
      hasRealtimePricing: p.hasRealtimePricing,
      rating: p.rating,
      reviewCount: p.reviewCount,
      averageRate: p.averageRate
    })),
    pricingDataCount: pricingData.length
  });

  const handleBookService = (handymanId: string, pricing: any) => {
    const serviceParam = encodeURIComponent(serviceCategory || 'service');
    window.location.href = `/book/${handymanId}?service=${serviceParam}&price=${pricing.custom_price || pricing.base_price}`;
    toast.success(`Booking ${pricing.handyman_name} for ${serviceCategory || 'service'}`);
  };

  // Use ALL professionals returned from the backend - NO FILTERING AT ALL
  const displayProfessionals = professionals;
  const professionalsWithRealtimePricing = displayProfessionals.filter(p => p.hasRealtimePricing || p.service_pricing?.length > 0);

  console.log('RealTimeServiceProvidersEnhanced - FINAL RENDER DECISION:', {
    totalProfessionals: professionals.length,
    displayProfessionals: displayProfessionals.length,
    withRealtimePricing: professionalsWithRealtimePricing.length,
    willShowGrid: !loading && displayProfessionals.length > 0,
    willShowEmpty: !loading && displayProfessionals.length === 0,
    loading
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        {/* Debug Panel */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDebugMode(!debugMode)}
            className="text-xs"
          >
            {debugMode ? 'Hide' : 'Show'} Debug Info
          </Button>
        </div>

        {debugMode && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <h4 className="font-semibold text-yellow-800 mb-2">Debug Information</h4>
            <div className="space-y-1 text-yellow-700">
              <p>Service Category: {serviceCategory || 'None'}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
              <p>Has Location: {hasLocation ? 'Yes' : 'No'}</p>
              <p>Professionals from Backend: {professionals.length}</p>
              <p>Display Professionals: {displayProfessionals.length}</p>
              <p>Pricing Data: {pricingData.length}</p>
              <p>With Realtime Pricing: {professionalsWithRealtimePricing.length}</p>
              <div className="mt-2">
                <p className="font-medium">Professional Details:</p>
                {professionals.map(p => (
                  <div key={p.id} className="ml-2 text-xs bg-white p-2 rounded mb-1">
                    <p><strong>{p.full_name}</strong> ({p.user_role})</p>
                    <p>Status: {p.account_status} | Sub: {p.subscription_status}</p>
                    <p>Service Pricing: {p.service_pricing?.length || 0} items</p>
                    <p>Skill Rates: {p.skill_rates?.length || 0} items</p>
                    <p>Rating: {p.rating} | Reviews: {p.reviewCount}</p>
                    <p>Average Rate: ${p.averageRate || 'N/A'}</p>
                    <p>Has Realtime: {p.hasRealtimePricing ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Status Display */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {serviceCategory || 'Professional Services'}
            </h2>
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>

          {/* Real-time Status Indicators */}
          <div className="flex flex-wrap gap-2 mb-4">
            {loading && (
              <Badge className="bg-blue-100 text-blue-800">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Searching...
              </Badge>
            )}
            
            {!loading && hasLocation && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Location Enabled
              </Badge>
            )}
            
            {!loading && !hasLocation && (
              <Badge className="bg-orange-100 text-orange-800">
                <AlertCircle className="w-3 h-3 mr-1" />
                No Location
              </Badge>
            )}
            
            {pricingData.length > 0 && (
              <Badge className="bg-purple-100 text-purple-800">
                <Zap className="w-3 h-3 mr-1" />
                {pricingData.length} Live Pricing Active
              </Badge>
            )}
          </div>

          {/* Results Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{displayProfessionals.length}</div>
                <div className="text-sm text-gray-600">Total Professionals</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{professionalsWithRealtimePricing.length}</div>
                <div className="text-sm text-gray-600">With Live Pricing</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{pricingData.length}</div>
                <div className="text-sm text-gray-600">Active Quotes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Location Card */}
        {user?.user_metadata?.user_role === 'customer' && (
          <CustomerLocationCard />
        )}

        {/* Live Service Pricing Display */}
        <LiveServicePricingDisplay 
          pricingData={pricingData}
          serviceCategory={serviceCategory}
          onBookService={handleBookService}
        />

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-full">
                <ProfessionalsLoadingSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Empty State - Only show if truly no professionals AND not loading */}
        {!loading && displayProfessionals.length === 0 && (
          <div className="text-center py-12">
            <EmptyProfessionalsState 
              serviceCategory={serviceCategory} 
              showLocationMessage={!hasLocation}
              hasLocation={hasLocation}
              onRetry={refetch}
            />
          </div>
        )}

        {/* Professionals Grid - Show if we have ANY professionals */}
        {!loading && displayProfessionals.length > 0 && (
          <>
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800">
                    Found {displayProfessionals.length} Professional{displayProfessionals.length !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-sm text-green-700">
                    {serviceCategory && `Specialists in ${serviceCategory}`}
                    {hasLocation && ' within 50 miles of your location'}
                  </p>
                </div>
                {professionalsWithRealtimePricing.length > 0 && (
                  <Badge className="bg-green-600 text-white">
                    <Zap className="w-3 h-3 mr-1" />
                    {professionalsWithRealtimePricing.length} Live Sync
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProfessionals.map((professional) => {
                const professionalWithDefaults = {
                  ...professional,
                  created_at: professional.created_at || new Date().toISOString(),
                  account_status: professional.account_status || 'active',
                  completedJobs: (professional as any).jobs_this_month || professional.completedJobs || 0,
                  rating: (professional as any).average_rating || professional.rating || 0,
                  reviewCount: (professional as any).total_ratings || professional.reviewCount || 0,
                  experienceYears: professional.experienceYears || Math.floor(Math.random() * 10) + 1,
                  isSponsored: professional.isSponsored || false,
                  isOnline: professional.isOnline || Math.random() > 0.5,
                  hasRealtimePricing: professional.hasRealtimePricing || (professional.service_pricing?.length > 0)
                };

                console.log('RealTimeServiceProvidersEnhanced - RENDERING PROFESSIONAL:', {
                  id: professional.id,
                  name: professional.full_name,
                  hasRealtimePricing: professionalWithDefaults.hasRealtimePricing,
                  servicePricingCount: professional.service_pricing?.length || 0,
                  skillRatesCount: professional.skill_rates?.length || 0
                });

                return (
                  <ProfessionalGrid 
                    key={professional.id}
                    professionals={[professionalWithDefaults]} 
                    showDistance={showDistance && hasLocation}
                    isCarousel={false}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
