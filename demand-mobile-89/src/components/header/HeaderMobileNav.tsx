
import { User } from '@supabase/supabase-js';
import { HeaderMobileActions } from "./HeaderMobileActions";
import { HeaderMobileMenu } from "./HeaderMobileMenu";

interface HeaderMobileNavProps {
  user: User | null;
  userRole: string | null;
  isAdmin: boolean;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onSignInClick: () => void;
  onChangeRole: () => void;
  onSignOut: () => void;
  isMobile: boolean;
  isTablet: boolean;
}

export const HeaderMobileNav = ({ 
  user, 
  userRole, 
  isAdmin, 
  isMenuOpen, 
  onToggleMenu, 
  onSignInClick, 
  onChangeRole, 
  onSignOut,
  isMobile,
  isTablet 
}: HeaderMobileNavProps) => {
  return (
    <>
      <HeaderMobileActions
        user={user}
        userRole={userRole}
        isMenuOpen={isMenuOpen}
        onToggleMenu={onToggleMenu}
        onSignInClick={onSignInClick}
      />

      <HeaderMobileMenu
        user={user}
        userRole={userRole}
        isAdmin={isAdmin}
        isMenuOpen={isMenuOpen}
        isMobile={isMobile}
        isTablet={isTablet}
        onToggleMenu={onToggleMenu}
        onSignInClick={onSignInClick}
        onChangeRole={onChangeRole}
        onSignOut={onSignOut}
      />
    </>
  );
};
