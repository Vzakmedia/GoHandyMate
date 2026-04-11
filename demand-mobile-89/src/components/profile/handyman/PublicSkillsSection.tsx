
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, Zap } from 'lucide-react';
import { usePublicHandymanData } from '@/hooks/usePublicHandymanData';
import { Loader2 } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

interface PublicSkillsSectionProps {
  profileId: string;
}

export const PublicSkillsSection = ({ profileId }: PublicSkillsSectionProps) => {
  const { data: handymanData, loading } = usePublicHandymanData(profileId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
            Service Pricing
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  const activeServices = handymanData.servicePricing?.filter(service => service.is_active) || [];

  // Process services with category information
  const processedServices = activeServices.map(service => {
    const category = expandedServiceCategories.find(cat => cat.id === service.category_id);
    const subcategory = service.subcategory_id 
      ? category?.subcategories?.find(sub => sub.id === service.subcategory_id)
      : null;

    const handymanPrice = service.custom_price || service.base_price;

    return {
      ...service,
      category,
      subcategory,
      displayName: subcategory ? subcategory.name : category?.name || service.category_id,
      displayDescription: subcategory ? subcategory.description : category?.description,
      handymanPrice,
      sameDayPrice: Math.round(handymanPrice * (service.same_day_multiplier || 1.5)),
      emergencyPrice: Math.round(handymanPrice * (service.emergency_multiplier || 2.0))
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
          Available Services & Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {processedServices.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Professional Services ({processedServices.length} available)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedServices.map((service, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800">{service.displayName}</h5>
                      {service.displayDescription && (
                        <p className="text-xs text-gray-600 mt-1">{service.displayDescription}</p>
                      )}
                      <Badge variant="outline" className="text-green-700 border-green-300 mt-2">
                        {service.category_id}
                        {service.subcategory_id && ` - ${service.subcategory_id}`}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Standard Rate:</span>
                      <div className="font-semibold text-green-600">
                        ${service.handymanPrice}
                      </div>
                    </div>
                    
                    {service.sameDayPrice > service.handymanPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-orange-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Same Day:
                        </span>
                        <div className="text-sm text-orange-600 font-medium">
                          ${service.sameDayPrice}
                        </div>
                      </div>
                    )}
                    
                    {service.emergencyPrice > service.handymanPrice && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-red-600 flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          Emergency:
                        </span>
                        <div className="text-sm text-red-600 font-medium">
                          ${service.emergencyPrice}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {processedServices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No active services configured yet.</p>
            <p className="text-sm mt-2">This handyman is still setting up their service pricing.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
