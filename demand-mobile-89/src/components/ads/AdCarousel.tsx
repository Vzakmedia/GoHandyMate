
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface AdCarouselProps {
  ads: Advertisement[];
  onAdView: (adId: number) => void;
  onAdClick: (adId: number) => void;
}

export const AdCarousel = ({ ads, onAdView, onAdClick }: AdCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  if (ads.length === 0) return null;

  // Auto-play functionality
  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000); // Change ad every 5 seconds

    return () => clearInterval(interval);
  }, [ads.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const currentAd = ads[currentIndex];

  if (currentAd) {
    onAdView(currentAd.id);
  }

  const handleGetQuote = () => {
    onAdClick(currentAd.id);
    navigate(`/quote-request/${currentAd.user_id}`);
  };

  const handleViewProfile = () => {
    onAdClick(currentAd.id);
    navigate(`/profile/${currentAd.user_id}`);
  };

  const getPlanGradient = (planType: string) => {
    switch (planType) {
      case 'featured':
        return 'from-purple-500 via-pink-500 to-rose-500';
      case 'premium':
        return 'from-emerald-500 via-teal-500 to-cyan-500';
      default:
        return 'from-blue-500 via-indigo-500 to-purple-500';
    }
  };

  const serviceCategory = currentAd.content || "Professional Service";
  const rating = 4.9;

  return (
    <div className="relative group">
      <Card className="overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
        {/* Modern gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getPlanGradient(currentAd.plan_type)} opacity-[0.02]`} />
        
        <CardContent className="relative p-0">
          <div className="grid grid-cols-1 md:grid-cols-5 min-h-[200px]">
            {/* Image Section - More compact */}
            <div className="md:col-span-2 relative">
              {currentAd.image_url ? (
                <img 
                  src={currentAd.image_url} 
                  alt={currentAd.ad_title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getPlanGradient(currentAd.plan_type)} flex items-center justify-center text-white relative overflow-hidden`}>
                  {/* Animated background elements */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-4 left-4 w-16 h-16 bg-white/20 rounded-full blur-xl animate-pulse" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/20 rounded-full blur-lg animate-pulse delay-1000" />
                  </div>
                  
                  <div className="relative text-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-white/20">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                    <span className="text-sm font-medium">Premium Service</span>
                  </div>
                </div>
              )}
              
              {/* Floating elements */}
              {currentAd.plan_type === 'featured' && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-red-500 text-white px-3 py-1 rounded-full shadow-lg animate-pulse">
                    🔥 20% OFF
                  </Badge>
                </div>
              )}
            </div>

            {/* Content Section - More space */}
            <div className="md:col-span-3 p-6 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/50">
              <div className="space-y-4">
                {/* Header with modern layout */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 text-lg">👤</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                          {currentAd.ad_title}
                        </h3>
                        <p className="text-sm text-gray-600">{serviceCategory}</p>
                      </div>
                    </div>
                    
                    {/* Compact rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{rating}</span>
                      <span className="text-sm text-gray-500">rating</span>
                    </div>
                  </div>
                  
                  <Badge className={`${currentAd.plan_type === 'featured' ? 'bg-purple-100 text-purple-700' : currentAd.plan_type === 'premium' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} px-3 py-1 rounded-full font-medium`}>
                    {currentAd.plan_type}
                  </Badge>
                </div>
                
                {/* Description */}
                <p className="text-gray-700 leading-relaxed line-clamp-2">
                  {currentAd.ad_description}
                </p>
                
                {/* Location tags */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div className="flex flex-wrap gap-1">
                    {currentAd.target_zip_codes.slice(0, 2).map((zip, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-gray-50 border-gray-200">
                        {zip}
                      </Badge>
                    ))}
                    {currentAd.target_zip_codes.length > 2 && (
                      <Badge variant="outline" className="text-xs bg-gray-50 border-gray-200">
                        +{currentAd.target_zip_codes.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons - Modern design */}
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleGetQuote}
                  className={`flex-1 bg-gradient-to-r ${getPlanGradient(currentAd.plan_type)} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
                  size="lg"
                >
                  Get Quote
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button 
                  onClick={handleViewProfile}
                  variant="outline"
                  className="px-6 border-2 border-gray-200 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                  size="lg"
                >
                  View Profile
                </Button>
              </div>
              
              {/* Footer info - Removed valid date */}
              <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
                <span>Ad {currentIndex + 1} of {ads.length}</span>
                {ads.length > 1 && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-xs">Auto-playing</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation - More subtle */}
      {ads.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-xl border-0 w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white shadow-xl border-0 w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
            onClick={nextSlide}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </>
      )}

      {/* Dots Indicator - More modern */}
      {ads.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? `bg-gradient-to-r ${getPlanGradient(currentAd.plan_type)} w-6` 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
