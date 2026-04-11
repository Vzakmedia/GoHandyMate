
import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { generateAreaNameFromZipCode, extractZipCodeFromAddress } from '@/utils/zipCodeToArea';

interface AddressSuggestion {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface AddressDetails {
  formatted_address: string;
  latitude: number;
  longitude: number;
  place_id: string;
}

interface AddressInputProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: AddressDetails) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const AddressInput = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Enter address or zip code...",
  disabled = false,
  className
}: AddressInputProps) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionToken] = useState(() => Math.random().toString(36).substring(7));
  const debounceRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Check if it's a 5-digit zip code
    const isZipCode = /^\d{5}$/.test(value.trim());
    if (isZipCode) {
      // Handle zip code directly
      const areaName = generateAreaNameFromZipCode(value.trim());
      setSuggestions([{
        place_id: `zip_${value}`,
        description: `${value} - ${areaName}`,
        structured_formatting: {
          main_text: areaName,
          secondary_text: `ZIP ${value}`
        }
      }]);
      setShowSuggestions(true);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      await fetchSuggestions(value);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [value]);

  const fetchSuggestions = async (input: string) => {
    if (!input.trim()) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke('map-services/autocomplete', {
        body: {
          input: input.trim(),
          sessionToken,
          types: ['geocode', 'establishment']
        }
      });

      if (error) {
        console.error('Autocomplete error:', error);
        return;
      }

      if (data?.predictions) {
        setSuggestions(data.predictions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: AddressSuggestion) => {
    try {
      setLoading(true);
      setShowSuggestions(false);
      
      // Handle zip code suggestions
      if (suggestion.place_id.startsWith('zip_')) {
        const zipCode = suggestion.place_id.replace('zip_', '');
        const areaName = generateAreaNameFromZipCode(zipCode);
        
        // For zip codes, we'll use approximate coordinates (you might want to use a geocoding service)
        const mockCoordinates = {
          latitude: 40.7128, // Default to NYC coordinates
          longitude: -74.0060
        };
        
        onChange(suggestion.description);
        onAddressSelect({
          formatted_address: `${areaName}, ${zipCode}`,
          latitude: mockCoordinates.latitude,
          longitude: mockCoordinates.longitude,
          place_id: suggestion.place_id
        });
        return;
      }

      // Handle regular address suggestions
      const { data, error } = await supabase.functions.invoke('map-services/place-details', {
        body: {
          placeId: suggestion.place_id,
          sessionToken,
          fields: ['formatted_address', 'geometry']
        }
      });

      if (error) {
        console.error('Place details error:', error);
        return;
      }

      if (data?.geometry?.location) {
        const addressDetails: AddressDetails = {
          formatted_address: data.formatted_address,
          latitude: data.geometry.location.lat,
          longitude: data.geometry.location.lng,
          place_id: suggestion.place_id
        };

        onChange(data.formatted_address);
        onAddressSelect(addressDetails);
      }
    } catch (error) {
      console.error('Error handling suggestion click:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => value.length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          disabled={disabled}
          className="pl-10 pr-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <Button
              key={suggestion.place_id}
              variant="ghost"
              className="w-full justify-start text-left p-3 hover:bg-gray-50 border-0 rounded-none"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  {suggestion.structured_formatting ? (
                    <div>
                      <div className="font-medium text-gray-900 truncate">
                        {suggestion.structured_formatting.main_text}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {suggestion.structured_formatting.secondary_text}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-900 truncate">
                      {suggestion.description}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
