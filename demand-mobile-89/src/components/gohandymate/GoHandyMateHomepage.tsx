import { GoHandyMateHero } from './GoHandyMateHero';
import { GoHandyMateCategories } from './GoHandyMateCategories';
import { GoHandyMateServiceCards } from './GoHandyMateServiceCards';
import { GoHandyMateTrustSection } from './GoHandyMateTrustSection';
import { ModernStatsSection } from '@/components/ModernStatsSection';
import { TopProfessionals } from '@/components/TopProfessionals';

export const GoHandyMateHomepage = () => {
  return (
    <div className="min-h-screen">
      {/* GoHandyMate Hero Section */}
      <GoHandyMateHero />
      
      {/* Category Navigation */}
      <GoHandyMateCategories />
      
      {/* Service Cards with Human Images */}
      <GoHandyMateServiceCards />
      
      {/* Trust Section */}
      <GoHandyMateTrustSection />
      
      {/* Top Professionals - Contractor section from previous design */}
      <TopProfessionals />
    </div>
  );
};