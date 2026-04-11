import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, Award, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useTopProfessionals } from "@/hooks/useTopProfessionals";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { ProfessionalCarouselCard } from "@/components/top-professionals/ProfessionalCarouselCard";
import { ProfessionalsLoadingSkeleton } from "@/components/professionals/ProfessionalsLoadingSkeleton";

export const ModernTopProfessionals = () => {
  const navigate = useNavigate();
  const handymenScrollRef = useRef<HTMLDivElement>(null);
  const contractorsScrollRef = useRef<HTMLDivElement>(null);
  
  const [handymenCanScrollLeft, setHandymenCanScrollLeft] = useState(false);
  const [handymenCanScrollRight, setHandymenCanScrollRight] = useState(true);
  const [contractorsCanScrollLeft, setContractorsCanScrollLeft] = useState(false);
  const [contractorsCanScrollRight, setContractorsCanScrollRight] = useState(true);
  
  const { currentLocation } = useLocationTracking();
  
  // Convert location format for the hook
  const userLocation = currentLocation ? {
    lat: currentLocation.latitude,
    lng: currentLocation.longitude
  } : null;

  const { professionals, loading } = useTopProfessionals({ 
    userLocation 
  });

  // Separate handymen and contractors
  const handymen = professionals.filter(p => p.user_role === 'handyman');
  const contractors = professionals.filter(p => p.user_role === 'contractor');

  const checkScrollButtons = (scrollRef: React.RefObject<HTMLDivElement>, setCanScrollLeft: (val: boolean) => void, setCanScrollRight: (val: boolean) => void) => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollLeft = (scrollRef: React.RefObject<HTMLDivElement>, setCanScrollLeft: (val: boolean) => void, setCanScrollRight: (val: boolean) => void) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
      setTimeout(() => checkScrollButtons(scrollRef, setCanScrollLeft, setCanScrollRight), 300);
    }
  };

  const scrollRight = (scrollRef: React.RefObject<HTMLDivElement>, setCanScrollLeft: (val: boolean) => void, setCanScrollRight: (val: boolean) => void) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
      setTimeout(() => checkScrollButtons(scrollRef, setCanScrollLeft, setCanScrollRight), 300);
    }
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Handymen Loading */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our{" "}
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Top Handymen
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProfessionalsLoadingSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* Contractors Loading */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Top Contractors
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <ProfessionalsLoadingSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const renderCarousel = (
    professionals: typeof handymen, 
    title: string, 
    titleGradient: string,
    type: 'handyman' | 'contractor',
    scrollRef: React.RefObject<HTMLDivElement>,
    canScrollLeft: boolean,
    canScrollRight: boolean,
    setCanScrollLeft: (val: boolean) => void,
    setCanScrollRight: (val: boolean) => void
  ) => {
    if (professionals.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          {!currentLocation ? (
            <>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">Enable location access to see nearby {type}s.</p>
              <p className="text-sm">We'll show you the best {type}s in your area.</p>
            </>
          ) : (
            <>
              <p className="text-lg mb-2">No verified {type}s available at the moment in your area.</p>
              <p className="text-sm">Check back soon as new {type}s join our platform daily.</p>
            </>
          )}
        </div>
      );
    }

    return (
      <div className="mb-8 sm:mb-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title.split(' ').slice(0, -2).join(' ')}{" "}
            <span className={titleGradient}>
              {title.split(' ').slice(-2).join(' ')}
            </span>
          </h2>
          
          {currentLocation && (
            <p className="text-sm text-gray-500 mb-4">
              Showing {professionals.length} {type === 'handyman' ? 'handymen' : 'contractors'} near you
            </p>
          )}

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 px-4">
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 shadow-sm border border-gray-100">
              <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-500 fill-current" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">4.9+ Rating</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 shadow-sm border border-gray-100">
              <Users className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">100+ Jobs</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 shadow-sm border border-gray-100">
              <Award className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Verified</span>
            </div>
          </div>
        </div>

        {/* Sliding Carousel with Navigation */}
        <div className="relative mb-8 sm:mb-12">
          {/* Navigation Buttons */}
          {professionals.length > 3 && (
            <>
              <button
                onClick={() => scrollLeft(scrollRef, setCanScrollLeft, setCanScrollRight)}
                disabled={!canScrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                  canScrollLeft 
                    ? 'hover:bg-gray-50 hover:shadow-xl text-gray-700 hover:text-gray-900' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={() => scrollRight(scrollRef, setCanScrollLeft, setCanScrollRight)}
                disabled={!canScrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center transition-all duration-200 ${
                  canScrollRight 
                    ? 'hover:bg-gray-50 hover:shadow-xl text-gray-700 hover:text-gray-900' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Scrollable Container */}
          <div 
            ref={scrollRef}
            onScroll={() => checkScrollButtons(scrollRef, setCanScrollLeft, setCanScrollRight)}
            className="overflow-x-auto scrollbar-hide px-8 sm:px-12 lg:px-16"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex space-x-4 sm:space-x-6 pb-4">
              {professionals.map((professional) => {
                const professionalWithDefaults = {
                  ...professional,
                  experienceYears: professional.experienceYears || 1,
                  isSponsored: professional.isSponsored || false,
                  isOnline: professional.isOnline || false
                };
                
                return (
                  <ProfessionalCarouselCard
                    key={professional.id}
                    professional={professionalWithDefaults}
                    showDistance={!!currentLocation}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="text-center px-4">
          <Button 
            onClick={() => navigate(`/professionals?type=${type}`)}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm sm:text-base"
          >
            View All {type === 'handyman' ? 'Handymen' : 'Contractors'} ({professionals.length} available)
            <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-4 sm:left-20 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-r from-green-200/30 to-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-4 sm:right-20 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm font-semibold mb-4 sm:mb-6 shadow-sm border border-orange-200">
            <Award className="w-4 sm:w-5 h-4 sm:h-5 animate-pulse" />
            <span className="text-xs sm:text-sm">Top Rated Professionals</span>
          </div>
        </div>

        {/* Handymen Section */}
        {renderCarousel(
          handymen, 
          "Meet Our Top Handymen", 
          "bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent",
          "handyman",
          handymenScrollRef,
          handymenCanScrollLeft,
          handymenCanScrollRight,
          setHandymenCanScrollLeft,
          setHandymenCanScrollRight
        )}

        {/* Contractors Section */}
        {renderCarousel(
          contractors, 
          "Meet Our Top Contractors", 
          "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent",
          "contractor",
          contractorsScrollRef,
          contractorsCanScrollLeft,
          contractorsCanScrollRight,
          setContractorsCanScrollLeft,
          setContractorsCanScrollRight
        )}

        {/* Enhanced Call to Action */}
        <div className="text-center px-4">
          <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 max-w-4xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to find your perfect professional?
            </h3>
            <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Browse hundreds more verified professionals in your area. Compare ratings, prices, and availability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/professionals')}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0 text-sm sm:text-base"
              >
                View All Professionals
                <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
              </Button>
              
              <Button 
                onClick={() => navigate('/professionals?type=contractor')}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
              >
                Find Contractors
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
