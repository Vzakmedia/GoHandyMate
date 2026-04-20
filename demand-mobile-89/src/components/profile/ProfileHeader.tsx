
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Phone, MessageCircle, CheckCircle2, Crown, Calendar } from 'lucide-react';

interface Professional {
  id: string;
  full_name: string;
  user_role: 'handyman';
  avatar_url?: string;
  subscription_plan?: string;
  account_status: string;
  created_at: string;
  average_rating?: number;
  total_ratings?: number;
  business_name?: string;
  company_name?: string;
}

interface ProfileHeaderProps {
  professional: Professional;
  completedJobs?: number;
  isOnline?: boolean;
  onBook: () => void;
  onContact: () => void;
}

export const ProfileHeader = ({ 
  professional, 
  completedJobs = 0,
  isOnline = false,
  onBook, 
  onContact 
}: ProfileHeaderProps) => {
  const isPremium = professional.subscription_plan && 
    professional.subscription_plan !== 'free' && 
    professional.subscription_plan !== 'basic';

  const memberSince = new Date(professional.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const getDisplayName = () => {
    return professional.full_name;
  };

  // Get initials based on display name
  const getInitials = () => {
    const displayName = getDisplayName();
    return displayName.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
        {/* Avatar with online indicator - centered on mobile */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-lg">
            <AvatarImage 
              src={professional.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${professional.id}`}
              alt={getDisplayName()}
            />
            <AvatarFallback className="text-lg sm:text-xl font-bold bg-blue-500 text-white">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 sm:border-4 border-white"></div>
          )}
        </div>

        {/* Professional Info - centered on mobile, left-aligned on desktop */}
        <div className="flex-1 min-w-0 w-full text-center sm:text-left space-y-4">
          {/* Name and premium badge */}
          <div className="space-y-2">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words leading-tight">
                {getDisplayName()}
              </h1>
              {isPremium && (
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
              )}
            </div>
            
            
            {/* Professional Type and Status - responsive badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="outline" className="capitalize text-xs sm:text-sm">
                {professional.user_role}
              </Badge>
              <Badge 
                className={`text-xs sm:text-sm ${
                  professional.account_status === 'active' 
                    ? 'bg-green-100 text-green-700 border-green-300' 
                    : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                }`}
              >
                {professional.account_status}
              </Badge>
              {isOnline && (
                <Badge className="bg-green-100 text-green-700 border-green-300 text-xs sm:text-sm">
                  Online now
                </Badge>
              )}
            </div>
          </div>

          {/* Rating and Stats - responsive layout with proper spacing */}
          <div className="space-y-3 sm:space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm">
              <div className="flex items-center justify-center sm:justify-start space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
                <span className="font-semibold">
                  {professional.average_rating ? professional.average_rating.toFixed(1) : 'No rating yet'}
                </span>
                <span className="text-gray-500">
                  ({professional.total_ratings || 0} {professional.total_ratings === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-start space-x-1">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="font-semibold">{completedJobs}</span>
                <span className="text-gray-500">jobs completed</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start space-x-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>Member since {memberSince}</span>
            </div>
          </div>

          {/* Action Buttons - responsive layout */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
            <Button 
              onClick={onContact} 
              variant="outline" 
              className="w-full sm:w-auto flex items-center justify-center space-x-2 h-10"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              <span>Contact</span>
            </Button>
            <Button 
              onClick={onBook} 
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 h-10"
            >
              <MessageCircle className="w-4 h-4 flex-shrink-0" />
              <span>Book Now</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
