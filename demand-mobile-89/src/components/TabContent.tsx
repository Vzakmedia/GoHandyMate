
import { CustomerTabContent } from "@/components/CustomerTabContent";
import { HandymanDashboard } from "@/components/HandymanDashboard";
import { RoleProtectedRoute } from "@/features/auth";

// CONTRACTOR - PENDING (commented out)
// import { ContractorDashboard } from "@/components/ContractorDashboard";
// PROPERTY_MANAGER - Moved to customer upgrade features (commented out as standalone)
// import { PropertyManagerTabContent } from "@/components/PropertyManagerTabContent";

interface TabContentProps {
  activeTab: string;
  userRole: 'customer' | 'handyman';
  // NOTE: 'contractor' pending. 'property_manager' handled inside CustomerTabContent (upgrade-gated).
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  onTabChange?: (tab: string) => void;
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

export const TabContent = ({
  activeTab,
  userRole,
  selectedCategory,
  setSelectedCategory,
  onTabChange,
  mockTasks
}: TabContentProps) => {
  const handleBackToHome = () => {
    if (onTabChange) {
      onTabChange('home');
    }
  };

  switch (userRole) {
    case 'customer':
      return (
        <CustomerTabContent
          activeTab={activeTab}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onTabChange={onTabChange}
          mockTasks={mockTasks}
        />
      );

    case 'handyman':
      return (
        <RoleProtectedRoute
          requiredRole="handyman"
          onBackToHome={handleBackToHome}
        >
          <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
            <HandymanDashboard
              activeTab={activeTab}
              onTabChange={onTabChange || (() => { })}
            />
          </div>
        </RoleProtectedRoute>
      );

    // CONTRACTOR - PENDING (commented out)
    // case 'contractor':
    //   return (
    //     <RoleProtectedRoute requiredRole="contractor" onBackToHome={handleBackToHome}>
    //       <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
    //         <ContractorDashboard activeTab={activeTab} onTabChange={onTabChange || (() => {})} />
    //       </div>
    //     </RoleProtectedRoute>
    //   );

    // PROPERTY_MANAGER - Moved to customer upgrade features (commented out as standalone)
    // case 'property_manager':
    //   return (
    //     <RoleProtectedRoute requiredRole="property_manager" onBackToHome={handleBackToHome}>
    //       <PropertyManagerTabContent activeTab={activeTab} mockTasks={mockTasks} />
    //     </RoleProtectedRoute>
    //   );

    default:
      return (
        <div className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="text-center py-12">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Welcome to GoHandyMate</h2>
            <p className="text-gray-600 mb-6">Please select your user type to continue...</p>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                Choose from Customer or Handyman to access personalized features.
              </p>
            </div>
          </div>
        </div>
      );
  }
};
