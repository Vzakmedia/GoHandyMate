
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
  userRole: 'customer' | 'handyman' | 'contractor' | 'property_manager';
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
        {(userRole === 'handyman' || userRole === 'contractor') && (
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

        {userRole === 'property_manager' && (
          <>
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                Recent Service Requests
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                Manage your properties efficiently
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mockTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.location} • {task.timeAgo}</p>
                  <p className="text-lg font-bold text-green-600">${task.price}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modern Testimonials Section */}
      <ModernTestimonialsSection />
    </main>
  );
};
