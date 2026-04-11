
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Loading Live Services</h3>
        <p className="text-gray-600">Fetching handyman services...</p>
      </CardContent>
    </Card>
  );
};
