
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { getSelectedServicePricing, getServiceName, calculateEstimatedCost } from '@/utils/bookingUtils';

interface HandymanProfile {
  id: string;
  full_name: string;
  user_role: 'handyman';
}

interface BookingFormData {
  service: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  estimatedHours: number;
  urgency: string;
}

export const useBookingSubmission = (
  handyman: HandymanProfile | null,
  handymanId: string | undefined,
  serviceFromUrl: string,
  priceFromUrl: string,
  categoryFromUrl: string,
  subcategoryFromUrl: string,
  handymanData: any
) => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (formData: BookingFormData) => {
    if (!user) {
      toast.error('Please sign in to book a service');
      return;
    }

    if (!handyman) {
      toast.error('Professional information not available');
      return;
    }

    // Validate required fields
    if (!formData.service.trim() && !serviceFromUrl) {
      toast.error('Please specify the service type');
      return;
    }

    if (!formData.location.trim()) {
      toast.error('Please provide the service location');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare the preferred schedule
      let preferredSchedule = null;
      if (formData.preferredDate && formData.preferredTime) {
        preferredSchedule = new Date(`${formData.preferredDate}T${formData.preferredTime}`).toISOString();
      }

      const serviceName = getServiceName(serviceFromUrl, categoryFromUrl, subcategoryFromUrl);
      const finalCost = calculateEstimatedCost(
        getSelectedServicePricing(priceFromUrl, categoryFromUrl, subcategoryFromUrl, serviceFromUrl, handymanData),
        formData.estimatedHours,
        formData.urgency
      );

      // For test handyman, create a mock job but don't insert to database
      if (handymanId === '550e8400-e29b-41d4-a716-446655440000') {
        console.log('useBookingSubmission: Creating mock booking for test handyman');
        console.log('Mock booking created:', {
          title: `${serviceName} - ${handyman.full_name}`,
          description: formData.description || `${serviceName} service requested`,
          category: serviceName,
          customer_id: user.id,
          assigned_to_user_id: handymanId,
          location: formData.location,
          preferred_schedule: preferredSchedule,
          priority: formData.urgency === 'emergency' ? 'high' : formData.urgency === 'same_day' ? 'medium' : 'low',
          status: 'pending',
          budget: finalCost,
          job_type: 'handyman_service'
        });
        
        toast.success(`Test booking submitted successfully for ${serviceName}!`);
        navigate('/', { 
          state: { 
            message: `Your test booking for ${serviceName} has been submitted successfully!` 
          }
        });
        return;
      }

      const jobData = {
        title: `${serviceName} - ${handyman.full_name}`,
        description: formData.description || `${serviceName} service requested`,
        category: serviceName,
        customer_id: user.id,
        assigned_to_user_id: handymanId,
        location: formData.location,
        preferred_schedule: preferredSchedule,
        priority: formData.urgency === 'emergency' ? 'high' : formData.urgency === 'same_day' ? 'medium' : 'low',
        status: 'pending',
        budget: finalCost,
        job_type: handyman.user_role === 'handyman' ? 'handyman_service' : 'contractor_service'
      };

      console.log('useBookingSubmission: Creating job request:', jobData);

      const { data, error } = await supabase
        .from('job_requests')
        .insert(jobData)
        .select()
        .single();

      if (error) {
        console.error('useBookingSubmission: Database insertion error:', error);
        throw error;
      }

      console.log('useBookingSubmission: Job request created successfully:', data);
      
      toast.success(`Booking request submitted successfully for ${serviceName}!`);
      
      navigate('/', { 
        state: { 
          message: `Your booking request for ${serviceName} has been submitted successfully!` 
        }
      });
      
    } catch (error: any) {
      console.error('useBookingSubmission: Error submitting booking:', error);
      
      if (error.code === '23503') {
        toast.error('Invalid professional or user information. Please try again.');
      } else if (error.code === '23502') {
        toast.error('Missing required information. Please fill in all required fields.');
      } else if (error.message?.includes('RLS')) {
        toast.error('Permission denied. Please make sure you are signed in.');
      } else {
        toast.error(`Failed to submit booking request: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    handleSubmit
  };
};
