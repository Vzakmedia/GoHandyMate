
import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { usePublicHandymanData } from '@/hooks/usePublicHandymanData';
import { useHandymanProfile } from '@/hooks/booking/useHandymanProfile';
import { useBookingSubmission } from '@/hooks/booking/useBookingSubmission';

interface BookingFormData {
  service: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  estimatedHours: number;
  urgency: string;
}

export const useBookingPage = () => {
  const { handymanId } = useParams<{ handymanId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get service and pricing from URL params
  const serviceFromUrl = searchParams.get('service') || '';
  const priceFromUrl = searchParams.get('price') || '';
  const categoryFromUrl = searchParams.get('category') || '';
  const subcategoryFromUrl = searchParams.get('subcategory') || '';
  
  // Get handyman data including pricing
  const { data: handymanData, loading: handymanDataLoading } = usePublicHandymanData(handymanId || '');
  
  // Get handyman profile
  const { handyman, loading: profileLoading } = useHandymanProfile(handymanId);
  
  const [formData, setFormData] = useState<BookingFormData>({
    service: serviceFromUrl,
    description: '',
    preferredDate: '',
    preferredTime: '',
    location: '',
    estimatedHours: 1,
    urgency: 'flexible'
  });

  // Get booking submission handler
  const { submitting, handleSubmit: submitBooking } = useBookingSubmission(
    handyman,
    handymanId,
    serviceFromUrl,
    priceFromUrl,
    categoryFromUrl,
    subcategoryFromUrl,
    handymanData
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitBooking(formData);
  };

  return {
    handymanId,
    handyman,
    loading: profileLoading || handymanDataLoading,
    submitting,
    formData,
    setFormData,
    handleSubmit,
    serviceFromUrl,
    priceFromUrl,
    categoryFromUrl,
    subcategoryFromUrl,
    handymanData,
    navigate
  };
};
