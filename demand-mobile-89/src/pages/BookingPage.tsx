
import { LoadingScreen } from '@/components/LoadingScreen';
import { BookingForm } from '@/components/booking/BookingForm';
import { ProfessionalInfoCard } from '@/components/booking/ProfessionalInfoCard';
import { BookingPageHeader } from '@/components/booking/BookingPageHeader';
import { BookingErrorState } from '@/components/booking/BookingErrorState';
import { getSelectedServicePricing, getServiceName, calculateEstimatedCost } from '@/utils/bookingUtils';
import { useBookingPage } from '@/hooks/useBookingPage';

export const BookingPage = () => {
  const {
    handymanId,
    handyman,
    loading,
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
  } = useBookingPage();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!handymanId) {
    return (
      <BookingErrorState
        title="Invalid Booking Link"
        message="No handyman ID provided in the URL."
        onBack={() => navigate('/')}
      />
    );
  }

  if (!handyman) {
    return (
      <BookingErrorState
        title="Professional Not Found"
        message="The requested professional profile could not be found."
        onBack={() => navigate('/')}
      />
    );
  }

  const serviceName = getServiceName(serviceFromUrl, categoryFromUrl, subcategoryFromUrl);
  const serviceRate = getSelectedServicePricing(
    priceFromUrl,
    categoryFromUrl,
    subcategoryFromUrl,
    serviceFromUrl,
    handymanData
  );
  const estimatedCost = calculateEstimatedCost(serviceRate, formData.estimatedHours, formData.urgency);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <BookingPageHeader
        serviceName={serviceName}
        handymanName={handyman.full_name}
        userRole={handyman.user_role}
        onBack={() => navigate('/')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProfessionalInfoCard
          handyman={handyman}
          serviceName={serviceName}
          serviceRate={serviceRate}
          categoryFromUrl={categoryFromUrl}
        />

        <BookingForm
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          submitting={submitting}
          serviceName={serviceName}
          serviceRate={serviceRate}
          estimatedCost={estimatedCost}
          serviceFromUrl={serviceFromUrl}
          categoryFromUrl={categoryFromUrl}
        />
      </div>
    </div>
  );
};
