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

export const HandymanPage = () => {
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

  // Fetch handymen when component mounts or location changes
  useEffect(() => {
    console.log('Fetching handymen with location:', userLocation);
    fetchProfessionals('handyman', userLocation);
  }, [userLocation?.lat, userLocation?.lng, fetchProfessionals]);

  if (authLoading || loading) {
    return <LoadingScreen />;
  }

  // Filter and sort handymen
  const filteredHandymen = sortProfessionals(
    filterProfessionals(professionals, searchTerm, 'handyman'),
    sortBy
  );

  // Ensure required properties for the Professional interface with real data
  const handymen: Professional[] = filteredHandymen.map(prof => ({
    ...prof,
    rating: (prof as any).average_rating || prof.rating || 0,
    reviewCount: (prof as any).total_ratings || prof.reviewCount || 0,
    completedJobs: (prof as any).jobs_this_month || prof.completedJobs || 0,
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
            Find Handymen
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover skilled handymen for all your repair and maintenance needs
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
          resultsCount={handymen.length}
        />
      </div>

      {/* Professionals Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {handymen.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No handymen found in your area. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProfessionalGrid professionals={handymen as any} />
          </div>
        )}
      </div>
    </div>
  );
};