
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, RefreshCw } from 'lucide-react';

interface ServiceSyncHeaderProps {
  serviceCategories: number;
  totalSubcategories: number;
  availableHandymen: number;
  onRefresh: () => void;
}

export const ServiceSyncHeader = ({
  serviceCategories,
  totalSubcategories,
  availableHandymen,
  onRefresh
}: ServiceSyncHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span>Live Service Marketplace</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800">
              Real-time Sync
            </Badge>
            <Button onClick={onRefresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{serviceCategories}</div>
            <div className="text-sm text-gray-600">Service Categories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{totalSubcategories}</div>
            <div className="text-sm text-gray-600">Available Services</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{availableHandymen}</div>
            <div className="text-sm text-gray-600">Available Handymen</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
