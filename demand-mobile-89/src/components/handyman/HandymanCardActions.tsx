
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HandymanCardActionsProps {
  handymanId: string;
  handymanName: string;
  serviceName: string;
  serviceRate: number;
}

export const HandymanCardActions = ({ 
  handymanId, 
  handymanName, 
  serviceName, 
  serviceRate 
}: HandymanCardActionsProps) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/book/${handymanId}?service=${encodeURIComponent(serviceName)}`);
  };

  return (
    <div className="flex justify-center">
      <Button 
        className="bg-green-600 hover:bg-green-700 w-full"
        onClick={handleBookNow}
      >
        Book {handymanName} - ${serviceRate}/hr
      </Button>
    </div>
  );
};
