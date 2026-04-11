
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProfessionalsIntegrated } from '@/hooks/useProfessionalsIntegrated';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { ProfessionalsPopupHeader } from './popup/ProfessionalsPopupHeader';
import { ProfessionalsPopupContent } from './popup/ProfessionalsPopupContent';
import { ProfessionalsPopupFooter } from './popup/ProfessionalsPopupFooter';

interface ProfessionalsPopupIntegratedProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  onBookProfessional?: (professional: any, serviceName: string) => void;
}

export const ProfessionalsPopupIntegrated = ({ 
  isOpen, 
  onClose, 
  serviceName,
  onBookProfessional 
}: ProfessionalsPopupIntegratedProps) => {
  const { currentLocation } = useLocationTracking();
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Convert location format for the hook
  const userLocation = currentLocation ? {
    lat: currentLocation.latitude,
    lng: currentLocation.longitude
  } : null;

  const { professionals, loading, hasLocation, pricingData, refetch } = useProfessionalsIntegrated({
    serviceCategory: serviceName,
    maxResults: 20,
    userLocation
  });

  // Initialize data fetch when popup opens
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      console.log('ProfessionalsPopupIntegrated: Initial data fetch for service:', serviceName);
      refetch();
      setHasInitialized(true);
    }
  }, [isOpen, hasInitialized, refetch, serviceName]);

  // Reset initialization when popup closes
  useEffect(() => {
    if (!isOpen) {
      setHasInitialized(false);
    }
  }, [isOpen]);

  const handleBookProfessional = useCallback((professional: any) => {
    if (onBookProfessional) {
      onBookProfessional(professional, serviceName);
    } else {
      const serviceParam = encodeURIComponent(serviceName);
      window.location.href = `/book/${professional.id}?service=${serviceParam}`;
    }
    onClose();
  }, [onBookProfessional, serviceName, onClose]);

  // Filter professionals with active subscriptions and relevant services
  const availableProfessionals = professionals.filter(professional => {
    // Must be active account with active subscription
    if (professional.account_status !== 'active' || 
        !['active', 'trialing'].includes(professional.subscription_status)) {
      return false;
    }
    
    return true; // Already filtered in the hook
  });

  console.log('ProfessionalsPopupIntegrated - Available professionals:', availableProfessionals.length);
  console.log('ProfessionalsPopupIntegrated - Real-time pricing data:', pricingData.length);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <ProfessionalsPopupHeader
          serviceName={serviceName}
          loading={loading}
          professionalCount={availableProfessionals.length}
          onClose={onClose}
        />

        <ProfessionalsPopupContent
          loading={loading}
          currentLocation={currentLocation}
          availableProfessionals={availableProfessionals}
          serviceName={serviceName}
          onBookProfessional={handleBookProfessional}
          onRefresh={refetch}
        />

        <ProfessionalsPopupFooter
          loading={loading}
          professionalCount={availableProfessionals.length}
          serviceName={serviceName}
        />
      </DialogContent>
    </Dialog>
  );
};
