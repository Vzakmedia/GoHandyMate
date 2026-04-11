import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Verified, CheckCircle2 } from "lucide-react";
import { HandymanProfileData } from "@/types/handyman";
import { useAuth } from '@/features/auth';
import { useHandymanData } from "@/hooks/useHandymanData";
import { useRealRatings } from "@/hooks/useRealRatings";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileInfoProps {
  profileData: HandymanProfileData;
  rating?: number;
  reviewCount?: number;
}

interface ServiceAreaInfo {
  name: string;
  state: string;
}

export const ProfileInfo = ({ profileData }: ProfileInfoProps) => {
  const { user } = useAuth();
  const { data: handymanData, loading } = useHandymanData();
  const { averageRating, totalReviews, loading: ratingsLoading } = useRealRatings(user?.id || '');
  const [serviceAreaDisplay, setServiceAreaDisplay] = useState<string>('Loading service areas...');

  // Function to get location info from zip code
  const getLocationFromZipCode = async (zipCode: string): Promise<ServiceAreaInfo | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipCode}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;

        let cityName = '';
        let stateName = '';
        let countyName = '';

        addressComponents.forEach((component: any) => {
          if (component.types.includes('locality')) {
            cityName = component.long_name;
          } else if (component.types.includes('administrative_area_level_1')) {
            stateName = component.short_name;
          } else if (component.types.includes('administrative_area_level_2')) {
            countyName = component.long_name.replace(' County', '');
          }
        });

        return {
          name: cityName || countyName || zipCode,
          state: stateName
        };
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
    return null;
  };

  // Load and format service areas
  useEffect(() => {
    const loadServiceAreas = async () => {
      if (!handymanData.workAreas || handymanData.workAreas.length === 0) {
        setServiceAreaDisplay('No service areas configured');
        return;
      }

      try {
        const areas: string[] = [];

        for (const workArea of handymanData.workAreas.slice(0, 3)) { // Show first 3 areas
          if (workArea.zip_code) {
            const locationInfo = await getLocationFromZipCode(workArea.zip_code);
            if (locationInfo) {
              areas.push(`${locationInfo.name}, ${locationInfo.state}`);
            } else {
              areas.push(workArea.zip_code);
            }
          } else if (workArea.area_name) {
            areas.push(workArea.area_name);
          }
        }

        if (areas.length > 0) {
          let display = areas.join(' • ');
          if (handymanData.workAreas.length > 3) {
            display += ` • +${handymanData.workAreas.length - 3} more`;
          }
          setServiceAreaDisplay(display);
        } else {
          setServiceAreaDisplay('Service areas active');
        }
      } catch (error) {
        console.error('Error loading service areas:', error);
        setServiceAreaDisplay(`${handymanData.workAreas.length} service areas`);
      }
    };

    if (!loading && handymanData.workAreas) {
      loadServiceAreas();
    }
  }, [handymanData.workAreas, loading]);

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Name and Title - Centered */}
      <div className="space-y-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {profileData.name}
          </h1>
          <Verified className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500 fill-emerald-50" />
        </div>
        <p className="text-[13px] font-black uppercase tracking-widest text-[#166534] flex items-center justify-center gap-2">
          <span>Professional Handyman</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20" />
          <span className="text-slate-400">GHM Gold Partner</span>
        </p>
      </div>

      {/* Real Rating Display - Centered */}
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-slate-50 border border-black/5">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < Math.floor(averageRating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-200 fill-slate-200'
                )}
              />
            ))}
          </div>
          <div className="w-[1px] h-4 bg-black/10" />
          <span className="text-[14px] font-bold text-slate-900">
            {ratingsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `${averageRating.toFixed(1)} (${totalReviews} Reviews)`
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest flex gap-2 items-center">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Professional
          </Badge>
          <Badge variant="outline" className="border-emerald-100 bg-white text-emerald-700 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">
            Available Today
          </Badge>
        </div>
      </div>

      {/* Location and Experience - Centered */}
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-2">
        <div className="flex items-center gap-2.5 text-slate-500 group transition-colors hover:text-slate-900">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-black/5">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold tracking-tight">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : serviceAreaDisplay}
          </span>
        </div>
        
        <div className="w-[1px] h-4 bg-black/5 hidden sm:block" />

        <div className="flex items-center gap-2.5 text-slate-500 group transition-colors hover:text-slate-900">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center border border-black/5">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold tracking-tight">{profileData.experience} Years Experience</span>
        </div>
      </div>
    </div>
  );
};
