
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Home, Wrench, Calendar, MapPin } from 'lucide-react';
import { AddUnitModal } from './AddUnitModal';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

export interface UnitsOverviewProps {
  propertyId?: string;
}

interface Unit {
  id: string;
  unit_number: string;
  property_name: string;
  tenant_name?: string;
  tenant_email?: string;
  tenant_phone?: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  rent_amount?: number;
  lease_start?: string;
  lease_end?: string;
  maintenance_requests?: number;
}

export const UnitsOverview = ({ propertyId }: UnitsOverviewProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { units, properties, loading, fetchUnits, createUnit } = usePropertyManagement();

  useEffect(() => {
    if (propertyId) {
      fetchUnits(propertyId);
    }
  }, [propertyId, fetchUnits]);

  // If no propertyId provided, show units from the first property
  const currentProperty = propertyId 
    ? properties.find(p => p.id === propertyId)
    : properties[0];

  const currentUnits = propertyId 
    ? units 
    : units.slice(0, 10); // Show first 10 units if no specific property

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-800';
      case 'vacant': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUnitAdded = async (unitData: any) => {
    if (currentProperty) {
      try {
        await createUnit(currentProperty.id, unitData);
        if (propertyId) {
          fetchUnits(propertyId);
        }
      } catch (error) {
        console.error('Error adding unit:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Units Overview</h2>
          <p className="text-gray-600">Manage your property units and tenants</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Unit</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Home className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{currentUnits.length}</p>
                <p className="text-sm text-gray-600">Total Units</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Home className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentUnits.filter(u => u.status === 'occupied').length}</p>
                <p className="text-sm text-gray-600">Occupied</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Home className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentUnits.filter(u => u.status === 'vacant').length}</p>
                <p className="text-sm text-gray-600">Vacant</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wrench className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{currentUnits.reduce((acc, unit) => acc + (unit.maintenance_requests || 0), 0)}</p>
                <p className="text-sm text-gray-600">Maintenance Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading units...</p>
        </div>
      ) : currentUnits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No units found. Add your first unit to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUnits.map((unit) => (
          <Card key={unit.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{unit.unit_number}</CardTitle>
                <Badge className={getStatusColor(unit.status)}>
                  {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{currentProperty?.property_name || 'Property'}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {unit.tenant_name && (
                <div>
                  <p className="font-medium">{unit.tenant_name}</p>
                  <p className="text-sm text-gray-600">{unit.tenant_email}</p>
                  {unit.tenant_phone && (
                    <p className="text-sm text-gray-600">{unit.tenant_phone}</p>
                  )}
                </div>
              )}

              {unit.rent_amount && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Monthly Rent</span>
                  <span className="font-semibold text-green-600">${unit.rent_amount}</span>
                </div>
              )}

              {unit.lease_end && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Lease expires</p>
                    <p className="text-sm text-gray-600">{new Date(unit.lease_end).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {unit.maintenance_requests && unit.maintenance_requests > 0 && (
                <div className="flex items-center space-x-2 p-2 bg-red-50 rounded-md">
                  <Wrench className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-red-700">
                    {unit.maintenance_requests} pending request{unit.maintenance_requests > 1 ? 's' : ''}
                  </span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  Location
                </Button>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      <AddUnitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUnitAdded={handleUnitAdded}
        propertyId={propertyId}
      />
    </div>
  );
};
