
import { HandymanCard } from './HandymanCard';
// ContractorCard archived — contractor role removed

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman';
  avatar_url?: string;
  subscription_plan?: string;
  account_status: string;
  created_at: string;
  handyman_data?: {
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
  service_pricing?: Array<{
    category_id: string;
    subcategory_id?: string;
    base_price: number;
    custom_price?: number;
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
  hasRealtimePricing?: boolean;
  averageRate?: number;
}

interface ProfessionalGridProps {
  professionals: Professional[];
  showDistance?: boolean;
  isCarousel?: boolean;
}

export const ProfessionalGrid = ({ 
  professionals, 
  showDistance = true, 
  isCarousel = false 
}: ProfessionalGridProps) => {
  if (!professionals || professionals.length === 0) {
    return null;
  }

  return (
    <>
      {professionals.map((professional) => (
        <HandymanCard
          key={professional.id}
          professional={professional}
          showDistance={showDistance}
          isCarousel={isCarousel}
        />
      ))}
    </>
  );
};
