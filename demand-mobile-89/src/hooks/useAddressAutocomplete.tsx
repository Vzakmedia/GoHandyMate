import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddressSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export const useAddressAutocomplete = () => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const getSuggestions = useCallback(async (input: string, sessionToken?: string) => {
    if (!input.trim() || input.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Getting address suggestions for:', input);
      
      const { data, error: functionError } = await supabase.functions.invoke('map-services/autocomplete', {
        body: { 
          input: input.trim(),
          sessionToken,
          types: ['geocode']
        }
      });

      if (functionError) {
        console.error('Autocomplete function error:', functionError);
        const errorMessage = 'Failed to get address suggestions. Please check your Google Maps API configuration.';
        setError(errorMessage);
        toast.error(errorMessage, {
          description: 'Make sure your Google Maps API key is set up correctly in Supabase secrets.'
        });
        setSuggestions([]);
        return;
      }

      if (data?.error) {
        console.error('Google Maps API error:', data.error, data.details);
        const errorMessage = data.error;
        const errorDetails = data.details;
        setError(errorMessage);
        toast.error('Google Maps API Error', {
          description: errorDetails || errorMessage
        });
        setSuggestions([]);
        return;
      }

      console.log('Autocomplete response:', data);
      setSuggestions(data?.predictions || []);
      
      if (data?.predictions?.length === 0) {
        setError('No addresses found for your search');
        toast.info('No addresses found for your search');
      }
    } catch (error) {
      console.error('Address autocomplete error:', error);
      const errorMessage = 'Failed to get address suggestions. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        description: 'There was a network error. Please check your connection and try again.'
      });
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedGetSuggestions = useCallback((input: string, sessionToken?: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      getSuggestions(input, sessionToken);
    }, 300);
  }, [getSuggestions]);

  const getPlaceDetails = useCallback(async (placeId: string, sessionToken?: string): Promise<PlaceDetails | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('Getting place details for:', placeId);
      
      const { data, error: functionError } = await supabase.functions.invoke('map-services/place-details', {
        body: { 
          placeId,
          sessionToken,
          fields: ['place_id', 'formatted_address', 'geometry', 'address_components']
        }
      });

      if (functionError) {
        console.error('Place details function error:', functionError);
        const errorMessage = 'Failed to get place details';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }

      if (data?.error) {
        console.error('Google Maps place details error:', data.error);
        const errorMessage = data.details || data.error || 'Failed to get place details';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }

      console.log('Place details response:', data);
      return data;
    } catch (error) {
      console.error('Place details error:', error);
      const errorMessage = 'Failed to get place details';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  return {
    suggestions,
    loading,
    error,
    getSuggestions: debouncedGetSuggestions,
    getPlaceDetails,
    clearSuggestions
  };
};
