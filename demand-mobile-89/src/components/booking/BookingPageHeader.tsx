
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BookingPageHeaderProps {
  serviceName: string;
  handymanName: string;
  userRole?: 'handyman';
  onBack: () => void;
}

export const BookingPageHeader = ({ serviceName, handymanName, userRole = 'handyman', onBack }: BookingPageHeaderProps) => {
  const actionText = 'Book Service';
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{actionText}</h1>
        <p className="text-gray-600">Schedule {serviceName} with {handymanName}</p>
      </div>
      <Button onClick={onBack} variant="outline">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </div>
  );
};
