import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { usePropertyManagement } from '@/hooks/usePropertyManagement';

interface PropertySelectorProps {
  selectedPropertyId: string;
  onPropertyChange: (propertyId: string) => void;
}

export const PropertySelector = ({ selectedPropertyId, onPropertyChange }: PropertySelectorProps) => {
  const { properties, fetchProperties } = usePropertyManagement();
  const [approvedProperties, setApprovedProperties] = useState<any[]>([]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    // Filter only approved properties
    const approved = properties.filter(property => property.status === 'approved');
    setApprovedProperties(approved);
    
    // If current selection is not approved, clear it
    if (selectedPropertyId && !approved.find(p => p.id === selectedPropertyId)) {
      onPropertyChange('');
    }
  }, [properties, selectedPropertyId, onPropertyChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor="property-select">Select Approved Property *</Label>
      <Select 
        value={selectedPropertyId} 
        onValueChange={onPropertyChange}
      >
        <SelectTrigger id="property-select">
          <SelectValue placeholder="Choose an approved property..." />
        </SelectTrigger>
        <SelectContent>
          {approvedProperties.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No approved properties available</p>
              <p className="text-xs mt-1">Please wait for property approval or add a new property</p>
            </div>
          ) : (
            approvedProperties.map((property) => (
              <SelectItem key={property.id} value={property.id}>
                <div className="flex items-center space-x-2">
                  <span>{property.property_name}</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    Approved
                  </Badge>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {property.property_address}
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      {approvedProperties.length === 0 && (
        <p className="text-sm text-amber-600 mt-2">
          ⚠️ Units can only be added to approved properties. Please wait for admin approval or contact support.
        </p>
      )}
    </div>
  );
};