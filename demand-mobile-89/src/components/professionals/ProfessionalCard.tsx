
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, CheckCircle2, Crown, ArrowRight } from 'lucide-react';
import { ProfessionalLocationInfo } from './ProfessionalLocationInfo';

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman';
  avatar_url?: string;
  subscription_plan?: string;
  account_status: string;
  created_at: string;
  handyman?: {
    hourly_rate?: number;
    skills?: string[];
    phone?: string;
    availability?: string;
  };
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
    is_active: boolean;
  }>;
  distance?: number;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  isSponsored: boolean;
  isOnline: boolean;
  lastSeen?: string;
  // Location data
  handyman_work_areas?: Array<{
    area_name: string;
    center_latitude: number;
    center_longitude: number;
    radius_miles: number;
  }>;
  handyman_locations?: {
    latitude: number;
    longitude: number;
    last_updated: string;
    is_active: boolean;
  };
}

interface ProfessionalCardProps {
  professional: Professional;
  showDistance?: boolean;
  isCarousel?: boolean;
  onContact?: (professional: Professional) => void;
  onViewProfile?: (professional: Professional) => void;
}

export const ProfessionalCard = ({
  professional,
  showDistance = true,
  isCarousel = false,
  onContact,
  onViewProfile
}: ProfessionalCardProps) => {
  const isPremium = professional.subscription_plan &&
    professional.subscription_plan !== 'free' &&
    professional.subscription_plan !== 'basic';

  const getHourlyRate = () => {
    if (professional.skill_rates && professional.skill_rates.length > 0) {
      const activeRates = professional.skill_rates.filter(rate => rate.is_active);
      if (activeRates.length > 0) {
        const avgRate = activeRates.reduce((sum, rate) => sum + rate.hourly_rate, 0) / activeRates.length;
        return `$${avgRate.toFixed(0)}/hr`;
      }
    }

    if (professional.handyman?.hourly_rate) {
      return `$${professional.handyman.hourly_rate}/hr`;
    }

    return 'Quote on request';
  };

  const isOnline = () => {
    if (professional.lastSeen) {
      const lastSeenTime = new Date(professional.lastSeen).getTime();
      const now = new Date().getTime();
      const fifteenMinutes = 15 * 60 * 1000;
      return (now - lastSeenTime) < fifteenMinutes;
    }
    return professional.isOnline;
  };

  return (
    <Card className={`group relative overflow-hidden rounded-[2rem] border border-black/5 bg-white hover:bg-[#FAFAF5] hover:shadow-2xl transition-all duration-500 cursor-pointer ${isCarousel ? 'w-full' : ''}`}>
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Section */}
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden border border-black/5 shadow-inner bg-slate-100 group-hover:scale-105 transition-transform duration-500">
              <img
                src={professional.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.id}`}
                alt={professional.full_name}
                className="w-full h-full object-cover"
              />
            </div>
            {isOnline() && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-[3px] border-white shadow-sm ring-2 ring-green-100 animate-pulse"></div>
            )}
            {isPremium && (
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center border-[3px] border-white shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                <Crown className="w-5 h-5 text-black" />
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-[#0A0A0A] group-hover:text-[#166534] transition-colors tracking-tight">
                    {professional.full_name}
                  </h3>
                  {professional.isSponsored && (
                    <span className="px-3 py-1 bg-[#fbbf24] text-black text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm">SPONSORED</span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <span>{professional.user_role}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{professional.experienceYears} Years Exp</span>
                </div>
              </div>
              <div className="text-right sm:text-right">
                <div className="text-2xl font-black text-[#166534]">
                  {getHourlyRate()}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate Est</div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-black/5">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#0A0A0A]">
                  <Star className="w-4 h-4 text-[#fbbf24] fill-[#fbbf24]" />
                  {professional.rating.toFixed(1)}
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Rating</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black text-[#0A0A0A]">
                  {professional.reviewCount}
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reviews</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-black text-[#0A0A0A] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  {professional.completedJobs}
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Jobs Done</div>
              </div>
              <div className="space-y-1">
                <ProfessionalLocationInfo
                  professional={professional}
                  showDistance={showDistance}
                />
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                onClick={() => onViewProfile?.(professional)}
                className="flex-1 h-14 bg-[#166534] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-[#14532d] hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
              >
                View Portfolio
                <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                onClick={() => onContact?.(professional)}
                className="flex-1 h-14 bg-white border-black/5 text-[#0A0A0A] rounded-2xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-slate-50 hover:border-black/10 transition-all"
              >
                <MessageSquare className="mr-2 w-4 h-4 text-[#166534]" />
                Inquire Now
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
