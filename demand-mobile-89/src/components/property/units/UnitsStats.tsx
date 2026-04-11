
import { Card, CardContent } from '@/components/ui/card';

interface Unit {
  id: string;
  status: 'vacant' | 'occupied' | 'maintenance';
}

interface UnitsStatsProps {
  units: Unit[];
}

export const UnitsStats = ({ units }: UnitsStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{units.length}</div>
          <div className="text-sm text-gray-600">Total Units</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {units.filter(u => u.status === 'occupied').length}
          </div>
          <div className="text-sm text-gray-600">Occupied</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {units.filter(u => u.status === 'vacant').length}
          </div>
          <div className="text-sm text-gray-600">Vacant</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-red-600">
            {units.filter(u => u.status === 'maintenance').length}
          </div>
          <div className="text-sm text-gray-600">Maintenance</div>
        </CardContent>
      </Card>
    </div>
  );
};
