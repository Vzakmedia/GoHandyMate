
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const InfoCard = () => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800 font-medium">
              Real-Time Address Suggestions
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Start typing any address to get live suggestions powered by Google Maps. This ensures precise location data and helps customers find you more easily.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
