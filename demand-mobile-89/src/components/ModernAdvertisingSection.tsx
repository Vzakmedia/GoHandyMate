
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { ModernAdCarousel } from '@/components/ads/ModernAdCarousel';
import { Sparkles, TrendingUp, Users, Star } from 'lucide-react';

export const ModernAdvertisingSection = () => {
  // Use the hook with fetchPublicAds = true to get active ads from all users
  const { advertisements } = useAdvertisements();

  // Debug logging
  console.log('ModernAdvertisingSection - Total advertisements:', advertisements.length);
  console.log('ModernAdvertisingSection - Advertisements data:', advertisements);
  
  // Filter for active ads only (should already be filtered by fetchActiveAdvertisements)
  const activeAds = advertisements.filter(ad => ad.status === 'active');
  console.log('ModernAdvertisingSection - Active advertisements:', activeAds.length, activeAds);

  if (!activeAds.length) {
    console.log('ModernAdvertisingSection - No active ads found, component will not render');
    return null;
  }

  return (
    <section className="py-3 sm:py-8 bg-white">
      <div className="px-3 sm:px-6 lg:px-8">
        {/* Mobile-first compact header */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-1 sm:mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Sponsored</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
              Local Businesses
            </h2>
          </div>
          <div className="text-xs text-gray-500">
            {activeAds.length} ads
          </div>
        </div>

        {/* Mobile-optimized Ad Carousel */}
        <ModernAdCarousel ads={activeAds} />
      </div>
    </section>
  );
};
