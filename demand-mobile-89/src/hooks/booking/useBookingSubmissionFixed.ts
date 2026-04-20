import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

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

export const useBookingSubmissionFixed = (
  handyman: HandymanProfile | null,
  handymanId: string | undefined,
  serviceFromUrl: string,
  priceFromUrl: string,
  categoryFromUrl: string,
  subcategoryFromUrl: string
) => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const calculateEstimatedCost = (basePrice: number, hours: number, urgency: string): number => {
    let cost = basePrice * hours;
    
    switch (urgency) {
      case 'emergency':
        cost *= 2.0;
        break;
      case 'same_day':
        cost *= 1.5;
        break;
      default:
        break;
    }
    
    return Math.round(cost);
  };

  const getServiceName = (service: string, category: string, subcategory: string): string => {
    if (service && service.trim()) return service.trim();
    if (subcategory && subcategory.trim()) return subcategory.trim();
    if (category && category.trim()) return category.trim();
    return 'General Service';
  };

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
      const basePrice = parseFloat(priceFromUrl) || 75; // Default fallback price
      const finalCost = calculateEstimatedCost(basePrice, formData.estimatedHours, formData.urgency);

      // For test handyman, create a mock booking but don't insert to database
      if (handymanId === '550e8400-e29b-41d4-a716-446655440000') {
        console.log('useBookingSubmissionFixed: Creating mock booking for test handyman');
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
        job_type: 'handyman_service'
      };

      console.log('useBookingSubmissionFixed: Creating job request:', jobData);

      // Try the booking request edge function first
      try {
        const { data: edgeFunctionResult, error: edgeFunctionError } = await supabase.functions.invoke('booking-request', {
          body: jobData
        });

        if (edgeFunctionError) {
          throw edgeFunctionError;
        }

        if (edgeFunctionResult && edgeFunctionResult.success) {
          console.log('useBookingSubmissionFixed: Edge function booking successful:', edgeFunctionResult);
          toast.success(`Booking request submitted successfully for ${serviceName}!`);
          navigate('/', { 
            state: { 
              message: `Your booking request for ${serviceName} has been submitted successfully!` 
            }
          });
          return;
        }
      } catch (edgeFunctionError) {
        console.log('useBookingSubmissionFixed: Edge function failed, trying direct database insert:', edgeFunctionError);
      }

      // Fallback to direct database insertion
      const { data, error } = await supabase
        .from('job_requests')
        .insert(jobData)
        .select()
        .single();

      if (error) {
        console.error('useBookingSubmissionFixed: Database insertion error:', error);
        throw error;
      }

      console.log('useBookingSubmissionFixed: Job request created successfully:', data);
      
      toast.success(`Booking request submitted successfully for ${serviceName}!`);
      
      navigate('/', { 
        state: { 
          message: `Your booking request for ${serviceName} has been submitted successfully!` 
        }
      });
      
    } catch (error: any) {
      console.error('useBookingSubmissionFixed: Error submitting booking:', error);
      
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