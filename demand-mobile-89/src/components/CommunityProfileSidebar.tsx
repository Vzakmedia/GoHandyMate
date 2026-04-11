import { useState, useEffect } from 'react';
import { Users, MapPin, Star, Calendar, MessageCircle, Home, Settings, Bell } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserReviews } from '@/hooks/useUserReviews';
import { ConnectionsWidget } from '@/components/community/ConnectionsWidget';
import { GroupsWidget } from '@/components/community/GroupsWidget';

interface CommunityGroup {
  id: string;
  name: string;
  memberCount: number;
  image: string;
  isJoined: boolean;
}

interface SuggestedConnection {
  id: string;
  name: string;
  avatar: string;
  mutualConnections: number;
  isVerified: boolean;
  category: string;
}

export const CommunityProfileSidebar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState({ posts: 0, connections: 0, rating: 0 });
  const { averageRating, totalReviews } = useUserReviews();

  // Fetch user community stats
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        // Get user's posts count
        const { count: postsCount } = await supabase
          .from('community_messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get connections count
        const { count: connectionsCount } = await supabase
          .from('user_connections')
          .select('*', { count: 'exact', head: true })
          .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)
          .eq('status', 'accepted');

        setUserStats({
          posts: postsCount || 0,
          connections: connectionsCount || 0,
          rating: averageRating || 0
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, [user, averageRating]);

  const communityGroups: CommunityGroup[] = [
    {
      id: '1',
      name: 'Downtown Homeowners',
      memberCount: 342,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200',
      isJoined: true
    },
    {
      id: '2', 
      name: 'DIY Home Projects',
      memberCount: 1284,
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=200',
      isJoined: false
    },
    {
      id: '3',
      name: 'Local Recommendations',
      memberCount: 856,
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
      isJoined: true
    }
  ];

  const suggestedConnections: SuggestedConnection[] = [
    {
      id: '1',
      name: 'Mike Peterson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      mutualConnections: 8,
      isVerified: true,
      category: 'Licensed Plumber'
    },
    {
      id: '2',
      name: 'Lisa Martinez', 
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b5ef5ec8?w=150',
      mutualConnections: 12,
      isVerified: true,
      category: 'Interior Designer'
    },
    {
      id: '3',
      name: 'Tom Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      mutualConnections: 5,
      isVerified: false,
      category: 'Neighbor'
    }
  ];

  if (!user) return null;

  return (
    <div className="w-80 space-y-4">
      
      {/* User Profile Card */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-green-100 text-green-700 text-lg">
                {(profile?.full_name || user?.email)?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0]}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{profile?.city || profile?.zip_code || 'Your Location'}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <Star className="w-3 h-3 fill-current" />
                <span>{profile?.user_role === 'customer' ? 'Community Member' : profile?.user_role?.charAt(0).toUpperCase() + profile?.user_role?.slice(1)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-gray-900">{userStats.posts}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{userStats.connections}</p>
              <p className="text-xs text-gray-500">Connections</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{userStats.rating}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-700"
            onClick={() => navigate('/?tab=search')}
          >
            <Home className="w-4 h-4 mr-3" />
            Find Services
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-700"
            onClick={() => navigate('/post-job')}
          >
            <MessageCircle className="w-4 h-4 mr-3" />
            Post Request
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-700"
            onClick={() => navigate('/?tab=jobs')}
          >
            <Calendar className="w-4 h-4 mr-3" />
            Schedule Service
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-700"
            onClick={() => navigate('/?tab=profile')}
          >
            <Bell className="w-4 h-4 mr-3" />
            Notifications
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:bg-green-50 hover:text-green-700"
            onClick={() => navigate('/?tab=profile')}
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
        </CardContent>
      </Card>

      {/* Community Groups */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-700">Your Groups</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {communityGroups.map((group) => (
            <div key={group.id} className="flex items-center space-x-3">
              <img 
                src={group.image} 
                alt={group.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{group.name}</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-gray-500">{group.memberCount} members</p>
                  {group.isJoined && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1">
                      Joined
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" className="w-full text-green-600 border-green-200 hover:bg-green-50">
            <Users className="w-4 h-4 mr-2" />
            Discover Groups
          </Button>
        </CardContent>
      </Card>

      {/* Connections Widget */}
      <ConnectionsWidget />

      {/* Groups Widget */}
      <GroupsWidget />

    </div>
  );
};