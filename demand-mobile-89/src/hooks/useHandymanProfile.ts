
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HandymanProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  user_role: string;
  account_status: string;
  subscription_plan?: string;
  handyman_data?: {
    hourly_rate?: number;
    skills?: string[];
    phone?: string;
    availability?: string;
  };
  skill_rates?: Array<{
    skill_name: string;
    hourly_rate: number;
    is_active: boolean;
  }>;
  service_pricing?: Array<{
    id: string;
    user_id: string;
    category_id: string;
    subcategory_id?: string;
    base_price: number;
    custom_price?: number;
    is_active: boolean;
    same_day_multiplier: number;
    emergency_multiplier: number;
    created_at: string;
    updated_at: string;
  }>;
  distance?: number;
  rating?: number;
  reviewCount?: number;
  completedJobs?: number;
}

export const useHandymanProfile = (handymanId: string) => {
  const [handyman, setHandyman] = useState<HandymanProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (handymanId) {
      fetchHandymanData();
    }
  }, [handymanId]);

  const fetchHandymanData = async () => {
    try {
      setLoading(true);
      console.log('Fetching handyman data for ID:', handymanId);

      // Try to fetch the specific handyman by user ID first
      const { data, error } = await supabase.functions.invoke('get-professionals', {
        body: {
          type: 'handyman',
          userId: handymanId,
          includeServicePricing: true
        }
      });

      if (error) {
        console.error('Error from get-professionals function:', error);
        throw error;
      }

      console.log('Received data from get-professionals:', data);

      // The function should return the specific user when userId is provided
      let handymanData = null;
      
      if (Array.isArray(data) && data.length > 0) {
        // If it's an array, find the specific handyman
        handymanData = data.find((h: any) => h.id === handymanId);
      } else if (data && typeof data === 'object' && data.id) {
        // If it's a single object with the right ID
        handymanData = data.id === handymanId ? data : null;
      }

      if (handymanData) {
        console.log('Found handyman data:', handymanData);
        setHandyman(handymanData);
      } else {
        console.error('Handyman not found in response data');
        console.log('Available data:', data);
        
        // Try fallback: fetch all handymen and filter
        const fallbackResponse = await supabase.functions.invoke('get-professionals', {
          body: {
            type: 'handyman',
            includeServicePricing: true
          }
        });

        if (!fallbackResponse.error && Array.isArray(fallbackResponse.data)) {
          const fallbackHandyman = fallbackResponse.data.find((h: any) => h.id === handymanId);
          if (fallbackHandyman) {
            console.log('Found handyman via fallback:', fallbackHandyman);
            setHandyman(fallbackHandyman);
          } else {
            console.error('Handyman not found even in fallback');
            toast.error('Handyman profile not found');
          }
        } else {
          toast.error('Handyman profile not found');
        }
      }
    } catch (error) {
      console.error('Error fetching handyman data:', error);
      toast.error('Failed to load handyman profile');
    } finally {
      setLoading(false);
    }
  };

  return { handyman, loading, refetch: fetchHandymanData };
};
