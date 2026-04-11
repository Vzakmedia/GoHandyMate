
import { Card, CardContent } from '@/components/ui/card';
import { ServiceArea } from './types';

interface ServiceAreaStatsProps {
  serviceAreas: ServiceArea[];
}

export const ServiceAreaStats = ({ serviceAreas }: ServiceAreaStatsProps) => {
  const activeAreas = serviceAreas.filter(a => a.is_active).length;
  const maxRange = Math.max(...serviceAreas.map(a => a.radius_miles));
  const verifiedLocations = serviceAreas.filter(a => a.formatted_address).length;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {activeAreas}
            </div>
            <div className="text-sm text-gray-600">Active Areas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {maxRange}
            </div>
            <div className="text-sm text-gray-600">Max Range (miles)</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {verifiedLocations}
            </div>
            <div className="text-sm text-gray-600">Verified Locations</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
