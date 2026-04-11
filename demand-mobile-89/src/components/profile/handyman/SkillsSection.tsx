
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';
import { useHandymanData } from '@/hooks/useHandymanData';
import { Loader2 } from 'lucide-react';

interface SkillsSectionProps {
  profileId: string;
}

export const SkillsSection = ({ profileId }: SkillsSectionProps) => {
  const { data: handymanData, loading } = useHandymanData();

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
          Service Pricing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service pricing */}
        {activeServices.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Service Categories
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {service.category_id}
                      {service.subcategory_id && ` - ${service.subcategory_id}`}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ${service.custom_price || service.base_price}
                    </div>
                    {service.same_day_multiplier > 1 && (
                      <div className="text-xs text-orange-600">
                        Same day: ${((service.custom_price || service.base_price) * service.same_day_multiplier).toFixed(0)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeServices.length === 0 && (
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
