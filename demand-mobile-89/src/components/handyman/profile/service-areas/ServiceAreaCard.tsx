
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { X, MapPin, Navigation } from 'lucide-react';
import { AddressInput } from '@/components/ui/address-input';
import { ServiceArea } from './types';
import { cn } from '@/lib/utils';

interface ServiceAreaCardProps {
  area: ServiceArea;
  index: number;
  addressInputValue: string;
  isEditing: boolean;
  canRemove: boolean;
  onUpdateArea: (index: number, field: keyof ServiceArea, value: string | number | boolean) => void;
  onAddressInputChange: (index: number, value: string) => void;
  onAddressSelect: (index: number, address: {
    formatted_address: string;
    latitude: number;
    longitude: number;
    place_id: string;
  }) => void;
  onRemove: (index: number) => void;
}

export const ServiceAreaCard = ({
  area,
  index,
  addressInputValue,
  isEditing,
  canRemove,
  onUpdateArea,
  onAddressInputChange,
  onAddressSelect,
  onRemove
}: ServiceAreaCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-[24px] p-8 border transition-all duration-300",
      area.is_primary ? "border-[#166534]/30" : "border-black/5"
    )}>
      <div className="space-y-8 animate-fade-in outline-none">
        {/* Area Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-[16px] border border-black/5",
              area.is_primary ? "bg-emerald-50" : "bg-slate-50"
            )}>
              <MapPin className={cn("w-5 h-5", area.is_primary ? "text-[#166534]" : "text-slate-400")} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-slate-900">{area.area_name}</h3>
                {area.is_primary && (
                  <Badge className="bg-[#166534] text-white rounded-full text-[10px] font-black uppercase tracking-widest px-2.5 h-6">Primary</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {area.zip_code && (
                  <Badge variant="outline" className="text-[10px] font-bold text-slate-400 border-black/5 rounded-full px-2.5 h-6">
                    ZIP {area.zip_code}
                  </Badge>
                )}
                <div className="flex items-center gap-2 ml-2">
                  <Switch
                    checked={area.is_active}
                    onCheckedChange={(checked) => onUpdateArea(index, 'is_active', checked)}
                    disabled={!isEditing}
                    className="scale-75 data-[state=checked]:bg-[#166534]"
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Active</span>
                </div>
              </div>
            </div>
          </div>
          
          {isEditing && canRemove && (
            <button
              onClick={() => onRemove(index)}
              className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Address Input */}
        <div className="space-y-3">
          <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Service Area Address or ZIP Code</Label>
          <AddressInput
            value={addressInputValue}
            onChange={(value) => onAddressInputChange(index, value)}
            onAddressSelect={(address) => onAddressSelect(index, address)}
            placeholder="Enter address or ZIP code (e.g., 10001)..."
            disabled={!isEditing}
            className="w-full rounded-2xl border-black/5 focus:ring-emerald-500/20"
          />
          {area.formatted_address && (
            <div className="flex items-center gap-1.5 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-[11px] font-bold text-emerald-600">
                Verified: {area.formatted_address}
              </p>
            </div>
          )}
        </div>

        {/* Travel Distance */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-slate-400" />
              <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Travel Distance</Label>
            </div>
            <span className="text-lg font-black text-[#166534]">
              {area.radius_miles} miles
            </span>
          </div>
          
          <Slider
            value={[area.radius_miles]}
            onValueChange={(value) => onUpdateArea(index, 'radius_miles', value[0])}
            min={5}
            max={50}
            step={5}
            disabled={!isEditing}
            className="w-full"
          />
          
          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-300 px-1">
            <span>5 miles</span>
            <span>25 miles</span>
            <span>50+ miles</span>
          </div>
        </div>

        {/* Primary Area Toggle */}
        <div className="flex items-center justify-between pt-6 border-t border-black/5">
          <div>
            <Label className="text-[13px] font-bold text-slate-800">Set as Primary Area</Label>
            <p className="text-[11px] font-medium text-slate-400">Your main service coverage area</p>
          </div>
          <Switch
            checked={area.is_primary}
            onCheckedChange={(checked) => onUpdateArea(index, 'is_primary', checked)}
            disabled={!isEditing}
            className="data-[state=checked]:bg-[#166534]"
          />
        </div>
      </div>
    </div>
  );
};
