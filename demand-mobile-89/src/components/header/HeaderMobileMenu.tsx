
import { Button } from "@/components/ui/button";
import { User } from '@supabase/supabase-js';
import { HeaderMobileMenuHeader } from "./HeaderMobileMenuHeader";
import { HeaderMobileMenuItems } from "./HeaderMobileMenuItems";

interface HeaderMobileMenuProps {
  user: User | null;
  userRole: string | null;
  isAdmin: boolean;
  isMenuOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  onToggleMenu: () => void;
  onSignInClick: () => void;
  onChangeRole: () => void;
  onSignOut: () => void;
}

export const HeaderMobileMenu = ({
  user,
  userRole,
  isAdmin,
  isMenuOpen,
  isMobile,
  isTablet,
  onToggleMenu,
  onSignInClick,
  onChangeRole,
  onSignOut
}: HeaderMobileMenuProps) => {
  if (!isMenuOpen || (!isMobile && !isTablet)) {
    return null;
  }

  return (
    <div className="fixed inset-0 top-14 sm:top-16 md:top-18 z-[9999] md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onToggleMenu}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-80 sm:w-96 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <HeaderMobileMenuHeader
          user={user}
          userRole={userRole}
          onSignInClick={onSignInClick}
          onToggleMenu={onToggleMenu}
        />

        {/* Menu Items */}
        <HeaderMobileMenuItems
          user={user}
          userRole={userRole}
          isAdmin={isAdmin}
          onChangeRole={onChangeRole}
          onToggleMenu={onToggleMenu}
        />

        {/* Sign Out Button */}
        {user && (
          <div className="p-4 border-t bg-gray-50">
            <Button
              onClick={() => {
                onSignOut();
                onToggleMenu();
              }}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
