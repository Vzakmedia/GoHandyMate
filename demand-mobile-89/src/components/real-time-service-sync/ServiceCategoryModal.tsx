
import { useState } from 'react';
import type { ServiceCategory, HandymanService } from './types';
import { SubservicesModal } from './SubservicesModal';
import { ProfessionalsListModal } from './ProfessionalsListModal';
import { HandymanProfileModal } from './HandymanProfileModal';

interface ServiceCategoryModalProps {
  selectedCategory: ServiceCategory | null;
  onClose: () => void;
}

export const ServiceCategoryModal = ({ selectedCategory, onClose }: ServiceCategoryModalProps) => {
  const [showSubservices, setShowSubservices] = useState(false);
  const [showProfessionals, setShowProfessionals] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedSubservice, setSelectedSubservice] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<HandymanService[]>([]);
  const [selectedHandymanId, setSelectedHandymanId] = useState<string>('');

  const handleCategorySelect = (category: ServiceCategory) => {
    setShowSubservices(true);
  };

  const handleProfessionalsView = (subserviceName: string, services: HandymanService[]) => {
    setSelectedSubservice(subserviceName);
    setSelectedServices(services);
    setShowSubservices(false);
    setShowProfessionals(true);
  };

  const handleProfileView = (handymanId: string) => {
    setSelectedHandymanId(handymanId);
    setShowProfessionals(false);
    setShowProfile(true);
  };

  const handleCloseSubservices = () => {
    setShowSubservices(false);
    onClose();
  };

  const handleCloseProfessionals = () => {
    setShowProfessionals(false);
    setShowSubservices(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setShowProfessionals(true);
  };

  // Show the category modal first
  if (selectedCategory && !showSubservices && !showProfessionals && !showProfile) {
    handleCategorySelect(selectedCategory);
  }

  return (
    <>
      <SubservicesModal
        category={showSubservices ? selectedCategory : null}
        onClose={handleCloseSubservices}
        onProfessionalsView={handleProfessionalsView}
      />
      
      <ProfessionalsListModal
        isOpen={showProfessionals}
        onClose={handleCloseProfessionals}
        subserviceName={selectedSubservice}
        services={selectedServices}
        onProfileView={handleProfileView}
      />
      
      <HandymanProfileModal
        isOpen={showProfile}
        onClose={handleCloseProfile}
        handymanId={selectedHandymanId}
      />
    </>
  );
};
