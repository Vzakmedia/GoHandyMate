import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Home } from 'lucide-react';
import { usePropertyManagerUnits } from '@/hooks/usePropertyManagerUnits';

interface PropertyUnitSelectorProps {
  onLocationSelect: (address: string, unitInfo?: string) => void;
  selectedLocation?: string;
}

export const PropertyUnitSelector = ({ onLocationSelect, selectedLocation }: PropertyUnitSelectorProps) => {
  const { properties, loading, error } = usePropertyManagerUnits();
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('');

  const handlePropertyChange = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setSelectedUnit('');
    
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      onLocationSelect(property.address);
    }
  };

  const handleUnitChange = (unitId: string) => {
    setSelectedUnit(unitId);
    
    const property = properties.find(p => p.id === selectedProperty);
    const unit = property?.units.find(u => u.id === unitId);
    
    if (property && unit) {
      const unitInfo = unit.unit_name ? `${unit.unit_name} (Unit ${unit.unit_number})` : `Unit ${unit.unit_number}`;
      onLocationSelect(property.address, unitInfo);
    }
  };

  if (loading) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-blue-600">Loading your properties...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-600">Error loading properties: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (properties.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Building className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-600">
              No properties found. Add properties and units first to use quick selection.
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const selectedPropertyData = properties.find(p => p.id === selectedProperty);

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <Building className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Quick Select from Your Properties</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="property" className="text-sm font-medium">Property</Label>
            <Select value={selectedProperty} onValueChange={handlePropertyChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    <div className="flex items-center space-x-2">
                      <Building className="w-3 h-3" />
                      <span>{property.address}</span>
                      <span className="text-xs text-gray-500">({property.units.length} units)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProperty && selectedPropertyData && (
            <div>
              <Label htmlFor="unit" className="text-sm font-medium">Unit (Optional)</Label>
              <Select value={selectedUnit} onValueChange={handleUnitChange}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a unit" />
                </SelectTrigger>
                <SelectContent>
                  {selectedPropertyData.units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      <div className="flex items-center space-x-2">
                        <Home className="w-3 h-3" />
                        <span>
                          {unit.unit_name ? `${unit.unit_name} (Unit ${unit.unit_number})` : `Unit ${unit.unit_number}`}
                        </span>
                        {unit.status && (
                          <span className={`text-xs px-1 py-0.5 rounded ${
                            unit.status === 'occupied' ? 'bg-green-100 text-green-700' : 
                            unit.status === 'vacant' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {unit.status}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {selectedLocation && (
          <div className="mt-3 p-2 bg-white rounded border border-blue-200">
            <span className="text-xs text-blue-600 font-medium">Selected: </span>
            <span className="text-sm text-gray-700">{selectedLocation}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};