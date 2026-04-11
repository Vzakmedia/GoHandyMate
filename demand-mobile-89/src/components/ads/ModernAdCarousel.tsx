
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface ModernAdCarouselProps {
  ads: Advertisement[];
}

export const ModernAdCarousel = ({ ads }: ModernAdCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  if (ads.length === 0) return null;

  // Auto-play functionality with faster mobile interval
  useEffect(() => {
    if (ads.length <= 1) return;

    // Check if mobile view
    const isMobile = window.innerWidth < 640;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, isMobile ? 4000 : 6000); // 4s on mobile, 6s on desktop

    return () => clearInterval(interval);
  }, [ads.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const currentAd = ads[currentIndex];
  const rating = 4.9;

  const handleGetQuote = () => {
    navigate(`/quote-request/${currentAd.user_id}`);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${currentAd.user_id}`);
  };

  return (
    <div className="space-y-3">
      {/* Mobile: Horizontal scrollable cards, Desktop: Carousel */}
      <div className="block sm:hidden">
        <div className="flex space-x-3 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
          {ads.map((ad, index) => (
            <div key={ad.id} className="flex-none w-80 snap-start">
              <Card className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <CardContent className="p-0">
                  <div className="flex">
                    {/* Compact image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      {ad.image_url ? (
                        <img
                          src={ad.image_url}
                          alt={ad.ad_title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="absolute top-1 left-1">
                        <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5">
                          AD
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Compact info */}
                    <div className="flex-1 p-3 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">
                          {ad.ad_title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-xs text-gray-600">{rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                        {ad.ad_description}
                      </p>
                      
                      <div className="flex space-x-1.5">
                        <Button 
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-7"
                          onClick={handleGetQuote}
                        >
                          Quote
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline" 
                          className="border-gray-200 text-gray-600 text-xs h-7 px-2"
                          onClick={handleViewProfile}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Traditional carousel */}
      <div className="hidden sm:block relative max-w-4xl mx-auto">
        <Card className="bg-white shadow-lg border border-gray-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Business Image */}
              <div className="relative h-64 md:h-80">
                {currentAd.image_url ? (
                  <img
                    src={currentAd.image_url}
                    alt={currentAd.ad_title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8" />
                      </div>
                      <span className="text-lg font-bold">Premium Service</span>
                    </div>
                  </div>
                )}
                
                {/* Special Offer Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1">
                    20% OFF First Service
                  </Badge>
                </div>
              </div>
              
              {/* Business Info */}
              <div className="p-6 flex flex-col justify-center">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600">👤</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{currentAd.ad_title}</h3>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {currentAd.content || "Home Improvement"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{rating}</span>
                  <span className="text-gray-600 text-sm">rating</span>
                </div>
                
                <p className="text-gray-700 text-sm mb-6 leading-relaxed line-clamp-3">
                  {currentAd.ad_description}
                </p>
                
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={handleGetQuote}
                  >
                    Get Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-4 border-gray-200 text-gray-600 hover:bg-gray-50"
                    onClick={handleViewProfile}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation Arrows */}
        {ads.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg border border-gray-200 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </>
        )}
        
        {/* Dots Indicator */}
        {ads.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
