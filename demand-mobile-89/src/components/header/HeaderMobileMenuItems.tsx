
import { Button } from "@/components/ui/button";
import { Megaphone, Shield, RotateCcw } from "lucide-react";
import { User } from '@supabase/supabase-js';
import { useNavigate } from "react-router-dom";

interface HeaderMobileMenuItemsProps {
  user: User | null;
  userRole: string | null;
  isAdmin: boolean;
  onChangeRole: () => void;
  onToggleMenu: () => void;
}

export const HeaderMobileMenuItems = ({
  user,
  userRole,
  isAdmin,
  onChangeRole,
  onToggleMenu
}: HeaderMobileMenuItemsProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-1 flex-1 overflow-y-auto">
      {/* Advertising Button - for handyman and contractor */}
      {user && (userRole === 'handyman' || userRole === 'contractor') && (
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-left"
          onClick={() => {
            navigate('/business-advertising');
            onToggleMenu();
          }}
        >
          <Megaphone className="w-4 h-4 mr-3" />
          <span>Advertise Your Business</span>
        </Button>
      )}

      {/* Admin Backend Button */}
      {isAdmin && (
        <Button
          variant="ghost"
          className="w-full justify-start h-10 text-left"
          onClick={() => {
            navigate('/admin/backend');
            onToggleMenu();
          }}
        >
          <Shield className="w-4 h-4 mr-3" />
          <span>Admin Backend</span>
        </Button>
      )}

      {/* Change Role Button */}
      <Button
        variant="ghost"
        className="w-full justify-start h-10 text-left"
        onClick={() => {
          onChangeRole();
          onToggleMenu();
        }}
      >
        <RotateCcw className="w-4 h-4 mr-3" />
        <span>Change Role</span>
      </Button>
    </div>
  );
};
