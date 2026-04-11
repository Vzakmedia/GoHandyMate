
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import { HandymanCard } from './HandymanCard';
import { ContractorCard } from './ContractorCard';

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
  work_areas?: Array<{
    area_name: string;
    center_latitude: number;
    center_longitude: number;
    radius_miles: number;
    is_active: boolean;
  }>;
  distance?: number;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  isSponsored: boolean;
  lastSeen?: string;
  isOnline: boolean;
}

interface ProfessionalsListProps {
  professionals: Professional[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRetry?: () => void;
}

export const ProfessionalsList = ({ 
  professionals, 
  searchTerm, 
  setSearchTerm,
  onRetry 
}: ProfessionalsListProps) => {
  if (professionals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No professionals found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {searchTerm ? (
            `No professionals match "${searchTerm}". Try adjusting your search terms or clearing the search.`
          ) : (
            'No professionals are currently available. This might be due to location filtering or service availability.'
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          {searchTerm && (
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Clear Search
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Results
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {professionals.map((professional) => (
        professional.user_role === 'handyman' 
          ? <HandymanCard key={professional.id} professional={professional} />
          : <ContractorCard key={professional.id} professional={professional} />
      ))}
    </div>
  );
};
