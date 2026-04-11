import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, MapPin, Calendar, User, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Property {
  id: string;
  property_name: string;
  property_address: string;
  property_type: string;
  total_units: number;
  status: string;
  created_at: string;
  approved_at?: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface Unit {
  id: string;
  unit_number: string;
  status: string;
  rent_amount?: number;
  tenant_name?: string;
  created_at: string;
}

interface PropertyDetailsModalProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PropertyDetailsModal = ({
  property,
  open,
  onOpenChange,
}: PropertyDetailsModalProps) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUnits = async (propertyId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('units')
        .select('*')
        .eq('property_id', propertyId)
        .order('unit_number');

      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (property && open) {
      fetchUnits(property.id);
    }
  }, [property, open]);

  if (!property) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Property Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this property and its units.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{property.property_name}</span>
                <Badge
                  variant={
                    property.status === 'approved' ? 'default' :
                    property.status === 'pending' ? 'secondary' : 'destructive'
                  }
                >
                  {property.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{property.property_address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm capitalize">{property.property_type}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{property.total_units} units</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    Created {new Date(property.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {property.profiles?.full_name} ({property.profiles?.email})
                  </span>
                </div>
                
                {property.approved_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className="text-sm">
                      Approved {new Date(property.approved_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Units Information */}
          <Card>
            <CardHeader>
              <CardTitle>Units ({units.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
                </div>
              ) : units.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {units.map((unit) => (
                    <div key={unit.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Unit {unit.unit_number}</span>
                        <Badge
                          variant={
                            unit.status === 'occupied' ? 'default' :
                            unit.status === 'vacant' ? 'secondary' : 'destructive'
                          }
                        >
                          {unit.status}
                        </Badge>
                      </div>
                      
                      {unit.rent_amount && (
                        <p className="text-sm text-gray-600">
                          Rent: ${unit.rent_amount}/month
                        </p>
                      )}
                      
                      {unit.tenant_name && (
                        <p className="text-sm text-gray-600">
                          Tenant: {unit.tenant_name}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-2">
                        Added {new Date(unit.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No units registered yet
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};