
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

interface LocationCoverageCardProps {
  locations: string[];
}

export const LocationCoverageCard = ({ locations }: LocationCoverageCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-purple-600" />
          Location Coverage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {locations.length > 0 ? (
            locations.map((location, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <MapPin className="w-3 h-3 text-gray-400" />
                {location}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No locations yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
