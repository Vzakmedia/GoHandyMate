import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Plus, Search, MapPin, Lock, Globe } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';

interface GroupsViewProps {
  onBack: () => void;
}

interface Group {
  id: string;
  name: string;
  description: string;
  image_url: string;
  location: string;
  member_count: number;
  is_public: boolean;
  created_by: string;
  created_at: string;
  is_member?: boolean;
}

export const GroupsView = ({ onBack }: GroupsViewProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover'>('my-groups');
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [discoverGroups, setDiscoverGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'my-groups') {
      fetchMyGroups();
    } else {
      fetchDiscoverGroups();
    }
  }, [activeTab, user?.id]);

  const fetchMyGroups = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const { data } = await supabase
      .from('group_members')
      .select(`
        group_id,
        community_groups (
          id,
          name,
          description,
          image_url,
          location,
          member_count,
          is_public,
          created_by,
          created_at
        )
      `)
      .eq('user_id', user.id);

    if (data) {
      const groups = data
        .filter(item => item.community_groups)
        .map(item => ({
          ...item.community_groups,
          is_member: true
        })) as Group[];
      setMyGroups(groups);
    }
    setLoading(false);
  };

  const fetchDiscoverGroups = async () => {
    setLoading(true);
    
    // Get all public groups
    const { data: allGroups } = await supabase
      .from('community_groups')
      .select('*')
      .eq('is_public', true)
      .order('member_count', { ascending: false })
      .limit(20);

    if (allGroups && user?.id) {
      // Check which groups the user is already a member of
      const { data: userGroups } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('user_id', user.id);

      const userGroupIds = new Set(userGroups?.map(g => g.group_id) || []);
      
      const groupsWithMembership = allGroups.map(group => ({
        ...group,
        is_member: userGroupIds.has(group.id)
      }));

      setDiscoverGroups(groupsWithMembership);
    }
    setLoading(false);
  };

  const joinGroup = async (groupId: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: user.id,
        role: 'member'
      });

    if (!error) {
      // Update the local state
      if (activeTab === 'discover') {
        setDiscoverGroups(prev => 
          prev.map(group => 
            group.id === groupId 
              ? { ...group, is_member: true, member_count: group.member_count + 1 }
              : group
          )
        );
      }
      
      // Update member count in the database - get current count first
      const currentGroup = discoverGroups.find(g => g.id === groupId);
      if (currentGroup) {
        await supabase
          .from('community_groups')
          .update({ member_count: currentGroup.member_count + 1 })
          .eq('id', groupId);
      }
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', user.id);

    if (!error) {
      // Update local state
      if (activeTab === 'my-groups') {
        setMyGroups(prev => prev.filter(group => group.id !== groupId));
      } else {
        setDiscoverGroups(prev => 
          prev.map(group => 
            group.id === groupId 
              ? { ...group, is_member: false, member_count: Math.max(0, group.member_count - 1) }
              : group
          )
        );
      }
    }
  };

  const filteredGroups = (activeTab === 'my-groups' ? myGroups : discoverGroups)
    .filter(group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatMemberCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="w-full bg-background rounded-b-[2rem] sm:rounded-b-[3rem]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center space-x-3 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Groups</h1>
            <p className="text-xs text-muted-foreground">
              Connect with communities
            </p>
          </div>
          <Button variant="ghost" size="sm" className="p-2">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab('my-groups')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'my-groups'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            My Groups
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'discover'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            Discover
          </button>
        </div>
      </div>

      <div className="pb-20">
        {/* Content */}
        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {activeTab === 'my-groups' ? 'No groups yet' : 'No groups found'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === 'my-groups' 
                  ? 'Join your first group to connect with others'
                  : 'Try searching for different keywords'
                }
              </p>
              {activeTab === 'my-groups' && (
                <Button onClick={() => setActiveTab('discover')}>
                  Discover Groups
                </Button>
              )}
            </div>
          ) : (
            filteredGroups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Group Header */}
                  <div className="relative h-24 bg-gradient-to-r from-primary/20 to-primary/5">
                    {group.image_url && (
                      <img
                        src={group.image_url}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-2 left-2">
                      {group.is_public ? (
                        <Badge variant="secondary" className="bg-background/80">
                          <Globe className="w-3 h-3 mr-1" />
                          Public
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-background/80">
                          <Lock className="w-3 h-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Group Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-base mb-1">
                          {group.name}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                          <Users className="w-3 h-3" />
                          <span>{formatMemberCount(group.member_count)} members</span>
                          {group.location && (
                            <>
                              <span>•</span>
                              <MapPin className="w-3 h-3" />
                              <span>{group.location}</span>
                            </>
                          )}
                        </div>
                        {group.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {group.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        {group.is_member ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => leaveGroup(group.id)}
                            className="px-4"
                          >
                            Joined
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => joinGroup(group.id)}
                            className="px-4"
                          >
                            Join
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};