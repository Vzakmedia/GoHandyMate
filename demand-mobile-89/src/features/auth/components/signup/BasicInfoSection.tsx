
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressInput } from '@/components/ui/address-input';
import { User, Mail, Lock, Phone, Globe } from 'lucide-react';
import { SignUpFormData } from './types';
import { formatPhone } from './utils/formatters';

interface BasicInfoSectionProps {
  data: SignUpFormData;
  onUpdate: (field: keyof SignUpFormData, value: string) => void;
  hideRoleSelector?: boolean;
}

export const BasicInfoSection = ({ data, onUpdate, hideRoleSelector = false }: BasicInfoSectionProps) => {
  const handleAddressSelect = (address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => {
    const addressParts = address.formatted_address.split(', ');
    let city = '';
    let zipCode = '';

    addressParts.forEach(part => {
      const zipMatch = part.match(/\b\d{5}(?:-\d{4})?\b/);
      if (zipMatch) {
        zipCode = zipMatch[0];
        const cityStatePart = addressParts[addressParts.length - 2];
        if (cityStatePart) {
          city = cityStatePart.split(' ')[0];
        }
      }
    });

    onUpdate('address', address.formatted_address);
    if (city) onUpdate('city', city);
    if (zipCode) onUpdate('zipCode', zipCode);
  };

  return (
    <div className="space-y-10">
      {/* Basic Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#0A0A0A]">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
              <Input
                id="fullName"
                type="text"
                placeholder="Full Legal Name"
                value={data.fullName}
                onChange={(e) => onUpdate('fullName', e.target.value)}
                className="h-14 pl-12 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={data.phone}
                onChange={(e) => onUpdate('phone', formatPhone(e.target.value))}
                className="h-14 pl-12 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
            <Input
              id="email"
              type="email"
              placeholder="Email Address"
              value={data.email}
              onChange={(e) => onUpdate('email', e.target.value)}
              className="h-14 pl-12 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
              <Input
                id="password"
                type="password"
                placeholder="Create Password"
                value={data.password}
                onChange={(e) => onUpdate('password', e.target.value)}
                className="h-14 pl-12 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
                required
                minLength={8}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={data.confirmPassword}
                onChange={(e) => onUpdate('confirmPassword', e.target.value)}
                className="h-14 pl-12 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
                required
                minLength={8}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
            <Globe className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#0A0A0A]">Address Details</h3>
        </div>

        <div className="space-y-2">
          <AddressInput
            value={data.address}
            onChange={(value) => onUpdate('address', value)}
            onAddressSelect={handleAddressSelect}
            placeholder="Search your street address"
            className="h-14 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="city"
            type="text"
            placeholder="City"
            value={data.city}
            onChange={(e) => onUpdate('city', e.target.value)}
            className="h-14 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
          />

          <Input
            id="zipCode"
            type="text"
            placeholder="ZIP Code"
            value={data.zipCode}
            onChange={(e) => onUpdate('zipCode', e.target.value)}
            className="h-14 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium"
          />
        </div>
      </div>

      {/* Professional Role - ONLY SHOW IF NOT HIDDEN */}
      {!hideRoleSelector && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <User className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#0A0A0A]">Role Selection</h3>
          </div>

          <div className="space-y-2">
            <Select value={data.userRole} onValueChange={(value) => onUpdate('userRole', value)} required>
              <SelectTrigger className="h-14 bg-slate-50 border-transparent rounded-[1.25rem] focus:bg-white focus:border-green-200 transition-all font-medium">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                <SelectItem value="customer">Customer - I need services</SelectItem>
                <SelectItem value="handyman">Handyman - Service Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};
