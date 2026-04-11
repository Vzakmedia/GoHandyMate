
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BookingErrorStateProps {
  title: string;
  message: string;
  onBack: () => void;
}

export const BookingErrorState = ({ title, message, onBack }: BookingErrorStateProps) => {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};
