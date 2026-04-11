
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, User as UserIcon } from "lucide-react";
import { User } from '@supabase/supabase-js';
import { useAuth } from '@/features/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderMobileMenuHeaderProps {
  user: User | null;
  userRole: string | null;
  onSignInClick: () => void;
  onToggleMenu: () => void;
}

export const HeaderMobileMenuHeader = ({ 
  user, 
  userRole, 
  onSignInClick, 
  onToggleMenu 
}: HeaderMobileMenuHeaderProps) => {
  const { profile } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    
    // For contractors, prioritize business name over personal name
    if (profile?.user_role === 'contractor') {
      const businessName = profile?.business_name || profile?.company_name;
      if (businessName && businessName.trim()) {
        return businessName.trim();
      }
    }
    
    // Use profile full_name first, then user metadata, then email
    const profileName = profile?.full_name;
    const metadataName = user.user_metadata?.full_name;
    const email = user.email?.split('@')[0];
    
    if (profileName && profileName.trim()) {
      const nameParts = profileName.trim().split(' ');
      if (nameParts.length >= 2) {
        const firstName = nameParts[0];
        const lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
        return `${firstName} ${lastNameInitial}.`;
      }
      return nameParts[0];
    }
    
    if (metadataName && metadataName.trim()) {
      const nameParts = metadataName.trim().split(' ');
      if (nameParts.length >= 2) {
        const firstName = nameParts[0];
        const lastNameInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
        return `${firstName} ${lastNameInitial}.`;
      }
      return nameParts[0];
    }
    
    return email || 'User';
  };

  const getUserInitials = () => {
    if (!user) return 'G';
    
    // For contractors, use business name initials if available
    if (profile?.user_role === 'contractor') {
      const businessName = profile?.business_name || profile?.company_name;
      if (businessName && businessName.trim()) {
        const words = businessName.trim().split(' ');
        if (words.length >= 2) {
          return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
        }
        return businessName.charAt(0).toUpperCase();
      }
    }
    
    const profileName = profile?.full_name;
    const metadataName = user.user_metadata?.full_name;
    const email = user.email?.split('@')[0];
    
    const name = profileName || metadataName || email || 'User';
    
    if (name.includes(' ')) {
      const parts = name.split(' ');
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    
    return name.charAt(0).toUpperCase();
  };

  const getUserAvatarUrl = () => {
    return profile?.avatar_url || user?.user_metadata?.avatar_url;
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      customer: 'Customer',
      handyman: 'Handyman',
      contractor: 'Contractor',
      property_manager: 'Property Manager'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getUserEmail = () => {
    return user?.email || '';
  };

  return (
    <div className="p-4 border-b bg-white">
      {user ? (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={getUserAvatarUrl()} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{getUserDisplayName()}</p>
              <p className="text-sm text-gray-500">{getUserEmail()}</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {getRoleDisplayName(userRole || profile?.user_role || 'customer')}
          </Badge>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Welcome</h3>
          <Button
            onClick={() => {
              onSignInClick();
              onToggleMenu();
            }}
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
        </div>
      )}
    </div>
  );
};
