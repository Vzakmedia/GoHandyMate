
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/features/auth';

interface HeaderUserInfoProps {
  user: User | null;
  userRole: string | null;
  showBadge?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const HeaderUserInfo = ({ user, userRole, showBadge = true, size = 'md' }: HeaderUserInfoProps) => {
  const { profile } = useAuth();

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    
    // For providers, prioritize business name over personal name
    if (profile?.user_role === 'provider') {
      const businessName = profile?.business_name || profile?.company_name;
      if (businessName && businessName.trim()) {
        return businessName.trim();
      }
      const ownerName = profile?.full_name || user.user_metadata?.full_name;
      return ownerName || 'Provider';
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
      return nameParts[0]; // Just first name if no last name
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
    
    // For providers, use business name initials if available
    if (profile?.user_role === 'provider') {
      const businessName = profile?.business_name || profile?.company_name;
      if (businessName && businessName.trim()) {
        const words = businessName.trim().split(' ');
        if (words.length >= 2) {
          return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
        }
        return businessName.charAt(0).toUpperCase();
      }
      // Fallback to personal name initials
      const ownerName = profile?.full_name || user.user_metadata?.full_name;
      if (ownerName) {
        const words = ownerName.trim().split(' ');
        if (words.length >= 2) {
          return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
        }
        return ownerName.charAt(0).toUpperCase();
      }
    }
    
    // Use profile full_name first, then user metadata, then email
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
    // Use profile avatar_url first (this will include contractor profile pictures), then user metadata avatar_url
    return profile?.avatar_url || user?.user_metadata?.avatar_url;
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      customer: 'Customer',
      provider: 'Provider',
      admin: 'Admin'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          avatar: 'w-6 h-6',
          text: 'text-xs'
        };
      case 'lg':
        return {
          avatar: 'w-10 h-10',
          text: 'text-base'
        };
      default: // 'md'
        return {
          avatar: 'w-8 h-8',
          text: 'text-sm'
        };
    }
  };

  const { avatar: avatarSize, text: textSize } = getSizeClasses();

  return (
    <div className="flex items-center space-x-2">
      {showBadge && (
        <Badge variant="outline" className="capitalize">
          {getRoleDisplayName(userRole || profile?.user_role || 'customer')}
        </Badge>
      )}
      <div className="flex items-center space-x-2">
        <Avatar className={avatarSize}>
          <AvatarImage src={getUserAvatarUrl()} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <span className={`${textSize} font-medium text-gray-700`}>
          {getUserDisplayName()}
        </span>
      </div>
    </div>
  );
};
