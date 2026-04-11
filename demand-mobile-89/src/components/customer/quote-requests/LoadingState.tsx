
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
  <Card>
    <CardContent className="flex items-center justify-center h-32">
      <div className="text-center space-y-2">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
        <p className="text-gray-600">Loading your quote requests...</p>
      </div>
    </CardContent>
  </Card>
);
