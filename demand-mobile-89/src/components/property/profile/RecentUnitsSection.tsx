
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Eye, Wrench, Plus } from 'lucide-react';

interface Unit {
  id: string;
  unit_number: string;
  unit_name?: string;
  property_address: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  created_at: string;
}

interface RecentUnitsSectionProps {
  units: Unit[];
  onAddUnit: () => void;
}

export const RecentUnitsSection = ({ units, onAddUnit }: RecentUnitsSectionProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-700';
      case 'vacant': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-green-600" />
            Recent Units
          </CardTitle>
          <Button variant="outline" size="sm">
            View All Units
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {units.length > 0 ? (
          <div className="space-y-4">
            {units.slice(0, 4).map((unit) => (
              <div key={unit.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">Unit {unit.unit_number}</h3>
                    {unit.unit_name && <span className="text-sm text-gray-500">- {unit.unit_name}</span>}
                    <Badge className={getStatusColor(unit.status)} variant="outline">
                      {unit.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {unit.property_address}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Wrench className="w-4 h-4 mr-1" />
                    Post Job
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No units added yet</p>
            <Button onClick={onAddUnit}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Unit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
