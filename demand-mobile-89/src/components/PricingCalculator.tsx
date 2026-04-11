
import { Button } from '@/components/ui/button';
import { DollarSign } from 'lucide-react';
import { ServiceCategory } from '@/data/handymanCategories';

interface PricingCalculatorProps {
  category: ServiceCategory;
  selectedServices: string[];
  rooms: string;
  floors: string;
  frequency: string;
  urgency: string;
}

export const PricingCalculator = ({
  category,
  selectedServices,
  rooms,
  floors,
  frequency,
  urgency
}: PricingCalculatorProps) => {
  const calculateTotal = () => {
    let baseTotal = selectedServices.reduce((total, serviceId) => {
      const service = category.services.find(s => s.id === serviceId);
      return total + (service?.basePrice || 0);
    }, 0);

    // Apply multipliers based on selections
    if (rooms === '2-3') baseTotal *= 1.5;
    else if (rooms === '4-6') baseTotal *= 2;
    else if (rooms === '7+') baseTotal *= 2.5;

    if (floors === '2') baseTotal *= 1.3;
    else if (floors === '3+') baseTotal *= 1.5;

    if (urgency === 'emergency') baseTotal *= 1.8;
    else if (urgency === 'same-day') baseTotal *= 1.5;
    else if (urgency === 'this-week') baseTotal *= 1.2;

    if (frequency === 'weekly') baseTotal *= 0.9; // Discount for regular service
    else if (frequency === 'bi-weekly') baseTotal *= 0.95;

    return Math.round(baseTotal);
  };

  const getUrgencyMultiplier = () => {
    switch (urgency) {
      case 'emergency': return '(+80% rush fee)';
      case 'same-day': return '(+50% rush fee)';
      case 'this-week': return '(+20% fee)';
      default: return '';
    }
  };

  if (selectedServices.length === 0) return null;

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h4 className="font-bold text-green-800 mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2" />
        Your Service Total
      </h4>
      
      <div className="space-y-2 mb-4">
        {selectedServices.map(serviceId => {
          const service = category.services.find(s => s.id === serviceId);
          return service ? (
            <div key={serviceId} className="flex justify-between text-sm">
              <span>{service.name}</span>
              <span>${service.basePrice}</span>
            </div>
          ) : null;
        })}
        
        {rooms && rooms !== '1' && (
          <div className="flex justify-between text-sm text-blue-600">
            <span>Rooms adjustment ({rooms})</span>
            <span>
              {rooms === '2-3' && '+50%'}
              {rooms === '4-6' && '+100%'}
              {rooms === '7+' && '+150%'}
            </span>
          </div>
        )}
        
        {floors && floors !== '1' && (
          <div className="flex justify-between text-sm text-blue-600">
            <span>Floors adjustment ({floors})</span>
            <span>
              {floors === '2' && '+30%'}
              {floors === '3+' && '+50%'}
            </span>
          </div>
        )}
        
        {urgency && urgency !== 'flexible' && (
          <div className="flex justify-between text-sm text-orange-600">
            <span>Urgency fee</span>
            <span>{getUrgencyMultiplier()}</span>
          </div>
        )}
        
        {frequency && (frequency === 'weekly' || frequency === 'bi-weekly') && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Regular service discount</span>
            <span>
              {frequency === 'weekly' && '-10%'}
              {frequency === 'bi-weekly' && '-5%'}
            </span>
          </div>
        )}
      </div>
      
      <div className="border-t border-green-200 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-800">Total Price:</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-green-600">
              ${calculateTotal().toLocaleString()}
            </span>
            <p className="text-xs text-green-600">
              All-inclusive professional service
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
            Book Now - ${calculateTotal().toLocaleString()}
          </Button>
          <Button variant="outline" className="flex-1">
            Schedule Consultation
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          ✓ Fixed pricing ✓ No hidden fees ✓ Professional guarantee
        </p>
      </div>
    </div>
  );
};
