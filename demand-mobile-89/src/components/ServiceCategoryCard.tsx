
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceCategory } from '@/data/handymanCategories';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { ServiceItem } from './service-category/ServiceItem';

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

interface ServiceCategoryCardProps {
  category: ServiceCategory;
  selectedServices: string[];
  onServiceToggle: (serviceId: string) => void;
  onServiceClick: (serviceId: string, serviceName: string) => void;
}

export const ServiceCategoryCard = ({ 
  category, 
  selectedServices, 
  onServiceToggle, 
  onServiceClick 
}: ServiceCategoryCardProps) => {
  const { currentLocation } = useLocationTracking();
  const [professionals, setProfessionals] = useState<Record<string, Professional[]>>({});
  const [loadingProfessionals, setLoadingProfessionals] = useState<Record<string, boolean>>({});

  const fetchProfessionalsForService = async (serviceName: string) => {
    if (professionals[serviceName] || loadingProfessionals[serviceName]) return;

    setLoadingProfessionals(prev => ({ ...prev, [serviceName]: true }));

    try {
      const requestBody = {
        type: 'all',
        ...(currentLocation && {
          lat: currentLocation.latitude.toString(),
          lng: currentLocation.longitude.toString(),
          radius: '25'
        })
      };

      const { data, error } = await supabase.functions.invoke('get-professionals', {
        body: requestBody
      });

      if (error) throw error;

      // Filter professionals who offer this specific service
      const filteredProfessionals = (data || []).filter((prof: Professional) => {
        const skills = prof.handyman?.skills || [];
        const skillRates = prof.skill_rates || [];
        
        return skills.some(skill => 
          skill.toLowerCase().includes(serviceName.toLowerCase()) ||
          serviceName.toLowerCase().includes(skill.toLowerCase())
        ) || skillRates.some(rate => 
          rate.skill_name.toLowerCase().includes(serviceName.toLowerCase()) ||
          serviceName.toLowerCase().includes(rate.skill_name.toLowerCase())
        );
      });

      setProfessionals(prev => ({ 
        ...prev, 
        [serviceName]: filteredProfessionals.slice(0, 5) 
      }));
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setProfessionals(prev => ({ ...prev, [serviceName]: [] }));
    } finally {
      setLoadingProfessionals(prev => ({ ...prev, [serviceName]: false }));
    }
  };

  const handleBookProfessional = (professional: Professional, serviceName: string) => {
    const serviceParam = encodeURIComponent(serviceName);
    window.location.href = `/book/${professional.id}?service=${serviceParam}`;
  };

  return (
    <Card className="border-2 border-green-200">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center space-x-3">
          <category.icon className="w-6 h-6 text-green-600" />
          <span>{category.name}</span>
          <Badge className="bg-green-100 text-green-800">Professional Services</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Available Services</h3>
        <div className="space-y-3">
          {category.services.map((service) => (
            <ServiceItem
              key={service.id}
              service={service}
              isSelected={selectedServices.includes(service.id)}
              professionals={professionals[service.name] || []}
              loading={loadingProfessionals[service.name] || false}
              onToggle={onServiceToggle}
              onFetchProfessionals={fetchProfessionalsForService}
              onBookProfessional={handleBookProfessional}
              onViewAll={onServiceClick}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
