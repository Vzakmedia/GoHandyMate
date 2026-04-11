
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Building } from 'lucide-react';

interface ProfileHeaderProps {
  profile: any;
  profileStats: {
    totalUnits: number;
    joinedDate: string;
  };
  onEditProfile: () => void;
}

export const ProfileHeader = ({ profile, profileStats, onEditProfile }: ProfileHeaderProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar - centered on mobile */}
          <div className="flex-shrink-0">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
              <AvatarImage src="" alt={profile?.full_name || ''} />
              <AvatarFallback className="text-lg sm:text-xl font-semibold bg-green-600 text-white">
                {profile?.full_name ? getInitials(profile.full_name) : 'PM'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Main content - centered on mobile */}
          <div className="flex-1 space-y-4 text-center sm:text-left min-w-0 w-full">
            {/* Name and badge */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 break-words leading-tight">
                  {profile?.user_role === 'contractor' 
                    ? (profile?.business_name || profile?.full_name || 'Contractor')
                    : (profile?.full_name || 'Property Manager')
                  }
                </h1>
                <Badge className="bg-green-600 text-white w-fit mx-auto sm:mx-0">
                  {profile?.user_role === 'contractor' ? 'Contractor' : 'Property Manager'}
                </Badge>
                {profile?.user_role === 'contractor' && profile?.business_name && profile?.full_name && (
                  <p className="text-sm text-gray-600 w-full sm:w-auto">
                    Owner: {profile.full_name}
                  </p>
                )}
              </div>
            </div>
            
            {/* Stats grid - responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">{profile?.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Joined {formatDate(profileStats.joinedDate)}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 min-w-0">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{profileStats.totalUnits} Units Managed</span>
              </div>
            </div>
          </div>
          
          {/* Edit button - full width on mobile */}
          <div className="w-full sm:w-auto flex-shrink-0">
            <Button onClick={onEditProfile} variant="outline" className="w-full sm:w-auto">
              <User className="w-4 h-4 mr-2 flex-shrink-0" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
