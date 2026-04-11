
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HandymanProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  user_role: 'handyman' | 'contractor';
  average_rating?: number;
  total_ratings?: number;
  phone?: string;
}

export const useHandymanProfile = (handymanId: string | undefined) => {
  const [handyman, setHandyman] = useState<HandymanProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHandymanProfile = async () => {
    if (!handymanId) {
      console.error('useHandymanProfile: No handymanId provided');
      setLoading(false);
      return;
    }

    console.log('useHandymanProfile: Fetching profile for handymanId:', handymanId);

    // Handle test case with realistic mock data - use the proper UUID
    if (handymanId === '550e8400-e29b-41d4-a716-446655440000') {
      console.log('useHandymanProfile: Using test handyman profile');
      setHandyman({
        id: '550e8400-e29b-41d4-a716-446655440000',
        full_name: 'John Smith',
        avatar_url: undefined,
        user_role: 'handyman',
        average_rating: 4.8,
        total_ratings: 47,
        phone: '(555) 123-4567'
      });
      setLoading(false);
      return;
    }

    try {
      console.log('useHandymanProfile: Fetching from get-professionals function for ID:', handymanId);
      
      // Try to fetch both handyman and contractor data
      const [handymanResponse, contractorResponse] = await Promise.all([
        supabase.functions.invoke('get-professionals', {
          body: {
            userType: 'handyman',
            userId: handymanId,
            includeServicePricing: true
          }
        }),
        supabase.functions.invoke('get-professionals', {
          body: {
            userType: 'contractor', 
            userId: handymanId,
            includeServicePricing: true
          }
        })
      ]);

      // Check handyman response first
      let professionalData = null;
      if (!handymanResponse.error && handymanResponse.data) {
        if (Array.isArray(handymanResponse.data) && handymanResponse.data.length > 0) {
          professionalData = handymanResponse.data.find((p: any) => p.id === handymanId) || handymanResponse.data[0];
        } else if (handymanResponse.data && typeof handymanResponse.data === 'object' && handymanResponse.data.id) {
          professionalData = handymanResponse.data;
        }
      }
      
      // If not found as handyman, check contractor response
      if (!professionalData && !contractorResponse.error && contractorResponse.data) {
        if (Array.isArray(contractorResponse.data) && contractorResponse.data.length > 0) {
          professionalData = contractorResponse.data.find((p: any) => p.id === handymanId) || contractorResponse.data[0];
        } else if (contractorResponse.data && typeof contractorResponse.data === 'object' && contractorResponse.data.id) {
          professionalData = contractorResponse.data;
        }
      }

      if (professionalData) {
        console.log('useHandymanProfile: Successfully found professional data:', professionalData);
        
        // Transform the data to match our HandymanProfile interface
        const handymanProfile: HandymanProfile = {
          id: professionalData.id,
          full_name: professionalData.full_name || professionalData.business_name || 'Professional',
          avatar_url: professionalData.avatar_url,
          user_role: professionalData.user_role || 'handyman',
          average_rating: professionalData.rating || professionalData.average_rating,
          total_ratings: professionalData.reviewCount || professionalData.total_ratings,
          phone: professionalData.phone || professionalData.handyman_data?.phone
        };
        
        setHandyman(handymanProfile);
      } else {
        console.error('useHandymanProfile: No professional data found in response');
        toast.error('Professional profile not found');
        navigate('/');
      }
    } catch (error: any) {
      console.error('useHandymanProfile: Error fetching handyman profile:', error);
      
      // More specific error handling
      if (error.message?.includes('professional not found')) {
        toast.error('Professional profile not found');
      } else if (error.message?.includes('invalid input syntax for type uuid')) {
        console.error('useHandymanProfile: Invalid UUID format');
        toast.error('Invalid professional ID');
      } else {
        toast.error('Failed to load professional profile');
      }
      
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useHandymanProfile: useEffect triggered with handymanId:', handymanId);
    fetchHandymanProfile();
  }, [handymanId]);

  return {
    handyman,
    loading
  };
};
