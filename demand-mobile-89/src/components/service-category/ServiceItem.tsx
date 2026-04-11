
import { Checkbox } from '@/components/ui/checkbox';
import { ProfessionalsDropdown } from './ProfessionalsDropdown';

interface Service {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  unit?: string;
}

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman' | 'contractor';
  avatar_url?: string;
  handyman?: {
    hourly_rate?: number;
    skills?: string[];
  };
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
  }>;
  distance?: number;
  rating: number;
  reviewCount: number;
  isSponsored: boolean;
  isOnline: boolean;
  completedJobs: number;
}

interface ServiceItemProps {
  service: Service;
  isSelected: boolean;
  professionals: Professional[];
  loading: boolean;
  onToggle: (serviceId: string) => void;
  onFetchProfessionals: (serviceName: string) => void;
  onBookProfessional: (professional: Professional, serviceName: string) => void;
  onViewAll: (serviceId: string, serviceName: string) => void;
}

export const ServiceItem = ({
  service,
  isSelected,
  professionals,
  loading,
  onToggle,
  onFetchProfessionals,
  onBookProfessional,
  onViewAll
}: ServiceItemProps) => {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-gray-50">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(service.id)}
        className="mt-1"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">{service.name}</h4>
            {service.description && (
              <p className="text-sm text-gray-600 mb-3">{service.description}</p>
            )}
            
            <ProfessionalsDropdown
              serviceName={service.name}
              isOpen={isSelected}
              onToggle={() => onToggle(service.id)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
