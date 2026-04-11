import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Globe, Clock, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdvertisements, Advertisement } from '@/hooks/useAdvertisements';
import { PublicAdCard } from './ads/PublicAdCard';
import { AdCarousel } from './ads/AdCarousel';

interface AdvertisingSectionProps {
  selectedLocation?: string;
}

export const AdvertisingSection = ({ selectedLocation = 'All Areas' }: AdvertisingSectionProps) => {
  const navigate = useNavigate();
  // Use fetchActiveAds to get active ads from all users
  const { advertisements, loading, fetchActiveAds, trackInteraction } = useAdvertisements();
  const [likedAds, setLikedAds] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Extract zip code from location if available
    const zipMatch = selectedLocation.match(/(\d{5})/);
    const zipCode = zipMatch ? zipMatch[1] : undefined;
    
    fetchActiveAds(zipCode);
  }, [selectedLocation]);

  const handleAdView = (adId: number) => {
    trackInteraction(adId, 'view');
  };

  const handleAdClick = (adId: number) => {
    trackInteraction(adId, 'click');
    // You can add navigation logic here based on the ad
  };

  const toggleLike = (adId: number) => {
    setLikedAds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adId)) {
        newSet.delete(adId);
      } else {
        newSet.add(adId);
      }
      return newSet;
    });
  };

  const featuredAds = advertisements.filter(ad => ad.plan_type === 'featured' || ad.plan_type === 'premium');
  const basicAds = advertisements.filter(ad => ad.plan_type === 'basic');

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-gray-800">Featured Business Partners</h3>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">Sponsored</Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-blue-600 hover:bg-blue-50"
            onClick={() => navigate('/business-advertising')}
          >
            Advertise Here
          </Button>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-gray-800">Featured Business Partners</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">Sponsored</Badge>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-blue-600 hover:bg-blue-50"
          onClick={() => navigate('/business-advertising')}
        >
          Advertise Here
        </Button>
      </div>

      {/* Featured Ads Carousel */}
      {featuredAds.length > 0 && (
        <div className="mb-6">
          <AdCarousel 
            ads={featuredAds}
            onAdView={handleAdView}
            onAdClick={handleAdClick}
          />
        </div>
      )}

      {/* Basic Ads Grid */}
      {basicAds.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {basicAds.map((ad) => (
            <PublicAdCard
              key={ad.id}
              ad={ad}
              onView={handleAdView}
              onClick={handleAdClick}
            />
          ))}
        </div>
      )}

      {advertisements.length === 0 && !loading && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No active advertisements in your area</h3>
            <p className="text-gray-600 mb-4">Be the first to advertise your business in {selectedLocation}</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => navigate('/business-advertising')}
            >
              Start Advertising Today
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* CTA for advertisers */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardContent className="text-center py-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Want to advertise your business?</h3>
          <p className="text-gray-600 mb-4">Reach thousands of local customers looking for your services</p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate('/business-advertising')}
          >
            Start Advertising Today
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
