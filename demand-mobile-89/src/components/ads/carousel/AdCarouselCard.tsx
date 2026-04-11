
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap } from 'lucide-react';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface AdCarouselCardProps {
  ad: Advertisement;
  colors: {
    gradient: string;
    badge: string;
    button: string;
  };
  children: React.ReactNode;
}

export const AdCarouselCard = ({ ad, colors, children }: AdCarouselCardProps) => {
  return (
    <Card className="relative overflow-hidden bg-white/90 backdrop-blur-2xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group max-w-4xl mx-auto">
      {/* Ultra-subtle gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-[0.01] group-hover:opacity-[0.03] transition-all duration-700`} />
      
      {/* Floating micro-elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-white/15 to-transparent rounded-full blur-lg animate-pulse opacity-60" />
        <div className="absolute -bottom-3 -left-3 w-20 h-20 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-full blur-xl group-hover:scale-105 transition-transform duration-1000" />
      </div>
      
      <CardContent className="relative p-0">
        <div className="flex flex-col lg:flex-row min-h-[180px]">
          {/* Ultra-compact Image Section */}
          <div className="lg:w-48 flex-shrink-0 relative overflow-hidden">
            {ad.image_url ? (
              <div className="relative h-full min-h-[180px]">
                <img 
                  src={ad.image_url} 
                  alt={ad.ad_title}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${colors.gradient} opacity-15 group-hover:opacity-20 transition-opacity duration-300`}></div>
              </div>
            ) : (
              <div className={`w-full h-full min-h-[180px] bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white relative overflow-hidden`}>
                {/* Compact animated background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-2 left-2 w-8 h-8 bg-white/20 rounded-full blur-sm animate-float" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-white/15 rounded-full blur-sm animate-float-delayed" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 rounded-full blur-lg animate-pulse" />
                </div>
                
                <div className="relative text-center z-10">
                  <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-2 border border-white/20 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <span className="text-xs font-bold">Premium</span>
                  <div className="text-2xs opacity-80 mt-0.5">Service</div>
                </div>
              </div>
            )}
            
            {/* Ultra-compact floating badges */}
            {ad.plan_type === 'featured' && (
              <div className="absolute top-2 left-2 z-20">
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 py-0.5 rounded-md shadow-md animate-pulse border-0 font-bold text-2xs">
                  <Zap className="w-2 h-2 mr-1" />
                  HOT
                </Badge>
              </div>
            )}
            
            <div className="absolute bottom-2 left-2 z-20">
              <Badge className="bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md border-0 text-2xs font-medium">
                ⚡ Same Day
              </Badge>
            </div>
          </div>

          {/* Ultra-compact Content Section */}
          <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-br from-white/30 to-gray-50/20 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
