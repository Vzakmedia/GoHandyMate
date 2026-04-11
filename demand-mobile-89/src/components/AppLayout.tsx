import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/features/auth';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Header } from '@/components/Header';
import { PublicHeader } from '@/components/PublicHeader';
import { Footer } from '@/components/Footer';

import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { usePlatform } from '@/utils/platform';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const { user } = useAuth();
  const { isMobile, isTablet } = useResponsiveBreakpoints();
  const { isNative, isWeb, viewType } = usePlatform();

  // Get active tab based on current route for external pages
  const getActiveTabFromRoute = () => {
    const path = location.pathname;

    // Map certain routes to tabs
    if (path.startsWith('/help') || path === '/about-us' || path === '/how-it-works') {
      return 'home';
    }
    if (path.startsWith('/handyman') || path.startsWith('/contractors') || path === '/services') {
      return 'search';
    }
    if (path.startsWith('/pro-community') || path.startsWith('/success-stories')) {
      return 'community';
    }
    if (path.startsWith('/sign-up-pro') || path.startsWith('/pro-resources')) {
      return 'profile';
    }

    return 'home'; // Default fallback
  };

  const handleTabChange = (tab: string) => {
    // Navigate back to main app with the selected tab as URL parameter
    navigate(`/?tab=${tab}`);
  };

  // Don't show navigation on admin pages, specific routes, or the main /app dashboard (which handles its own header/sidebar)
  const hideNavigation = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/book/') ||
    location.pathname === '/post-job' ||
    location.pathname === '/professionals' ||
    location.pathname === '/video-manager' ||
    location.pathname === '/app';

  // Show bottom navigation on most pages, hide only on specific admin/booking pages
  // Special case: hide on root path (welcome screen and auth screen)
  const isWelcomeOrAuthScreen = location.pathname === '/';
  const showBottomNav = !hideNavigation && !isWelcomeOrAuthScreen && location.pathname !== '/app';

  // Define landing pages that should use the PublicHeader
  const isLandingPage = [
    '/', '/onboarding', '/about-us', '/how-it-works', '/services',
    '/careers', '/press', '/investor-relations', '/partnerships',
    '/privacy-policy', '/terms-of-service', '/cookie-policy',
    '/accessibility', '/safety', '/trust-safety', '/help-center',
    '/customer-reviews', '/payment-protection', '/sign-up-pro',
    '/pro-resources', '/success-stories', '/pro-community'
  ].includes(location.pathname) || location.pathname.startsWith('/help/');

  console.log('🔄 AppLayout: showBottomNav =', showBottomNav, 'pathname =', location.pathname, 'userRole =', userRole, 'isWelcomeOrAuthScreen =', isWelcomeOrAuthScreen);

  return (
    <div className={`min-h-screen flex flex-col ${isNative ? 'bg-background' : 'bg-gray-50'}`}>
      {/* Header for non-main-app internal pages */}
      {!isLandingPage && location.pathname !== '/' && !hideNavigation && (
        <Header
          activeTab={getActiveTabFromRoute()}
          onTabChange={handleTabChange}
        />
      )}

      {/* Public Header for landing pages */}
      {isLandingPage && !hideNavigation && location.pathname !== '/app' && (
        <PublicHeader />
      )}

      {/* Main content with native app styling */}
      <main className={`flex-1 ${isNative ? 'pt-safe-area-top pb-safe-area-bottom' : ''} ${showBottomNav && (isMobile || isTablet) ? 'pb-16 sm:pb-20' : ''}`}>
        {children}
      </main>

      {/* Footer - show only on desktop web view */}
      {!hideNavigation && viewType === 'web-view' && !isMobile && !isTablet && location.pathname !== '/onboarding' && location.pathname !== '/' && <Footer />}

      {/* Bottom Navigation - show on all pages except admin and root path */}
      {showBottomNav && location.pathname !== '/' && (
        <div className="lg:hidden">
          <BottomNavigation
            activeTab={getActiveTabFromRoute()}
            onTabChange={handleTabChange}
          />
        </div>
      )}
    </div>
  );
};
