
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, MapPin, CheckCircle } from "lucide-react";
import { expandedServiceCategories } from "@/data/expandedServiceCategories";

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman';
  avatar_url?: string;
  subscription_plan?: string;
  handyman?: {
    hourly_rate?: number;
    availability?: string;
  };
  // Updated to use service pricing instead of skills
  service_pricing?: Array<{
    category_id: string;
    subcategory_id?: string;
    base_price: number;
    custom_price?: number;
    is_active: boolean;
  }>;
  distance?: number;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  lastSeen?: string;
}

interface ProfessionalCarouselCardProps {
  professional: Professional;
  showDistance?: boolean;
}

export const ProfessionalCarouselCard = ({
  professional,
  showDistance = false
}: ProfessionalCarouselCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const isPremium = professional.subscription_plan &&
    professional.subscription_plan !== 'free' &&
    professional.subscription_plan !== 'basic';

  // Get active services from service pricing
  const getActiveServices = () => {
    if (!professional.service_pricing) return [];

    const activeServices = professional.service_pricing.filter(service => service.is_active);

    return activeServices.slice(0, 2).map(service => {
      const category = expandedServiceCategories.find(cat => cat.id === service.category_id);
      if (!category) return service.category_id;

      if (service.subcategory_id) {
        const subcategory = category.subcategories.find(sub => sub.id === service.subcategory_id);
        return subcategory ? subcategory.name : category.name;
      }

      return category.name;
    });
  };

  const activeServices = getActiveServices();
  const totalActiveServices = professional.service_pricing?.filter(service => service.is_active).length || 0;

  return (
    <Card className="w-72 flex-shrink-0 rounded-[2rem] border border-black/5 hover:scale-[1.02] transition-all duration-500 bg-white group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16 rounded-2xl ring-4 ring-slate-50 border border-black/5 group-hover:scale-105 transition-transform duration-500">
                <AvatarImage src={professional.avatar_url} className="object-cover" />
                <AvatarFallback className="bg-slate-100 text-[#166534] font-black">{getInitials(professional.full_name)}</AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${professional.isOnline ? 'bg-green-500' : 'bg-slate-300'
                }`} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5 mb-0.5">
                <h3 className="font-black text-slate-900 text-sm truncate uppercase tracking-tight">{professional.full_name}</h3>
                {isPremium && (
                  <CheckCircle className="h-3.5 w-3.5 text-blue-500 flex-shrink-0 fill-blue-50" />
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="secondary" className="bg-[#166534]/5 text-[#166534] border-none text-[8px] font-black uppercase tracking-widest px-1.5 h-4">
                  {professional.user_role}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5 px-1">
          <div className="flex items-center space-x-1 bg-amber-50/50 px-2 py-1 rounded-full border border-amber-100/50">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-black text-amber-900">{professional.rating.toFixed(1)}</span>
            <span className="text-[10px] font-medium text-amber-800/60 font-black">({professional.reviewCount})</span>
          </div>

          {showDistance && professional.distance && (
            <div className="flex items-center space-x-1 text-[#166534] font-black">
              <MapPin className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-widest">{professional.distance.toFixed(1)} mi</span>
            </div>
          )}
        </div>

        {activeServices.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {activeServices.map((serviceName, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-[9px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 border-black/5 px-2 py-0.5"
                >
                  {serviceName}
                </Badge>
              ))}
              {totalActiveServices > 2 && (
                <Badge
                  variant="outline"
                  className="text-[9px] font-black uppercase tracking-widest bg-[#166534]/5 text-[#166534] border-[#166534]/10 px-2 py-0.5"
                >
                  +{totalActiveServices - 2}
                </Badge>
              )}
            </div>

            <button
              className="w-full h-10 mt-2 bg-slate-900 hover:bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 active:scale-[0.98]"
            >
              View Profile
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
