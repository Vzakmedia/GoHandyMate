import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

export interface UserConnection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  requested_by: string;
  created_at: string;
  updated_at: string;
  profile?: {
    full_name?: string;
    avatar_url?: string;
    user_role?: string;
  };
}

export const useCommunityConnections = () => {
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<UserConnection[]>([]);
  const [suggestedConnections, setSuggestedConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchConnections = async () => {
    if (!user) return;

    try {
      // Fetch accepted connections
      const { data: connectionsData, error: connectionsError } = await supabase
        .from('user_connections')
        .select('*')
        .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (connectionsError) throw connectionsError;

      // Get unique user IDs to fetch profiles
      const userIds = [...new Set(connectionsData?.flatMap(conn => [conn.user_id, conn.connected_user_id]) || [])];
      
      // Fetch profiles separately
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, user_role')
        .in('id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

      // Format connections to always show the other user's profile
      const formattedConnections = connectionsData?.map(conn => ({
        ...conn,
        status: conn.status as 'pending' | 'accepted' | 'blocked',
        profile: profilesMap.get(conn.user_id === user.id ? conn.connected_user_id : conn.user_id)
      })) || [];

      setConnections(formattedConnections);

      // Fetch pending requests (where user is the recipient)
      const { data: pendingData, error: pendingError } = await supabase
        .from('user_connections')
        .select('*')
        .eq('connected_user_id', user.id)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      const formattedPending = pendingData?.map(req => ({
        ...req,
        status: req.status as 'pending' | 'accepted' | 'blocked',
        profile: profilesMap.get(req.requested_by)
      })) || [];

      setPendingRequests(formattedPending);

    } catch (error) {
      console.error('Error fetching connections:', error);
      toast({
        title: "Error",
        description: "Failed to load connections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedConnections = async () => {
    if (!user) return;

    try {
      // Get users who are not connected and not blocked
      const { data: suggestions, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, user_role, city')
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;

      // Filter out existing connections
      const existingConnectionIds = new Set([
        ...connections.map(c => c.user_id === user.id ? c.connected_user_id : c.user_id),
        ...pendingRequests.map(r => r.user_id)
      ]);

      const filtered = suggestions?.filter(s => !existingConnectionIds.has(s.id)) || [];
      setSuggestedConnections(filtered);

    } catch (error) {
      console.error('Error fetching suggested connections:', error);
    }
  };

  const sendConnectionRequest = async (targetUserId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_connections')
        .insert({
          user_id: user.id,
          connected_user_id: targetUserId,
          requested_by: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Connection Request Sent",
        description: "Your connection request has been sent successfully",
      });

      await fetchSuggestedConnections();
      return true;
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error",
        description: "Failed to send connection request",
        variant: "destructive",
      });
      return false;
    }
  };

  const acceptConnectionRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Connection Accepted",
        description: "You are now connected!",
      });

      await fetchConnections();
    } catch (error) {
      console.error('Error accepting connection:', error);
      toast({
        title: "Error",
        description: "Failed to accept connection",
        variant: "destructive",
      });
    }
  };

  const rejectConnectionRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Connection Request Declined",
        description: "The connection request has been declined",
      });

      await fetchConnections();
    } catch (error) {
      console.error('Error rejecting connection:', error);
      toast({
        title: "Error",
        description: "Failed to reject connection",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  useEffect(() => {
    if (connections.length > 0 || pendingRequests.length > 0) {
      fetchSuggestedConnections();
    }
  }, [connections, pendingRequests]);

  // Set up real-time subscription for connections
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('user_connections_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_connections',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchConnections();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_connections',
          filter: `connected_user_id=eq.${user.id}`
        },
        () => {
          fetchConnections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    connections,
    pendingRequests,
    suggestedConnections,
    loading,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    refetch: fetchConnections
  };
};