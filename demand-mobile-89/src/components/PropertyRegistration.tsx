
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AddressInput } from '@/components/ui/address-input';
import { Building, Plus, MapPin, Home } from 'lucide-react';
import { UnitsOverview } from './property/UnitsOverview';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

interface Property {
  id: string;
  name: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  units: Unit[];
}

interface Unit {
  id: string;
  number: string;
  type: string;
  status: 'occupied' | 'vacant' | 'maintenance';
}

export const PropertyRegistration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProperty, setNewProperty] = useState({ name: '', address: '' });
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showUnitsView, setShowUnitsView] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user) return;

    fetchProperties();

    // Set up real-time subscriptions
    const propertiesChannel = supabase
      .channel('properties-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'properties', filter: `manager_id=eq.${user.id}` },
        () => fetchProperties()
      )
      .subscribe();

    const unitsChannel = supabase
      .channel('units-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'units', filter: `manager_id=eq.${user.id}` },
        () => fetchProperties()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(unitsChannel);
    };
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;

    try {
      // Fetch properties first
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          id,
          property_name,
          property_address,
          property_type,
          total_units,
          status,
          approved_at,
          created_at,
          updated_at
        `)
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Fetch units for all properties
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .eq('manager_id', user.id)
        .order('property_address');

      if (unitsError) throw unitsError;

      // Map properties with their units
      const propertiesWithUnits = propertiesData?.map(property => ({
        id: property.id,
        name: property.property_name,
        address: property.property_address,
        status: property.status as 'pending' | 'approved' | 'rejected',
        approved_at: property.approved_at,
        units: unitsData?.filter(unit => unit.property_id === property.id).map(unit => ({
          id: unit.id,
          number: unit.unit_number,
          type: unit.tags?.[0] || 'Unknown',
          status: unit.status as 'occupied' | 'vacant' | 'maintenance'
        })) || []
      })) || [];

      setProperties(propertiesWithUnits);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "Error",
        description: "Failed to fetch properties",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'occupied': return 'bg-green-100 text-green-700';
      case 'vacant': return 'bg-yellow-100 text-yellow-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const addProperty = async () => {
    if (!user) return;
    
    if (newProperty.name && newProperty.address) {
      try {
        const { data: property, error } = await supabase
          .from('properties')
          .insert({
            manager_id: user.id,
            property_name: newProperty.name,
            property_address: newProperty.address,
            property_type: 'apartment',
            status: 'pending'
          })
          .select()
          .single();

        if (error) throw error;

        toast({
          title: "Property Submitted",
          description: "Your property has been submitted for approval. You can add units once it's approved.",
        });

        setNewProperty({ name: '', address: '' });
        setShowAddProperty(false);
        fetchProperties();
      } catch (error) {
        console.error('Error adding property:', error);
        toast({
          title: "Error",
          description: "Failed to add property",
          variant: "destructive",
        });
      }
    }
  };

  const handleManageUnits = (propertyId?: string) => {
    if (propertyId) {
      const property = properties.find(p => p.id === propertyId);
      if (property?.status !== 'approved') {
        toast({
          title: "Property Not Approved",
          description: "Units can only be managed for approved properties.",
          variant: "destructive",
        });
        return;
      }
    }
    setSelectedPropertyId(propertyId);
    setShowUnitsView(true);
  };

  if (showUnitsView) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={() => setShowUnitsView(false)}>
            ← Back to Properties
          </Button>
        </div>
        <UnitsOverview propertyId={selectedPropertyId} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Property Management</h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleManageUnits()} 
            variant="outline"
            disabled={!properties.some(p => p.status === 'approved')}
          >
            <Home className="w-4 h-4 mr-2" />
            Manage Units
          </Button>
          <Button onClick={() => setShowAddProperty(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {showAddProperty && (
        <Card>
          <CardHeader>
            <CardTitle>Register New Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="propertyName">Property Name</Label>
              <Input
                id="propertyName"
                value={newProperty.name}
                onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
                placeholder="Enter property name"
              />
            </div>
            <div>
              <Label htmlFor="propertyAddress">Address</Label>
              <AddressInput
                value={newProperty.address}
                onChange={(value) => setNewProperty({ ...newProperty, address: value })}
                onAddressSelect={(details) => {
                  setNewProperty({ ...newProperty, address: details.formatted_address });
                }}
                placeholder="Start typing property address..."
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={addProperty} className="bg-blue-600 hover:bg-blue-700">
                Add Property
              </Button>
              <Button variant="outline" onClick={() => setShowAddProperty(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {properties.map((property) => (
          <Card key={property.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <CardTitle className="text-lg">{property.name}</CardTitle>
              </div>
              <CardDescription className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{property.address}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Units ({property.units.length})</span>
                  <div className="flex gap-2">
                    <Badge 
                      className={property.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                property.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'}
                    >
                      {property.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleManageUnits(property.id)}
                      disabled={property.status !== 'approved'}
                      className="h-6 px-2 text-xs"
                    >
                      <Home className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {property.units.map((unit) => (
                    <div key={unit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Unit {unit.number}</span>
                        <span className="text-sm text-gray-500">{unit.type}</span>
                      </div>
                      <Badge className={getStatusColor(unit.status)}>
                        {unit.status}
                      </Badge>
                    </div>
                  ))}
                  {property.units.length === 0 && (
                    <p className="text-sm text-gray-500 italic text-center py-4">
                      No units added yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
