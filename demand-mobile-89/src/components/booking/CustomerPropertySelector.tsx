import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Home, MapPin } from 'lucide-react';
import { useCustomerProperties } from '@/hooks/useCustomerProperties';

interface CustomerPropertySelectorProps {
    onLocationSelect: (address: string) => void;
    selectedLocation?: string;
}

export const CustomerPropertySelector = ({ onLocationSelect, selectedLocation }: CustomerPropertySelectorProps) => {
    const { properties, loading } = useCustomerProperties();
    const [selectedProperty, setSelectedProperty] = useState<string>('');

    const handlePropertyChange = (propertyId: string) => {
        setSelectedProperty(propertyId);

        const property = properties.find(p => p.id === propertyId);
        if (property) {
            onLocationSelect(property.property_address);
        }
    };

    if (loading || properties.length === 0) {
        return null;
    }

    return (
        <Card className="border-green-200 bg-green-50/50 mb-4">
            <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-2 mb-3">
                    <Home className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Quick Select from Saved Addresses</span>
                </div>

                <div>
                    <Select value={selectedProperty} onValueChange={handlePropertyChange}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select a saved address" />
                        </SelectTrigger>
                        <SelectContent>
                            {properties.map((property) => (
                                <SelectItem key={property.id} value={property.id}>
                                    <div className="flex items-center space-x-2 text-left">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <div>
                                            <span className="font-semibold">{property.property_name}</span>
                                            <span className="text-xs text-gray-500 block truncate max-w-[200px] md:max-w-xs">{property.property_address}</span>
                                        </div>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedLocation && selectedProperty && properties.find(p => p.property_address === selectedLocation) && (
                    <div className="mt-3 p-2 bg-white rounded border border-green-200">
                        <span className="text-xs text-green-700 font-medium">Selected: </span>
                        <span className="text-sm text-gray-700 block truncate">{selectedLocation}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
