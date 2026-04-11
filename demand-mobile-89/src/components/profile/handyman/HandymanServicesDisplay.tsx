
import { useState } from 'react';
import { usePublicHandymanData } from '@/hooks/usePublicHandymanData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';
import { toast } from 'sonner';
import { LoadingState, ErrorState, EmptyState } from './LoadingStates';
import { ServicePricingCard } from './ServicePricingCard';
import { SkillRateCard } from './SkillRateCard';

interface HandymanServicesDisplayProps {
  profileId: string;
}

export const HandymanServicesDisplay = ({ profileId }: HandymanServicesDisplayProps) => {
  const { data: publicData, loading, error } = usePublicHandymanData(profileId);

  console.log('HandymanServicesDisplay: Current state:', {
    profileId,
    loading,
    error,
    hasData: !!publicData,
    servicePricingLength: publicData?.servicePricing?.length || 0,
    skillRatesLength: publicData?.skillRates?.length || 0
  });

  const handleBookNow = (serviceName: string, price: number) => {
    const serviceParam = encodeURIComponent(serviceName);
    window.location.href = `/book/${profileId}?service=${serviceParam}&price=${price}`;
    toast.success(`Booking ${serviceName} for $${price}`);
  };

  const getServiceName = (categoryId: string, subcategoryId?: string) => {
    const category = expandedServiceCategories.find(cat => cat.id === categoryId);
    if (!category) return categoryId;
    
    if (subcategoryId) {
      const subcategory = category.subcategories?.find(sub => sub.id === subcategoryId);
      return subcategory ? subcategory.name : `${category.name} - ${subcategoryId}`;
    }
    
    return category.name;
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    console.error('HandymanServicesDisplay: Error loading data:', error);
    return <ErrorState error={error} onRetry={() => window.location.reload()} />;
  }

  // Check if publicData exists and has the expected structure
  if (!publicData) {
    console.warn('HandymanServicesDisplay: No public data received');
    return <ErrorState error="No data available" onRetry={() => window.location.reload()} />;
  }

  const servicePricingArray = Array.isArray(publicData?.servicePricing) ? publicData.servicePricing : [];
  const skillRatesArray = Array.isArray(publicData?.skillRates) ? publicData.skillRates : [];

  console.log('HandymanServicesDisplay: Processing data:', {
    servicePricingArray: servicePricingArray.length,
    skillRatesArray: skillRatesArray.length,
    activeServicePricing: servicePricingArray.filter(s => s.is_active).length,
    activeSkillRates: skillRatesArray.filter(s => s.is_active).length
  });

  // Combine and process services
  const allServices = [
    ...servicePricingArray.filter(s => s.is_active).map(service => ({
      id: service.id || Math.random().toString(),
      name: getServiceName(service.category_id, service.subcategory_id),
      price: service.custom_price || service.base_price,
      type: 'service_pricing' as const,
      categoryId: service.category_id,
      subcategoryId: service.subcategory_id
    })),
    ...skillRatesArray.filter(s => s.is_active).map(skill => ({
      id: skill.id || Math.random().toString(),
      name: skill.skill_name,
      price: skill.hourly_rate,
      type: 'skill_rate' as const,
      experienceLevel: skill.experience_level || 'Intermediate'
    }))
  ];

  console.log('HandymanServicesDisplay: Final services array:', allServices);

  if (allServices.length === 0) {
    return <EmptyState servicePricingCount={servicePricingArray.length} skillRatesCount={skillRatesArray.length} />;
  }

  // Group services by type
  const servicesByType = allServices.reduce((acc, service) => {
    if (!acc[service.type]) {
      acc[service.type] = [];
    }
    acc[service.type].push(service);
    return acc;
  }, {} as Record<string, typeof allServices>);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional Services</h2>
        <p className="text-gray-600">
          {allServices.length} specialized service{allServices.length !== 1 ? 's' : ''} with transparent pricing
        </p>
      </div>

      {/* Service Pricing */}
      {servicesByType.service_pricing && servicesByType.service_pricing.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Service Pricing</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicesByType.service_pricing.map((service) => (
                <ServicePricingCard
                  key={service.id}
                  service={service}
                  onBook={handleBookNow}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Rates */}
      {servicesByType.skill_rate && servicesByType.skill_rate.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Hourly Skills</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {servicesByType.skill_rate.map((skill) => (
                <SkillRateCard
                  key={skill.id}
                  skill={skill as any}
                  onBook={handleBookNow}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
