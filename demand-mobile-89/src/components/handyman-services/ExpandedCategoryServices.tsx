
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp } from 'lucide-react';

interface ExpandedCategoryServicesProps {
  categoriesWithServices: Array<[string, any]>;
  expandedCategories: string[];
  onToggleCategory: (categoryId: string) => void;
  onBookService: (serviceName: string, price: number) => void;
}

export const ExpandedCategoryServices = ({
  categoriesWithServices,
  expandedCategories,
  onToggleCategory,
  onBookService
}: ExpandedCategoryServicesProps) => {
  return (
    <div className="space-y-6">
      {categoriesWithServices
        .filter(([categoryId]) => expandedCategories.includes(categoryId))
        .map(([categoryId, { category, services }]) => (
          <Card key={categoryId}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name} Services</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleCategory(categoryId)}
                >
                  <ChevronUp className="w-4 h-4" />
                  Collapse
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service: any) => (
                  <div key={service.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{service.name}</h4>
                        <Badge variant="outline" className="text-xs mt-1">
                          {service.type === 'service_pricing' ? 'Fixed Price' : 'Hourly Rate'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${service.price}{service.type === 'skill_rate' ? '/hr' : ''}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => onBookService(service.name, service.price)}
                      className="w-full"
                      size="sm"
                    >
                      Book Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
