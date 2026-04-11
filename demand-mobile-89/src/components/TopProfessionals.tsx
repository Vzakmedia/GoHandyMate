
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { useTopProfessionals } from "@/hooks/useTopProfessionals";
import { ProfessionalCarouselCard } from "@/components/top-professionals/ProfessionalCarouselCard";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { MapPin, Users } from "lucide-react";
import { ProfessionalsLoadingSkeleton } from "@/components/professionals/ProfessionalsLoadingSkeleton";

interface TopProfessionalsProps {
  showViewAllButton?: boolean;
  userRole?: 'customer' | 'property_manager';
}

export const TopProfessionals = ({
  showViewAllButton = true,
  userRole = 'customer'
}: TopProfessionalsProps) => {
  const navigate = useNavigate();
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

  if (loading) {
    return (
      <div className="px-4 py-6 space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Meet Our Top Handymen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProfessionalsLoadingSkeleton key={i} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Meet Our Top Contractors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProfessionalsLoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderCarousel = (professionals: typeof handymen, title: string, type: 'handyman' | 'contractor') => {
    if (professionals.length === 0) {
      return (
        <div className="mb-12">
          <div className="flex flex-col space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 text-green-800 text-[10px] font-black tracking-[0.2em] uppercase">
              <span className="w-8 h-[1px] bg-green-200"></span>
              Verified Experts
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{title}</h2>
          </div>

          <div className="bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 py-12 px-6 text-center">
            {!currentLocation ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto border border-black/5 text-[#166534]">
                  <MapPin className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Enable Location Access</p>
                  <p className="text-slate-500 text-sm">We'll show you the best {type}s currently in your area.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto border border-black/5 text-slate-400">
                  <Users className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Expanding Network</p>
                  <p className="text-slate-500 text-sm">No verified {type}s available at the moment in your area.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-12">
        <div className="flex items-end justify-between mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-green-800 text-[10px] font-black tracking-[0.2em] uppercase">
              <span className="w-8 h-[1px] bg-green-200"></span>
              Top Rated Near You
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{title}</h2>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{professionals.length} Experts</span>
          </div>
        </div>

        <ScrollArea className="w-full whitespace-nowrap -mx-4 px-4 overflow-visible">
          <div className="flex space-x-6 pb-6">
            {professionals.map((pro) => {
              const professionalWithDefaults = {
                ...pro,
                experienceYears: pro.experienceYears || 1,
                isSponsored: pro.isSponsored || false,
                isOnline: pro.isOnline || false
              };

              return (
                <ProfessionalCarouselCard
                  key={pro.id}
                  professional={professionalWithDefaults}
                  showDistance={!!currentLocation}
                />
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5 bg-slate-100" />
        </ScrollArea>

        {showViewAllButton && (
          <button
            onClick={() => navigate(`/professionals?type=${type}`)}
            className="w-full mt-4 h-12 bg-white border border-black/5 hover:border-[#166534]/30 hover:bg-[#166534]/5 text-[#166534] font-black uppercase text-[10px] tracking-widest rounded-[1.25rem] transition-all duration-300 transform active:scale-[0.98]"
          >
            Explore All {type === 'handyman' ? 'Handymen' : 'Contractors'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="py-2 space-y-4">
      {renderCarousel(handymen, "Luxury Handyman Services", "handyman")}
      <div className="h-[1px] w-full bg-slate-100/50 my-4"></div>
      {renderCarousel(contractors, "Specialist Contractors", "contractor")}
    </div>
  );
};
