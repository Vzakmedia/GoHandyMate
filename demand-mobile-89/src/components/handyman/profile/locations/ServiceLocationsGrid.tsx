
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Clock } from "lucide-react";
import { ResponsiveCard } from "@/components/ResponsiveCard";
import { ResponsiveGrid } from "@/components/ResponsiveGrid";

interface ServiceLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  radius: number;
  priority: 'primary' | 'secondary';
}

interface ServiceLocationsGridProps {
  isEditing: boolean;
  serviceLocations: ServiceLocation[];
}

export const ServiceLocationsGrid = ({
  isEditing,
  serviceLocations
}: ServiceLocationsGridProps) => {
  return (
    <ResponsiveCard title="Service Locations">
      <ResponsiveGrid 
        cols={{ default: 1, md: 2 }}
        gap="gap-3 sm:gap-4"
      >
        {serviceLocations.map((location) => (
          <div 
            key={location.id}
            className="border rounded-lg p-3 sm:p-4 transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full ${
                  location.priority === 'primary' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-medium">{location.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{location.address}</p>
                </div>
              </div>
              <Badge 
                variant={location.priority === 'primary' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {location.priority}
              </Badge>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500">
              <span>Radius: {location.radius} miles</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>15-30 min</span>
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGrid>

      {isEditing && (
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Plus className="w-3 h-3 mr-1" />
            Add New Location
          </Button>
        </div>
      )}
    </ResponsiveCard>
  );
};
