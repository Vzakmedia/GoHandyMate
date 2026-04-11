
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { User } from '@supabase/supabase-js';
import { HeaderUserInfo } from "./HeaderUserInfo";
import { NotificationButton } from "./NotificationButton";

interface HeaderMobileActionsProps {
  user: User | null;
  userRole: string | null;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onSignInClick: () => void;
}

export const HeaderMobileActions = ({
  user,
  userRole,
  isMenuOpen,
  onToggleMenu,
  onSignInClick
}: HeaderMobileActionsProps) => {
  return (
    <div className="flex items-center space-x-2 flex-shrink-0">
      {user && (
        <>
          <HeaderUserInfo user={user} userRole={userRole} showBadge={false} size="sm" />
          <NotificationButton />
        </>
      )}
      {!user && (
        <Button onClick={onSignInClick} variant="ghost" size="sm" className="p-2 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200">
          <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleMenu}
        className="p-2 hover:bg-gray-100 transition-colors duration-200"
      >
        {isMenuOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        ) : (
          <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        )}
      </Button>
    </div>
  );
};
