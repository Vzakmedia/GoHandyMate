import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

export interface CommunityGroup {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_by: string;
  location?: string;
  is_public: boolean;
  member_count: number;
  created_at: string;
  updated_at: string;
  creator_profile?: {
    full_name?: string;
    avatar_url?: string;
  };
  is_member?: boolean;
  user_role?: 'admin' | 'moderator' | 'member';
}

export const useCommunityGroups = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [userGroups, setUserGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      
      // Fetch all public groups
      const { data: groupsData, error: groupsError } = await supabase
        .from('community_groups')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (groupsError) throw groupsError;

      // Get creator profiles
      const creatorIds = [...new Set(groupsData?.map(g => g.created_by) || [])];
      const { data: creatorsData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', creatorIds);

      const creatorsMap = new Map(creatorsData?.map(c => [c.id, c]) || []);

      // Check which groups the user is a member of
      let memberGroups: Array<{group_id: string; role: string}> = [];
      if (user) {
        const { data: memberData } = await supabase
          .from('group_members')
          .select('group_id, role')
          .eq('user_id', user.id);

        memberGroups = memberData || [];
      }

      const memberGroupsMap = new Map(memberGroups.map(m => [m.group_id, m.role]));

      const formattedGroups = groupsData?.map(group => ({
        ...group,
        is_public: group.is_public ?? true,
        member_count: group.member_count ?? 0,
        creator_profile: creatorsMap.get(group.created_by),
        is_member: memberGroupsMap.has(group.id),
        user_role: memberGroupsMap.get(group.id) as 'admin' | 'moderator' | 'member' | undefined
      })) || [];

      setGroups(formattedGroups);

      // Fetch user's groups separately
      if (user) {
        const userGroupsFiltered = formattedGroups.filter(g => g.is_member);
        setUserGroups(userGroupsFiltered);
      }

    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: "Error",
        description: "Failed to load community groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupData: {
    name: string;
    description?: string;
    image_url?: string;
    location?: string;
    is_public?: boolean;
  }) => {
    if (!user) return false;

    try {
      const { data: newGroup, error: createError } = await supabase
        .from('community_groups')
        .insert({
          ...groupData,
          created_by: user.id,
          is_public: groupData.is_public ?? true
        })
        .select()
        .single();

      if (createError) throw createError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert({
          group_id: newGroup.id,
          user_id: user.id,
          role: 'admin'
        });

      if (memberError) throw memberError;

      toast({
        title: "Group Created",
        description: `${groupData.name} has been created successfully!`,
      });

      await fetchGroups();
      return true;
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group",
        variant: "destructive",
      });
      return false;
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        });

      if (error) throw error;

      toast({
        title: "Joined Group",
        description: "You have successfully joined the group!",
      });

      await fetchGroups();
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: "Error",
        description: "Failed to join group",
        variant: "destructive",
      });
      return false;
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Left Group",
        description: "You have left the group",
      });

      await fetchGroups();
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: "Error",
        description: "Failed to leave group",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  // Set up real-time subscription for groups
  useEffect(() => {
    const channel = supabase
      .channel('community_groups_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_groups'
        },
        () => {
          fetchGroups();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members'
        },
        () => {
          fetchGroups();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    groups,
    userGroups,
    loading,
    createGroup,
    joinGroup,
    leaveGroup,
    refetch: fetchGroups
  };
};