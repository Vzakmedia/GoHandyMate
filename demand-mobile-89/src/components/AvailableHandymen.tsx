import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { HandymanCard } from '@/components/HandymanCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LoadingScreen } from '@/components/LoadingScreen';

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman' | 'contractor';
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
}

interface AvailableHandymenProps {
  serviceId: string;
  serviceName: string;
  categoryId: string;
  onBack: () => void;
}

// Service to skill mapping for better matching
const serviceToSkillMapping: Record<string, string[]> = {
  'electrical': ['electrical', 'electrician', 'wiring', 'outlet', 'switch', 'lighting', 'electrical repair'],
  'plumbing': ['plumbing', 'plumber', 'pipes', 'faucet', 'toilet', 'drain', 'water heater'],
  'carpentry': ['carpentry', 'carpenter', 'wood', 'furniture', 'cabinet', 'trim', 'framing'],
  'painting': ['painting', 'painter', 'wall', 'interior', 'exterior', 'drywall'],
  'hvac': ['hvac', 'heating', 'cooling', 'air conditioning', 'furnace', 'duct'],
  'appliance': ['appliance', 'repair', 'installation', 'dishwasher', 'washer', 'dryer'],
  'handyman': ['handyman', 'general', 'maintenance', 'repair', 'installation', 'fix']
};

const getRelatedSkills = (serviceName: string, categoryId?: string): string[] => {
  // First try to match with category
  if (categoryId && serviceToSkillMapping[categoryId.toLowerCase()]) {
    return serviceToSkillMapping[categoryId.toLowerCase()];
  }
  
  // Then try to match with service name
  const lowerServiceName = serviceName.toLowerCase();
  
  // Find matching category based on service name
  for (const [category, skills] of Object.entries(serviceToSkillMapping)) {
    if (skills.some(skill => lowerServiceName.includes(skill) || skill.includes(lowerServiceName))) {
      return skills;
    }
  }
  
  // Default to the service name itself
  return [serviceName.toLowerCase()];
};

export const AvailableHandymen = ({ serviceId, serviceName, categoryId, onBack }: AvailableHandymenProps) => {
  const [selectedHandyman, setSelectedHandyman] = useState<string | null>(null);
  const [handymen, setHandymen] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    getUserLocation();
    fetchAvailableHandymen();
  }, [serviceName]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied');
        }
      );
    }
  };

  const fetchAvailableHandymen = async () => {
    try {
      setLoading(true);
      
      const requestBody = {
        type: 'handyman',
        serviceName: serviceName, // Pass the service name for filtering
        ...(userLocation && {
          lat: userLocation.lat.toString(),
          lng: userLocation.lng.toString(),
          radius: '25'
        })
      };

      console.log('Fetching handymen for service:', serviceName, requestBody);

      const { data, error } = await supabase.functions.invoke('get-professionals', {
        body: requestBody
      });

      if (error) throw error;

      console.log('Fetched handymen for service:', serviceName, 'Count:', data?.length || 0);
      setHandymen(data || []);
    } catch (error) {
      console.error('Error fetching available handymen:', error);
      toast.error('Failed to load available handymen');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Available Professionals</h2>
          <p className="text-gray-600">For {serviceName} • {handymen.length} professionals available</p>
        </div>
      </div>

      <div className="grid gap-4">
        {handymen.map((handyman) => (
          <HandymanCard
            key={handyman.id}
            handymanId={handyman.id}
            serviceName={serviceName}
            isExpanded={selectedHandyman === handyman.id}
            onExpandToggle={() => setSelectedHandyman(selectedHandyman === handyman.id ? null : handyman.id)}
          />
        ))}
      </div>

      {handymen.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No handymen available for {serviceName}
          </h3>
          <p className="text-gray-600 mb-4">
            Try browsing all professionals or post a custom request.
          </p>
        </div>
      )}

      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Don't see the right professional for your needs?
        </p>
        <Button variant="outline">
          Post a Custom Request
        </Button>
      </div>
    </div>
  );
};
