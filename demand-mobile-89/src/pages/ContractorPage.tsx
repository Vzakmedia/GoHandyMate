import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/features/auth';
import { useProfessionalsData } from "@/hooks/useProfessionalsData";
import { ProfessionalsFilters } from "@/components/professionals/ProfessionalsFilters";
import { ProfessionalGrid } from "@/components/professionals/ProfessionalGrid";
import { Professional } from "@/types/professional";
import { ArrowLeft } from "lucide-react";
import { LoadingScreen } from "@/components/LoadingScreen";
import { filterProfessionals, sortProfessionals } from "@/utils/professionalFiltering";
import { useLocationTracking } from "@/hooks/location/useLocationTracking";
import { useState } from "react";

export const ContractorPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'experience'>('rating');
  
  const { currentLocation } = useLocationTracking();
  const { professionals, loading, fetchProfessionals } = useProfessionalsData();

  // Convert location format
  const userLocation = currentLocation ? {
    lat: currentLocation.latitude,
    lng: currentLocation.longitude
  } : null;

  // Fetch contractors when component mounts or location changes
  useEffect(() => {
    console.log('Fetching contractors with location:', userLocation);
    fetchProfessionals('contractor', userLocation);
  }, [userLocation?.lat, userLocation?.lng, fetchProfessionals]);

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  // Filter and sort contractors
  const filteredContractors = sortProfessionals(
    filterProfessionals(professionals, searchTerm, 'contractor'),
    sortBy
  );

  // Ensure required properties for the Professional interface
  const contractors: Professional[] = filteredContractors.map(prof => ({
    ...prof,
    experienceYears: prof.experienceYears || 0,
    isSponsored: prof.isSponsored || false,
    isOnline: prof.isOnline || false,
    hasRealtimePricing: prof.hasRealtimePricing || false
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Find Contractors
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover licensed contractors for your renovation and construction projects
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-6">
        <ProfessionalsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resultsCount={contractors.length}
        />
      </div>

      {/* Professionals Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {contractors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No contractors found in your area. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProfessionalGrid professionals={contractors as any} />
          </div>
        )}
      </div>
    </div>
  );
};