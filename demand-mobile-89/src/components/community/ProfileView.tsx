import { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Users, MessageCircle, UserPlus, Camera, Edit } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { EditProfileModal } from './EditProfileModal';

interface ProfileViewProps {
  userId?: string;
  onBack: () => void;
  onNavigateToConnections: () => void;
  onNavigateToGroups: () => void;
}

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  city: string;
  zip_code: string;
  created_at: string;
}

interface UserStats {
  connectionsCount: number;
  groupsCount: number;
  postsCount: number;
}

export const ProfileView = ({ userId, onBack, onNavigateToConnections, onNavigateToGroups }: ProfileViewProps) => {
  const { user, profile } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({ connectionsCount: 0, groupsCount: 0, postsCount: 0 });
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const [showEditModal, setShowEditModal] = useState(false);

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      setIsOwnProfile(targetUserId === user?.id);
      fetchUserProfile();
      fetchUserStats();
      if (targetUserId !== user?.id) {
        checkConnectionStatus();
      }
    }
  }, [targetUserId, user?.id]);

  const fetchUserProfile = async () => {
    if (!targetUserId) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', targetUserId)
      .single();

    if (data) {
      setUserProfile(data);
    }
  };

  const fetchUserStats = async () => {
    if (!targetUserId) return;

    const [connectionsResult, groupsResult, postsResult] = await Promise.all([
      supabase
        .from('user_connections')
        .select('id', { count: 'exact' })
        .eq('user_id', targetUserId)
        .eq('status', 'accepted'),
      supabase
        .from('group_members')
        .select('id', { count: 'exact' })
        .eq('user_id', targetUserId),
      supabase
        .from('community_messages')
        .select('id', { count: 'exact' })
        .eq('user_id', targetUserId)
        .is('reply_to_id', null)
    ]);

    setUserStats({
      connectionsCount: connectionsResult.count || 0,
      groupsCount: groupsResult.count || 0,
      postsCount: postsResult.count || 0
    });
  };

  const checkConnectionStatus = async () => {
    if (!user?.id || !targetUserId) return;

    const { data } = await supabase
      .from('user_connections')
      .select('status')
      .or(`and(user_id.eq.${user.id},connected_user_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},connected_user_id.eq.${user.id})`)
      .single();

    if (data && (data.status === 'pending' || data.status === 'accepted')) {
      setConnectionStatus(data.status === 'accepted' ? 'connected' : 'pending');
    }
  };

  const handleConnect = async () => {
    if (!user?.id || !targetUserId) return;

    const { error } = await supabase
      .from('user_connections')
      .insert({
        user_id: user.id,
        connected_user_id: targetUserId,
        requested_by: user.id,
        status: 'pending'
      });

    if (!error) {
      setConnectionStatus('pending');
    }
  };

  const displayProfile = userProfile || profile;
  const joinDate = displayProfile?.created_at 
    ? new Date(displayProfile.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    : '';

  return (
    <div className="w-full bg-background rounded-b-[2rem] sm:rounded-b-[3rem]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                {displayProfile?.full_name || 'Profile'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {userStats.postsCount} posts
              </p>
            </div>
          </div>
          {isOwnProfile && (
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <div className="pb-20">
        {/* Cover Photo Area */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
          {isOwnProfile && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-black/20 text-white hover:bg-black/30"
            >
              <Camera className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-4 -mt-16">
          <div className="flex items-end justify-between">
            <div className="relative">
              <Avatar className="w-32 h-32 border-4 border-background">
                <AvatarImage src={displayProfile?.avatar_url} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {displayProfile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute bottom-0 right-0 bg-card border rounded-full p-2 shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="mb-4">
              {isOwnProfile ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="px-6"
                  onClick={() => setShowEditModal(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant={connectionStatus === 'connected' ? 'outline' : 'default'}
                    size="sm"
                    onClick={handleConnect}
                    disabled={connectionStatus === 'pending'}
                    className="px-6"
                  >
                    {connectionStatus === 'connected' ? (
                      'Connected'
                    ) : connectionStatus === 'pending' ? (
                      'Pending'
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              {displayProfile?.full_name}
            </h2>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <span className="text-sm">
                {displayProfile?.city || displayProfile?.zip_code || 'Location not set'}
              </span>
              {displayProfile?.city && displayProfile?.zip_code && (
                <>
                  <span>•</span>
                  <span className="text-sm">{displayProfile.zip_code}</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Joined {joinDate}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mt-6 py-4 border-t border-b">
            <button 
              onClick={onNavigateToConnections}
              className="text-center hover:bg-muted/50 rounded p-2 transition-colors"
            >
              <div className="text-lg font-bold text-foreground">{userStats.connectionsCount}</div>
              <div className="text-xs text-muted-foreground">Connections</div>
            </button>
            <button 
              onClick={onNavigateToGroups}
              className="text-center hover:bg-muted/50 rounded p-2 transition-colors"
            >
              <div className="text-lg font-bold text-foreground">{userStats.groupsCount}</div>
              <div className="text-xs text-muted-foreground">Groups</div>
            </button>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">{userStats.postsCount}</div>
              <div className="text-xs text-muted-foreground">Posts</div>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={onNavigateToConnections}>
                  <Users className="w-4 h-4 mr-2" />
                  Connections
                </Button>
                <Button variant="outline" size="sm" onClick={onNavigateToGroups}>
                  <Users className="w-4 h-4 mr-2" />
                  Groups
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Verification Status */}
          {displayProfile && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">Verification</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    ✓ Verified Member
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onProfileUpdated={() => {
          fetchUserProfile();
          fetchUserStats();
        }}
      />
    </div>
  );
};