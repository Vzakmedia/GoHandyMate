
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CalendarDays, CheckSquare, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

export const BulkServiceRequest = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [properties, setProperties] = useState<{ id: string; name: string; units: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('property-management', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json'
        },
      });

      if (error) throw error;

      const formattedProperties = data.properties.map((property: any) => ({
        id: property.id,
        name: property.property_name,
        units: property.total_units
      }));

      setProperties(formattedProperties);
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

  const serviceTypes = [
    { id: 'move-out-cleaning', name: 'Move-out Cleaning', price: 150 },
    { id: 'carpet-cleaning', name: 'Carpet Cleaning', price: 120 },
    { id: 'hvac-maintenance', name: 'HVAC Maintenance', price: 200 },
    { id: 'painting', name: 'Interior Painting', price: 300 },
    { id: 'deep-cleaning', name: 'Deep Cleaning', price: 180 },
  ];

  const toggleProperty = (propertyId: string) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const getTotalEstimate = () => {
    const service = serviceTypes.find(s => s.id === serviceType);
    if (!service) return 0;
    
    const totalUnits = selectedProperties.reduce((sum, propId) => {
      const property = properties.find(p => p.id === propId);
      return sum + (property?.units || 0);
    }, 0);

    return service.price * totalUnits;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span>Select Properties</span>
            </CardTitle>
            <CardDescription>Choose properties for bulk service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {properties.map((property) => (
              <div key={property.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={selectedProperties.includes(property.id)}
                  onCheckedChange={() => toggleProperty(property.id)}
                />
                <div className="flex-1">
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-gray-500">{property.units} units</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
            <CardDescription>Configure your bulk service request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Service Type</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} - ${service.price}/unit
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scheduledDate">Preferred Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Estimate</span>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xl font-bold text-green-600">
                    ${getTotalEstimate().toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {selectedProperties.length} properties, {
                  selectedProperties.reduce((sum, propId) => {
                    const property = properties.find(p => p.id === propId);
                    return sum + (property?.units || 0);
                  }, 0)
                } total units
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!serviceType || selectedProperties.length === 0}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Request Bulk Service
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
