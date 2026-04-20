
import { LoadingScreen } from '@/components/LoadingScreen';
import { ProfessionalsFilters } from '@/components/professionals/ProfessionalsFilters';
import { ProfessionalsTypeSelector } from '@/components/professionals/ProfessionalsTypeSelector';
import { ProfessionalsList } from '@/components/professionals/ProfessionalsList';
import { EmptyProfessionalsState } from '@/components/professionals/EmptyProfessionalsState';
import { CustomerLocationCard } from '@/components/customer/CustomerLocationCard';
import { useProfessionalsIntegrated } from '@/hooks/useProfessionalsIntegrated';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { filterProfessionals, sortProfessionals } from '@/utils/professionalFiltering';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { MapPin, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const Professionals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'experience'>('rating');
  const [selectedType, setSelectedType] = useState<'handyman' | 'all'>('all');

  const { currentLocation } = useLocationTracking();

  // Convert location format
  const userLocation = currentLocation ? {
    lat: currentLocation.latitude,
    lng: currentLocation.longitude
  } : null;

  // Get search parameters
  const searchQuery = searchParams.get('search');
  const categoryParam = searchParams.get('category');
  const serviceParam = searchParams.get('service');

  // Determine the service name for filtering
  const serviceName = searchQuery || serviceParam || categoryParam || '';

  const { professionals, loading, hasLocation, pricingData } = useProfessionalsIntegrated({
    serviceCategory: serviceName,
    maxResults: 50,
    userLocation,
    selectedType
  });

  // Initialize search term from URL params
  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  // Filter and sort professionals using utility functions
  const filteredProfessionals = filterProfessionals(professionals, searchTerm, selectedType);
  const sortedProfessionals = sortProfessionals(filteredProfessionals, sortBy);

  // Ensure all professionals have required properties with fallbacks
  const professionalsWithDefaults = sortedProfessionals.map(professional => ({
    ...professional,
    experienceYears: professional.experienceYears || 1,
    isSponsored: professional.isSponsored || false,
    isOnline: professional.isOnline || false,
    hasRealtimePricing: professional.hasRealtimePricing || false
  }));

  const hasResults = professionalsWithDefaults.length > 0;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#166534] hover:opacity-70 transition-opacity group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Professionals</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Customer Location Card - only show for customers */}
        {user?.user_metadata?.user_role === 'customer' && (
          <div className="mb-10">
            <CustomerLocationCard />
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="lg:w-8/12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-green-100 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-green-600" />
              TOP RATED PROS
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
              Local Expertise, <br />
              <span className="text-green-800">Delivered to Your Door.</span>
            </h2>
          </div>

          {/* Location Status */}
          <div className="flex items-center text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-2xl border border-black/5 shadow-sm">
            <MapPin className="w-4 h-4 mr-2 text-green-600" />
            <span>
              {userLocation ? (
                <>Within 50 miles • {professionalsWithDefaults.length} found</>
              ) : (
                <>{professionalsWithDefaults.length} available professionals</>
              )}
            </span>
          </div>
        </div>

        {/* Show message if no location but we have results */}
        {!userLocation && hasResults && (
          <div className="mb-10 p-6 bg-blue-50/50 backdrop-blur-sm border border-blue-100 rounded-[2rem] shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-blue-900 tracking-tight">Enable location for better results</p>
                <p className="text-blue-700/80 text-sm font-medium">We're showing available professionals, but enabling location will show you the closest ones first with accurate distances.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <ProfessionalsFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                resultsCount={professionalsWithDefaults.length}
              />

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Professional Type</h4>
                <ProfessionalsTypeSelector
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                />
              </div>
            </div>
          </aside>

          <main className="lg:col-span-8">
            {hasResults ? (
              <ProfessionalsList
                professionals={professionalsWithDefaults}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            ) : (
              <EmptyProfessionalsState
                showLocationMessage={!userLocation}
                hasLocation={!!userLocation}
              />
            )
            }
          </main>
        </div>
      </div>
    </div>
  );
};

export default Professionals;
