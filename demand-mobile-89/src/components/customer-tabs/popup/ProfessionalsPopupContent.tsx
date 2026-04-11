
import { ProfessionalCard } from '@/components/service-category/ProfessionalCard';
import { ProfessionalsLoadingSkeleton } from '@/components/professionals/ProfessionalsLoadingSkeleton';
import { LocationPermissionBanner } from './LocationPermissionBanner';
import { EmptyProfessionalsState } from './EmptyProfessionalsState';
import { useEffect, useState } from 'react';

interface ProfessionalsPopupContentProps {
  loading: boolean;
  currentLocation: any;
  availableProfessionals: any[];
  serviceName: string;
  onBookProfessional: (professional: any) => void;
  onRefresh?: () => void;
}

export const ProfessionalsPopupContent = ({
  loading,
  currentLocation,
  availableProfessionals,
  serviceName,
  onBookProfessional,
  onRefresh
}: ProfessionalsPopupContentProps) => {
  const [shouldShowLocationBanner, setShouldShowLocationBanner] = useState(!currentLocation);

  useEffect(() => {
    setShouldShowLocationBanner(!currentLocation);
  }, [currentLocation]);

  const handleLocationEnabled = () => {
    setShouldShowLocationBanner(false);
    // Trigger refresh of professionals data
    setTimeout(() => {
      onRefresh?.();
    }, 1000);
  };

  const getExperienceYears = (professional: any) => {
    if (professional.handyman_data?.years_experience) {
      return professional.handyman_data.years_experience;
    }
    const createdAt = new Date(professional.created_at || new Date());
    const now = new Date();
    const yearsDiff = now.getFullYear() - createdAt.getFullYear();
    return Math.max(1, yearsDiff);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      {shouldShowLocationBanner && (
        <LocationPermissionBanner onLocationEnabled={handleLocationEnabled} />
      )}

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProfessionalsLoadingSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && availableProfessionals.length === 0 && (
        <EmptyProfessionalsState serviceName={serviceName} />
      )}

      {!loading && availableProfessionals.length > 0 && (
        <div className="space-y-4">
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>{availableProfessionals.length}</strong> professionals available for {serviceName}
              {currentLocation && ' near your location'}
            </p>
          </div>
          
          {availableProfessionals.map((professional) => {
            const professionalWithData = {
              ...professional,
              created_at: professional.created_at || new Date().toISOString(),
              experienceYears: getExperienceYears(professional),
              completedJobs: professional.completedJobs || 0,
              rating: professional.rating || 4.5,
              reviewCount: professional.reviewCount || 0,
              isSponsored: professional.isSponsored || false,
              isOnline: professional.isOnline || false,
              service_pricing: professional.service_pricing || []
            };

            return (
              <ProfessionalCard
                key={professional.id}
                professional={professionalWithData}
                serviceName={serviceName}
                onBook={onBookProfessional}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
