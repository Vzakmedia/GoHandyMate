
import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { ProfessionalsPopupHeader } from './popup/ProfessionalsPopupHeader';
import { ProfessionalsPopupContent } from './popup/ProfessionalsPopupContent';
import { ProfessionalsPopupFooter } from './popup/ProfessionalsPopupFooter';

interface ProfessionalsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  onBookProfessional?: (professional: any, serviceName: string) => void;
}

export const ProfessionalsPopup = ({ 
  isOpen, 
  onClose, 
  serviceName,
  onBookProfessional 
}: ProfessionalsPopupProps) => {
  const { currentLocation } = useLocationTracking();
  const [hasInitialized, setHasInitialized] = useState(false);
  
  // Convert location format for the hook - memoize to prevent re-renders
  const userLocation = currentLocation ? {
    lat: currentLocation.latitude,
    lng: currentLocation.longitude
  } : null;

  const { professionals, loading, hasLocation, refetch } = useProfessionals({
    serviceCategory: serviceName,
    maxResults: 20,
    userLocation,
    includeServicePricing: true
  });

  // Only refetch when popup opens for the first time or service changes
  useEffect(() => {
    if (isOpen && !hasInitialized) {
      console.log('ProfessionalsPopup: Initial data fetch for service:', serviceName);
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

  // Filter professionals who are actually available and have the service
  const availableProfessionals = professionals.filter(professional => {
    // Must be active account with active subscription
    if (professional.account_status !== 'active' || 
        !['active', 'trialing'].includes(professional.subscription_status)) {
      return false;
    }
    
    // Check if they have custom pricing for this service
    if (professional.service_pricing && professional.service_pricing.length > 0) {
      const hasServicePricing = professional.service_pricing.some(pricing => 
        pricing.is_active && (
          pricing.category_id === serviceName.toLowerCase() ||
          pricing.subcategory_id === serviceName.toLowerCase()
        )
      );
      if (hasServicePricing) return true;
    }
    
    // Check if they have relevant skills
    if (professional.skill_rates && professional.skill_rates.length > 0) {
      const hasRelevantSkill = professional.skill_rates.some(skill => 
        skill.is_active && (
          skill.skill_name.toLowerCase().includes(serviceName.toLowerCase()) ||
          serviceName.toLowerCase().includes(skill.skill_name.toLowerCase())
        )
      );
      if (hasRelevantSkill) return true;
    }
    
    return false;
  });

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
