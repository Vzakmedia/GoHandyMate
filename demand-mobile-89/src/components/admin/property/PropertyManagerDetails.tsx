import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Calendar, Building, MapPin } from 'lucide-react';

interface Property {
  id: string;
  property_name: string;
  property_address: string;
  status: string;
  total_units: number;
  created_at: string;
}

interface PropertyManager {
  id: string;
  full_name: string;
  email: string;
  user_role: string;
  account_status: string;
  created_at: string;
  properties?: Property[];
}

interface PropertyManagerDetailsProps {
  manager: PropertyManager | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PropertyManagerDetails = ({
  manager,
  open,
  onOpenChange,
}: PropertyManagerDetailsProps) => {
  if (!manager) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Property Manager Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this property manager and their properties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Manager Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{manager.full_name}</span>
                <Badge
                  variant={manager.account_status === 'active' ? 'default' : 'secondary'}
                >
                  {manager.account_status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{manager.email}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm capitalize">{manager.user_role.replace('_', ' ')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Joined {new Date(manager.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {manager.properties?.length || 0} properties
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Properties */}
          <Card>
            <CardHeader>
              <CardTitle>Properties ({manager.properties?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              {manager.properties && manager.properties.length > 0 ? (
                <div className="space-y-4">
                  {manager.properties.map((property) => (
                    <div key={property.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{property.property_name}</h3>
                        <Badge
                          variant={
                            property.status === 'approved' ? 'default' :
                            property.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {property.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{property.property_address}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{property.total_units} units</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Added {new Date(property.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No properties registered yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};