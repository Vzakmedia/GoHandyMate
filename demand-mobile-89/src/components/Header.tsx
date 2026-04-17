
import { useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { useResponsiveBreakpoints } from "@/hooks/useResponsiveBreakpoints";
import { useNavigate } from "react-router-dom";
import { HeaderLogo } from "./header/HeaderLogo";
import { HeaderDesktopNav } from "./header/HeaderDesktopNav";
import { HeaderMobileActions } from "./header/HeaderMobileActions";
import { HeaderMobileMenu } from "./header/HeaderMobileMenu";
import { HeaderAuthModal } from "./header/HeaderAuthModal";
import { HeaderDesktopTabs } from "./header/HeaderDesktopTabs";

interface HeaderProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onChangeRole?: () => void;
  hideLogoOnDesktop?: boolean;
}

export const Header = ({ activeTab, onTabChange, onChangeRole, hideLogoOnDesktop = false }: HeaderProps) => {
  const { userRole, setUserRole, setIsAuthenticated } = useUserRole();
  const { user, profile, signOut } = useAuth();
  const { isMobile, isTablet } = useResponsiveBreakpoints();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleChangeRole = () => {
    console.log('Change role clicked - resetting to welcome screen');

    // Sign out if user is logged in
    if (user) {
      signOut();
    }

    // Reset user role and authentication state immediately
    setUserRole(null);
    setIsAuthenticated(false);
    setIsMenuOpen(false);

    // Reset tab to home immediately
    if (onTabChange) {
      onTabChange('home');
    }

    // Call the parent's change role handler if provided
    if (onChangeRole) {
      onChangeRole();
    } else {
      // Navigate to home page (this will trigger the welcome screen due to userRole being null)
      navigate('/');
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore — still clear session below
    }
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) localStorage.removeItem(key);
      });
    } catch (e) {
      // ignore storage errors
    }
    window.location.replace('/');
  };

  const handleSignInClick = () => {
    setShowAuthModal(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isAdmin = profile?.user_role === 'admin';

  const handleAdminBackendClick = () => {
    console.log('Header: Navigating to admin backend');
    navigate('/admin/backend');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/95">
        <div className="flex h-14 sm:h-16 md:h-18 items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8">
          <div className={`flex-shrink-0 ${hideLogoOnDesktop ? "lg:hidden" : ""}`}>
            <HeaderLogo />
          </div>

          {/* Desktop Navigation Group */}
          <div className="hidden lg:flex flex-1 justify-end items-center">
            <HeaderDesktopNav
              user={user}
              userRole={userRole}
              isAdmin={isAdmin}
              onSignInClick={handleSignInClick}
              onChangeRole={handleChangeRole}
              onSignOut={handleSignOut}
            />
            {isAdmin && (
              <button
                onClick={handleAdminBackendClick}
                className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Admin Backend
              </button>
            )}
          </div>

          {/* Mobile Actions Group Hamburger */}
          <div className="flex lg:hidden flex-1 justify-end items-center ml-auto">
            <HeaderMobileActions
              user={user}
              userRole={userRole}
              isMenuOpen={isMenuOpen}
              onToggleMenu={toggleMenu}
              onSignInClick={handleSignInClick}
            />
          </div>
        </div>
      </header>

      <HeaderMobileMenu
        user={user}
        userRole={userRole}
        isAdmin={isAdmin}
        isMenuOpen={isMenuOpen}
        isMobile={isMobile}
        isTablet={isTablet}
        onToggleMenu={toggleMenu}
        onSignInClick={handleSignInClick}
        onChangeRole={handleChangeRole}
        onSignOut={handleSignOut}
      />

      <HeaderAuthModal
        showAuthModal={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};
