import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Home, Trash2, MapPin } from "lucide-react";
import { useCustomerProperties, CustomerProperty } from '@/hooks/useCustomerProperties';
import { AddressInput } from '@/components/ui/address-input';
import { Loader2 } from 'lucide-react';

export const CustomerPropertiesSection = () => {
    const { properties, loading, addProperty, deleteProperty } = useCustomerProperties();
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProperty, setNewProperty] = useState<Omit<CustomerProperty, 'id'>>({
        property_name: '',
        property_address: '',
        city: '',
        state: '',
        zip_code: ''
    });

    const handleAddressSelect = (address: {
        formatted_address: string;
        latitude: number;
        longitude: number;
        place_id: string;
    }) => {
        const addressParts = address.formatted_address.split(', ');
        let city = '';
        let state = '';
        let zipCode = '';

        addressParts.forEach(part => {
            const zipMatch = part.match(/\b\d{5}(?:-\d{4})?\b/);
            if (zipMatch) {
                zipCode = zipMatch[0];
                const cityStatePart = addressParts[addressParts.length - 2];
                if (cityStatePart) {
                    const split = cityStatePart.split(' ');
                    city = split[0];
                    state = split[1] || '';
                }
            }
        });

        setNewProperty(prev => ({
            ...prev,
            property_address: address.formatted_address,
            city: city || prev.city,
            state: state || prev.state,
            zip_code: zipCode || prev.zip_code
        }));
    };

    const handleSave = async () => {
        if (!newProperty.property_address || !newProperty.property_name) return;

        setIsSubmitting(true);
        const added = await addProperty(newProperty);
        setIsSubmitting(false);

        if (added) {
            setNewProperty({
                property_name: '',
                property_address: '',
                city: '',
                state: '',
                zip_code: ''
            });
            setIsAdding(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Home className="w-5 h-5 text-green-600" />
                    Saved Addreses & Properties
                </CardTitle>
                <CardDescription>
                    Manage locations where you might need handyman services (e.g., Home, Office, Rental Property)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {loading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {properties.map((prop) => (
                            <div key={prop.id} className="p-4 border rounded-xl bg-slate-50 flex justify-between items-start group">
                                <div className="space-y-1">
                                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        {prop.property_name}
                                    </div>
                                    <div className="text-sm text-slate-500">{prop.property_address}</div>
                                    {(prop.city || prop.zip_code) && (
                                        <div className="text-xs text-slate-400">
                                            {[prop.city, prop.state, prop.zip_code].filter(Boolean).join(', ')}
                                        </div>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => deleteProperty(prop.id)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}

                        {!isAdding && (
                            <Button
                                variant="outline"
                                className="h-full min-h-[100px] border-dashed rounded-xl flex flex-col gap-2 shadow-sm hover:border-green-300 hover:bg-green-50/50 transition-colors"
                                onClick={() => setIsAdding(true)}
                            >
                                <Plus className="w-6 h-6 text-green-600" />
                                <span className="text-green-700 font-medium">Add New Location</span>
                            </Button>
                        )}
                    </div>
                )}

                {isAdding && (
                    <div className="p-5 border rounded-xl bg-white space-y-4 shadow-sm animate-in fade-in slide-in-from-top-4">
                        <h4 className="font-medium text-slate-900">Add New Location</h4>
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label>Location Name</Label>
                                <Input
                                    placeholder="e.g. My Home, Dad's House, Office"
                                    value={newProperty.property_name}
                                    onChange={(e) => setNewProperty(prev => ({ ...prev, property_name: e.target.value }))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Address</Label>
                                <AddressInput
                                    placeholder="Search address"
                                    value={newProperty.property_address}
                                    onChange={(val) => setNewProperty(prev => ({ ...prev, property_address: val }))}
                                    onAddressSelect={handleAddressSelect}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>City</Label>
                                    <Input
                                        placeholder="City"
                                        value={newProperty.city || ''}
                                        onChange={(e) => setNewProperty(prev => ({ ...prev, city: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>ZIP Code</Label>
                                    <Input
                                        placeholder="ZIP"
                                        value={newProperty.zip_code || ''}
                                        onChange={(e) => setNewProperty(prev => ({ ...prev, zip_code: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                            <Button variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={!newProperty.property_name || !newProperty.property_address || isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Location'}
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
