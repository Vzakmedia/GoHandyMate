
import { useState } from "react";
import { useResponsiveBreakpoints } from "@/hooks/useResponsiveBreakpoints";
import { Header } from "@/components/Header";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { BottomNavigation } from "@/components/BottomNavigation";
import { TabContent } from "@/components/TabContent";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import { AuthScreen } from "@/features/auth";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { DashboardTopbar } from "@/components/DashboardTopbar";

interface MainAppLayoutProps {
  userRole: 'customer' | 'handyman';
  // NOTE: 'contractor' pending. 'property_manager' merged into customer upgrade features.
  isAuthenticated: boolean;
  user: {
    id: string;
    email?: string;
    name?: string;
    [key: string]: any;
  } | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
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
  onChangeRole?: () => void;
  showWelcome?: boolean;
}

export const MainAppLayout = ({
  userRole,
  isAuthenticated,
  user,
  activeTab,
  onTabChange,
  selectedCategory,
  setSelectedCategory,
  mockTasks,
  onChangeRole,
  showWelcome
}: MainAppLayoutProps) => {
  const { isMobile, isTablet, isFoldable } = useResponsiveBreakpoints();
  const [isServiceRequestOpen, setIsServiceRequestOpen] = useState(false);
  const navigate = useNavigate();

  const handleServiceRequest = (requestData: any) => {
    // If user is not authenticated, redirect to auth screen
    if (!user) {
      return <AuthScreen onBack={() => {
        setIsServiceRequestOpen(false);
        navigate('/app', { replace: true });
      }} />;
    }
    console.log('Service request submitted:', requestData);
    setIsServiceRequestOpen(false);
  };

  const handleFloatingActionClick = () => {
    // If user is not authenticated, redirect to auth screen instead of opening service request
    if (!user) {
      // We'll handle this by showing auth screen in the modal
      setIsServiceRequestOpen(true);
    } else {
      setIsServiceRequestOpen(true);
    }
  };

  // Safety check for required props
  if (!userRole || !activeTab || !onTabChange) {
    console.error('MainAppLayout: Missing required props', { userRole, activeTab, onTabChange });
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your app</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveLayout className="bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Persistent Sidebar for Desktop */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          onChangeRole={onChangeRole}
        />

        <div className={`
          flex-1 flex flex-col min-h-0 relative h-full overflow-hidden
          ${isMobile || isTablet ? 'pb-20 sm:pb-24' : ''}
          lg:pb-0
        `}>
          <DashboardTopbar
            profileName={user?.name}
            userRole={userRole || 'customer'}
            onChangeRole={onChangeRole || (() => { })}
          />

          <main className="flex-1 overflow-y-auto scrollbar-hide bg-slate-50/30">
            <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
              <TabContent
                activeTab={activeTab}
                userRole={userRole || 'customer'}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onTabChange={onTabChange}
                mockTasks={mockTasks}
              />
            </div>
          </main>

          {/* Floating Action Button - only for customers on home tab and mobile/tablet */}
          {(userRole === 'customer' || !user) && activeTab === 'home' && (
            <div className="lg:hidden">
              <FloatingActionButton
                onClick={handleFloatingActionClick}
                className={`
                  ${isMobile ? 'bottom-20 right-3 w-12 h-12 sm:bottom-24 sm:right-4 sm:w-14 sm:h-14' : ''}
                  ${isTablet ? 'bottom-24 right-4 w-14 h-14 sm:bottom-28 sm:right-6 sm:w-16 sm:h-16' : ''}
                  ${isFoldable ? 'bottom-28 right-6 w-16 h-16 sm:bottom-32 sm:right-8 sm:w-18 sm:h-18' : ''}
                `}
              />
            </div>
          )}

          {/* Service Request Modal */}
          {isServiceRequestOpen && (
            <div className={`
              fixed inset-0 z-50 bg-black/50 flex items-center justify-center
              ${isMobile ? 'p-3' : isTablet ? 'p-4' : 'p-6'}
            `}>
              <div className={`
                bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto
                ${isMobile ? 'w-full max-w-[calc(100vw-24px)]' : isTablet ? 'w-full max-w-md' : 'w-full max-w-lg'}
              `}>
                {!user ? (
                  <AuthScreen onBack={() => {
                    setIsServiceRequestOpen(false);
                    navigate('/app', { replace: true });
                  }} />
                ) : (
                  <ServiceRequestForm
                    onClose={() => setIsServiceRequestOpen(false)}
                    onSubmit={handleServiceRequest}
                  />
                )}
              </div>
            </div>
          )}

          {/* Bottom Navigation - only show on mobile/tablet and not during role selection */}
          {(() => {
            console.log('🔄 MainAppLayout: showWelcome =', showWelcome, 'should hide nav =', !!showWelcome);
            return !showWelcome && (
              <div className="lg:hidden">
                <BottomNavigation
                  activeTab={activeTab}
                  onTabChange={(tab) => {
                    console.log('🔄 MainAppLayout: Tab change requested:', tab, 'current activeTab:', activeTab);
                    onTabChange(tab);
                  }}
                />
              </div>
            );
          })()}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

