
import { Card, CardContent } from '@/components/ui/card';
import { useHandymanProfile } from '@/hooks/useHandymanProfile';
import { getServiceSpecificRate, getHandymanSkills, getHandymanStats } from '@/utils/handymanUtils';
import { HandymanCardHeader } from '@/components/handyman/HandymanCardHeader';
import { HandymanServiceRates } from '@/components/handyman/HandymanServiceRates';

import { HandymanCardLoading } from '@/components/handyman/HandymanCardLoading';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Shield } from 'lucide-react';

interface HandymanCardProps {
  handymanId: string;
  serviceName: string;
  isExpanded: boolean;
  onExpandToggle: () => void;
}

export const HandymanCard = ({ handymanId, serviceName, isExpanded, onExpandToggle }: HandymanCardProps) => {
  const { handyman, loading } = useHandymanProfile(handymanId);

  if (loading) {
    return <HandymanCardLoading />;
  }

  if (!handyman) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          Handyman profile not found
        </CardContent>
      </Card>
    );
  }

  const serviceRate = getServiceSpecificRate(handyman, serviceName);
  const skills = getHandymanSkills(handyman);
  const stats = getHandymanStats(handyman);

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg border-l-4 ${
      isExpanded ? 'border-l-green-500 shadow-lg ring-2 ring-green-100' : 'border-l-transparent hover:border-l-green-300'
    }`}>
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="p-6 pb-4 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={handyman.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${handyman.id}`}
                  alt={handyman.full_name || 'Professional'}
                  className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-lg text-gray-800">
                    {handyman.full_name || 'Professional'}
                  </h3>
                  {handyman.subscription_plan && handyman.subscription_plan !== 'free' && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs font-medium">
                      PRO
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{stats.rating}</span>
                    <span className="text-gray-500">({stats.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{stats.distance}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Responds in {stats.responseTime}</span>
                  </span>
                  <span>{stats.completedTasks} jobs completed</span>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="text-right">
              <div className="bg-white rounded-lg p-3 shadow-sm border">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  ${serviceRate}
                </div>
                <div className="text-sm text-gray-500 mb-1">per hour</div>
                <div className="text-xs text-green-600 font-medium">
                  For {serviceName}
                </div>
              </div>
            </div>
          </div>

          {/* Availability Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant="outline" 
              className="text-green-600 border-green-300 bg-green-50"
            >
              {handyman.handyman_data?.availability || 'Available Today'}
            </Badge>
            
            <div className="text-xs text-gray-500">
              Updated recently
            </div>
          </div>
        </div>

        {/* Skills Preview */}
        <div className="px-6 py-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                {skill.name}
              </Badge>
            ))}
            {skills.length > 4 && (
              <Badge 
                variant="outline" 
                className="text-xs text-gray-500 cursor-pointer hover:bg-gray-50"
                onClick={onExpandToggle}
              >
                +{skills.length - 4} more skills
              </Badge>
            )}
          </div>
        </div>

        {/* Expanded Skills Section */}
        {isExpanded && (
          <div className="px-6 py-4 bg-gray-50 border-t">
            <HandymanServiceRates
              skills={skills}
              serviceName={serviceName}
              handymanName={handyman.full_name || 'Professional'}
              isExpanded={isExpanded}
              onExpandToggle={onExpandToggle}
            />
          </div>
        )}

      </CardContent>
    </Card>
  );
};
