
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ServicePricingCardProps {
  service: {
    id: string;
    name: string;
    price: number;
  };
  onBook: (serviceName: string, price: number) => void;
}

export const ServicePricingCard = ({ service, onBook }: ServicePricingCardProps) => (
  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-semibold text-gray-800">{service.name}</h4>
        <Badge variant="outline" className="text-xs mt-1">
          Fixed Price
        </Badge>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold text-green-600">${service.price}</div>
        <div className="text-xs text-gray-500">per service</div>
      </div>
    </div>
    
    <Button 
      onClick={() => onBook(service.name, service.price)}
      className="w-full bg-green-600 hover:bg-green-700"
      size="sm"
    >
      Book for ${service.price}
    </Button>
  </div>
);
