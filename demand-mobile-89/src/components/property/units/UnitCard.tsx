
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Home, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Wrench,
  Eye,
  Edit,
  MoreVertical
} from 'lucide-react';

interface Unit {
  id: string;
  property_id: string;
  unit_number: string;
  unit_name?: string;
  property_address: string;
  tenant_name?: string;
  tenant_phone?: string;
  tenant_email?: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  notes?: string;
  tags?: string[];
  created_at: string;
}

interface UnitCardProps {
  unit: Unit;
  onPostJob: (unitId: string) => void;
}

export const UnitCard = ({ unit, onPostJob }: UnitCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-700';
      case 'vacant': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Home className="w-5 h-5 text-blue-600" />
              Unit {unit.unit_number}
            </CardTitle>
            {unit.unit_name && (
              <p className="text-sm text-gray-600 mt-1">{unit.unit_name}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(unit.status)}>
              {unit.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Unit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onPostJob(unit.id)}>
                  <Wrench className="w-4 h-4 mr-2" />
                  Post Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
          <p className="text-sm text-gray-600">{unit.property_address}</p>
        </div>

        {unit.tenant_name && (
          <div className="space-y-2 border-t pt-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <p className="text-sm font-medium">{unit.tenant_name}</p>
            </div>
            {unit.tenant_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{unit.tenant_phone}</p>
              </div>
            )}
            {unit.tenant_email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">{unit.tenant_email}</p>
              </div>
            )}
          </div>
        )}

        {unit.tags && unit.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {unit.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {unit.notes && (
          <p className="text-sm text-gray-600 italic border-t pt-2">
            {unit.notes}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            View Jobs
          </Button>
          <Button 
            size="sm" 
            onClick={() => onPostJob(unit.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Wrench className="w-4 h-4 mr-1" />
            Post Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
