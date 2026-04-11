
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileHeader } from './handyman/ProfileHeader';
import { ProfileActions } from './handyman/ProfileActions';
import { HandymanServicesDisplay } from './handyman/HandymanServicesDisplay';
import { PortfolioGallery } from './handyman/PortfolioGallery';
import { ReviewsSection } from './handyman/ReviewsSection';
import { ToolsAndEquipment } from './handyman/ToolsAndEquipment';
import { PublicServiceAreas } from './handyman/PublicServiceAreas';
import { usePublicHandymanData } from '@/hooks/usePublicHandymanData';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

interface HandymanProfileProps {
  profileId: string;
  profileData: any;
}

interface HandymanData {
  full_name: string;
  phone: string;
  availability: string;
  status: string;
  activeServices: string[];
  jobs_this_month?: number;
}

export const HandymanProfile = ({ profileId, profileData }: HandymanProfileProps) => {
  const [handymanData, setHandymanData] = useState<HandymanData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: publicHandymanData } = usePublicHandymanData(profileId);

  // Mock data for portfolio - in a real app, this would come from the database
  const mockPortfolio = [
    { id: 1, title: 'Kitchen Sink Repair', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop' },
    { id: 2, title: 'Bathroom Tile Work', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop' },
    { id: 3, title: 'Living Room Paint', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop' }
  ];

  // Mock tools data - in a real app, this would come from handyman profile
  const mockTools = ['Drill', 'Hammer', 'Screwdriver Set', 'Level', 'Measuring Tape', 'Wrench Set'];

  useEffect(() => {
    const fetchHandymanData = async () => {
      try {
        setLoading(true);
        
        // Fetch handyman data
        const { data: handymanInfo, error: handymanError } = await supabase
          .from('handyman')
          .select('*')
          .eq('user_id', profileId)
          .single();

        // Get active services from service pricing data
        const activeServices = publicHandymanData.servicePricing || [];
        
        // Map service IDs to readable names
        const getServiceName = (categoryId: string, subcategoryId?: string) => {
          const category = expandedServiceCategories.find(cat => cat.id === categoryId);
          if (!category) return categoryId;
          
          if (subcategoryId) {
            const subcategory = category.subcategories.find(sub => sub.id === subcategoryId);
            return subcategory ? subcategory.name : `${category.name} - ${subcategoryId}`;
          }
          
          return category.name;
        };

        const serviceNames = activeServices.map(service => 
          getServiceName(service.category_id, service.subcategory_id)
        );

        if (handymanInfo) {
          setHandymanData({
            ...handymanInfo,
            activeServices: serviceNames
          });
        } else {
          // Fallback data if no handyman record exists
          setHandymanData({
            full_name: profileData.full_name || 'Professional Handyman',
            phone: profileData.phone || '',
            availability: 'Available',
            status: 'active',
            activeServices: serviceNames.length > 0 ? serviceNames : ['General Services']
          });
        }

      } catch (err) {
        console.error('Error fetching handyman data:', err);
        // Set fallback data
        setHandymanData({
          full_name: profileData.full_name || 'Professional Handyman',
          phone: profileData.phone || '',
          availability: 'Available',
          status: 'active',
          activeServices: ['General Services']
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHandymanData();
  }, [profileId, profileData, publicHandymanData.servicePricing]);

  if (loading) {
    return <div className="animate-pulse p-6">Loading profile...</div>;
  }

  const displayName = handymanData?.full_name || profileData.full_name || 'Professional Handyman';

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <ProfileHeader
        profileData={profileData}
        displayName={displayName}
        profileId={profileId}
      />

      <ProfileActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <HandymanServicesDisplay profileId={profileId} />
          <PortfolioGallery portfolio={mockPortfolio} />
          <ReviewsSection providerId={profileId} providerName={displayName} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ToolsAndEquipment tools={mockTools} />
          <PublicServiceAreas profileId={profileId} profileData={profileData} />
        </div>
      </div>
    </div>
  );
};
