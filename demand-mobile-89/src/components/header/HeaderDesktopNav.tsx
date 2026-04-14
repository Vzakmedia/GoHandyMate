
import { Button } from "@/components/ui/button";
import { Megaphone, LogIn, RotateCcw, Shield } from "lucide-react";
import { User } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";
import { HeaderUserInfo } from "./HeaderUserInfo";
import { NotificationButton } from "./NotificationButton";

interface HeaderDesktopNavProps {
  user: User | null;
  userRole: string | null;
  isAdmin: boolean;
  onSignInClick: () => void;
  onChangeRole: () => void;
  onSignOut: () => void;
}

export const HeaderDesktopNav = ({ 
  user, 
  userRole, 
  isAdmin, 
  onSignInClick, 
  onChangeRole, 
  onSignOut 
}: HeaderDesktopNavProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {user && userRole === 'provider' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/business-advertising')}
          className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <Megaphone className="w-4 h-4" />
          <span>Advertise</span>
        </Button>
      )}

      {isAdmin && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admin/backend')}
          className="flex items-center space-x-2 text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <Shield className="w-4 h-4" />
          <span>Admin Backend</span>
        </Button>
      )}

      {/* Notification Button - Show for all authenticated users */}
      {user && <NotificationButton />}
      
      {user ? (
        <HeaderUserInfo user={user} userRole={userRole} />
      ) : (
        <Button onClick={onSignInClick} variant="outline" size="sm">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      )}
      
      <Button onClick={onChangeRole} variant="outline" size="sm">
        <RotateCcw className="w-4 h-4 mr-2" />
        Change Role
      </Button>

      {user && (
        <Button onClick={onSignOut} variant="outline" size="sm">
          Sign Out
        </Button>
      )}
    </div>
  );
};
