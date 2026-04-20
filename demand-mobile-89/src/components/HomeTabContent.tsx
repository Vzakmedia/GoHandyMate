
import { HeroSection } from "@/components/HeroSection";
import { ModernAdvertisingSection } from "@/components/ModernAdvertisingSection";
import { ModernFindServicesSection } from "@/components/ModernFindServicesSection";
import { TopProfessionals } from "@/components/TopProfessionals";
import { ModernStatsSection } from "@/components/ModernStatsSection";
import { ModernTestimonialsSection } from "@/components/ModernTestimonialsSection";
import { ModernFeaturesSection } from "@/components/ModernFeaturesSection";
import { ProviderJobsSection } from "@/components/ProviderJobsSection";
import { GoHandyMateHomepage } from "@/components/gohandymate/GoHandyMateHomepage";

interface HomeTabContentProps {
  userRole: 'customer' | 'handyman';
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  mockTasks: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    location: string;
    timeAgo: string;
    taskerCount: number;
    urgency: string;
  }>;
}

export const HomeTabContent = ({ 
  userRole, 
  selectedCategory, 
  setSelectedCategory, 
  mockTasks 
}: HomeTabContentProps) => {
  // For customers, show GoHandyMate-style homepage
  if (userRole === 'customer') {
    return <GoHandyMateHomepage />;
  }

  // For other user roles, keep existing design
  return (
    <main className="pb-16 sm:pb-20 lg:pb-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Modern Stats Section */}
      <ModernStatsSection />

      {/* Modern Advertisement Section - Placed after stats section */}
      <ModernAdvertisingSection />

      {/* Modern Find Services Section - Now with real-time sync */}
      <ModernFindServicesSection />

      {/* Modern Features Section */}
      <ModernFeaturesSection />

      {/* Content based on user role */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
        {userRole === 'handyman' && (
          <>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Recent Job Opportunities
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                Find your next project and grow your business
              </p>
            </div>
            <ProviderJobsSection mockTasks={mockTasks} />
          </>
        )}
        {/* contractor and property_manager cases removed — those roles are archived */}
      </div>

      {/* Modern Testimonials Section */}
      <ModernTestimonialsSection />
    </main>
  );
};
