
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressInput } from "@/components/ui/address-input";
import { User, Save, Loader2 } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

interface PersonalInformationSectionProps {
  formData: FormData;
  isEditing: boolean;
  loading: boolean;
  onFormDataChange: (data: Partial<FormData>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const PersonalInformationSection = ({
  formData,
  isEditing,
  loading,
  onFormDataChange,
  onSave,
  onCancel
}: PersonalInformationSectionProps) => {
  const handleAddressSelect = (address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    // Extract city and zip code from the formatted address
    const addressParts = address.formatted_address.split(', ');
    let city = '';
    let zipCode = '';
    
    // Try to extract city and zip from the address
    addressParts.forEach(part => {
      const zipMatch = part.match(/\b\d{5}(?:-\d{4})?\b/);
      if (zipMatch) {
        zipCode = zipMatch[0];
        // The part before zip is usually the city and state
        const cityStatePart = addressParts[addressParts.length - 2];
        if (cityStatePart) {
          city = cityStatePart.split(' ')[0];
        }
      }
    });

    onFormDataChange({
      address: address.formatted_address,
      city: city,
      zipCode: zipCode
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => onFormDataChange({ fullName: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled={true}
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed here</p>
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => onFormDataChange({ phone: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
              placeholder="(555) 123-4567"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="address">Address</Label>
            {isEditing ? (
              <AddressInput
                value={formData.address}
                onChange={(value) => onFormDataChange({ address: value })}
                onAddressSelect={handleAddressSelect}
                placeholder="Enter your address..."
                className="w-full"
              />
            ) : (
              <Input
                id="address"
                value={formData.address}
                disabled={true}
                className="bg-gray-50"
                placeholder="No address set"
              />
            )}
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onFormDataChange({ city: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
              placeholder="Your City"
            />
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => onFormDataChange({ zipCode: e.target.value })}
              disabled={!isEditing}
              className={!isEditing ? 'bg-gray-50' : ''}
              placeholder="12345"
            />
          </div>
        </div>
        
        {isEditing && (
          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={onCancel} variant="outline" disabled={loading}>
              Cancel
            </Button>
            <Button onClick={onSave} className="bg-green-600 hover:bg-green-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
