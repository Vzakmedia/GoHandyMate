
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, DollarSign } from 'lucide-react';
import { expandedServiceCategories } from '@/data/expandedServiceCategories';

interface HandymanProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  user_role: 'handyman';
  average_rating?: number;
  total_ratings?: number;
  phone?: string;
}

interface ProfessionalInfoCardProps {
  handyman: HandymanProfile;
  serviceName: string;
  serviceRate: number;
  categoryFromUrl: string;
}

export const ProfessionalInfoCard = ({
  handyman,
  serviceName,
  serviceRate,
  categoryFromUrl
}: ProfessionalInfoCardProps) => {
  const categoryInfo = expandedServiceCategories.find(cat => cat.id === categoryFromUrl);
  
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-5 h-5 mr-2" />
          Professional Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <img 
            src={handyman.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${handyman.id}`}
            alt={handyman.full_name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{handyman.full_name}</h3>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">
                Verified Professional
              </span>
            </div>
            {handyman.average_rating && (
              <div className="flex items-center space-x-1 mt-1">
                <span className="text-sm text-yellow-600">★ {handyman.average_rating.toFixed(1)}</span>
                <span className="text-xs text-gray-500">({handyman.total_ratings} reviews)</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Service:</span>
            <span className="font-semibold">{serviceName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Rate:</span>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-600">${serviceRate}/hour</span>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Type:</span>
            <span className="text-sm capitalize">{handyman.user_role}</span>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Selected Service
          </h4>
          <div className="text-sm text-blue-800">
            <div className="flex justify-between items-center">
              <span>{serviceName}</span>
              <span className="font-bold text-green-600">${serviceRate}/hr</span>
            </div>
            {categoryInfo && (
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  {categoryInfo.name}
                </Badge>
              </div>
            )}
          </div>
          <div className="mt-2 text-xs text-blue-600">
            ✓ Real-time pricing from professional's configured rates
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
