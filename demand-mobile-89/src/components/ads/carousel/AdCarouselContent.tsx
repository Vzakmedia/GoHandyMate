
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Clock, Award, MapPin, Verified } from 'lucide-react';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface AdCarouselContentProps {
  ad: Advertisement;
  colors: {
    gradient: string;
    badge: string;
    button: string;
  };
  rating: number;
}

export const AdCarouselContent = ({ ad, colors, rating }: AdCarouselContentProps) => {
  return (
    <div className="space-y-3">
      {/* Ultra-compact Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm">
                <span className="text-gray-600 text-sm">👤</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center border border-white">
                <Verified className="w-1.5 h-1.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-gray-900 mb-0.5 leading-tight truncate">
                {ad.ad_title}
              </h3>
              <div className="flex items-center gap-1.5">
                <p className="text-2xs text-gray-600 truncate">{ad.content || "Professional Service"}</p>
                <Badge variant="outline" className="text-2xs bg-green-50 text-green-700 border-green-200 px-1 py-0">
                  ✓
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Ultra-compact rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-2.5 h-2.5 fill-amber-400 text-amber-400" 
                />
              ))}
            </div>
            <span className="text-xs font-bold text-gray-900">{rating}</span>
            <span className="text-2xs text-gray-400">•</span>
            <span className="text-2xs text-gray-500">200+ reviews</span>
          </div>
        </div>
        
        <Badge className={`${colors.badge} px-2 py-0.5 rounded-md font-semibold text-2xs border shadow-sm flex-shrink-0`}>
          <Award className="w-2 h-2 mr-1" />
          {ad.plan_type}
        </Badge>
      </div>
      
      {/* Ultra-compact Description */}
      <div className="bg-gradient-to-r from-gray-50/80 to-white/80 p-2.5 rounded-lg border border-gray-100/50 backdrop-blur-sm">
        <p className="text-gray-700 leading-relaxed line-clamp-2 font-medium text-xs text-justify">
          {ad.ad_description}
        </p>
      </div>
      
      {/* Ultra-compact Features Grid */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="flex items-center gap-1.5 text-2xs">
          <Clock className="w-2.5 h-2.5 text-green-600" />
          <span className="text-gray-700 font-medium">Same Day</span>
        </div>
        <div className="flex items-center gap-1.5 text-2xs">
          <Shield className="w-2.5 h-2.5 text-blue-600" />
          <span className="text-gray-700 font-medium">Insured</span>
        </div>
      </div>
      
      {/* Ultra-compact location tags */}
      <div className="flex items-center gap-1.5">
        <MapPin className="w-2.5 h-2.5 text-gray-400" />
        <div className="flex flex-wrap gap-1">
          {ad.target_zip_codes.slice(0, 2).map((zip, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-2xs bg-gradient-to-r from-gray-50 to-white border-gray-300 hover:border-gray-400 transition-colors px-1.5 py-0"
            >
              {zip}
            </Badge>
          ))}
          {ad.target_zip_codes.length > 2 && (
            <Badge variant="outline" className="text-2xs bg-gray-50 border-gray-300 px-1.5 py-0">
              +{ad.target_zip_codes.length - 2}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
