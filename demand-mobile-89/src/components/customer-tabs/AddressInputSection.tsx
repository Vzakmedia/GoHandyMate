
import React, { useState } from 'react';
import { AddressInput } from '@/components/ui/address-input';
import { MapPin } from 'lucide-react';

interface AddressInputSectionProps {
  onAddressSelect?: (address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => void;
  placeholder?: string;
  label?: string;
}

export const AddressInputSection = ({ 
  onAddressSelect, 
  placeholder = "Enter your address...",
  label = "Service Address"
}: AddressInputSectionProps) => {
  const [address, setAddress] = useState("");

  const handleAddressSelect = (selectedAddress: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    console.log('Address selected:', selectedAddress);
    if (onAddressSelect) {
      onAddressSelect(selectedAddress);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <MapPin className="w-4 h-4 inline mr-2" />
        {label}
      </label>
      <AddressInput
        value={address}
        onChange={setAddress}
        onAddressSelect={handleAddressSelect}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  );
};
