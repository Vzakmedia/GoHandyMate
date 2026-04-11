import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, UserPlus, MessageCircle, UserCheck, UserX } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionsViewProps {
  onBack: () => void;
}

interface Connection {
  id: string;
  user_id: string;
  connected_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  requested_by: string;
  created_at: string;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string;
    city: string;
    zip_code: string;
  };
}

interface SuggestedUser {
  id: string;
  full_name: string;
  avatar_url: string;
  city: string;
  zip_code: string;
  mutual_connections?: number;
}

export const ConnectionsView = ({ onBack }: ConnectionsViewProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'connections' | 'pending' | 'suggestions'>('connections');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchConnections();
      fetchPendingRequests();
      fetchSuggestions();
    }
  }, [user?.id]);

  // Set up real-time subscription for connections
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('connections_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_connections'
        },
        () => {
          fetchConnections();
          fetchPendingRequests();
          fetchSuggestions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchConnections = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const { data } = await supabase
      .from('user_connections')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });

    if (data) {
      // Fetch profiles separately
      const userIds = data.map(conn => conn.connected_user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city, zip_code')
        .in('id', userIds);

      const connectionsWithProfiles = data.map(conn => ({
        ...conn,
        profile: profiles?.find(p => p.id === conn.connected_user_id)
      }));

      setConnections(connectionsWithProfiles as Connection[]);
    }
    setLoading(false);
  };

  const fetchPendingRequests = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from('user_connections')
      .select('*')
      .eq('connected_user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (data) {
      // Fetch profiles separately
      const userIds = data.map(conn => conn.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city, zip_code')
        .in('id', userIds);

      const requestsWithProfiles = data.map(conn => ({
        ...conn,
        profile: profiles?.find(p => p.id === conn.user_id)
      }));

      setPendingRequests(requestsWithProfiles as Connection[]);
    }
  };

  const fetchSuggestions = async () => {
    if (!user?.id) return;

    // Get users who are not already connected
    const { data: existingConnections } = await supabase
      .from('user_connections')
      .select('connected_user_id, user_id')
      .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`);

    const connectedUserIds = new Set([
      ...(existingConnections?.map(c => c.connected_user_id) || []),
      ...(existingConnections?.map(c => c.user_id) || []),
      user.id // Exclude self
    ]);

    const { data: allUsers } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, city, zip_code')
      .not('id', 'in', `(${Array.from(connectedUserIds).join(',')})`)
      .limit(10);

    if (allUsers) {
      setSuggestions(allUsers);
    }
  };

  const sendConnectionRequest = async (targetUserId: string) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from('user_connections')
      .insert({
        user_id: user.id,
        connected_user_id: targetUserId,
        requested_by: user.id,
        status: 'pending'
      });

    if (!error) {
      // Remove from suggestions
      setSuggestions(prev => prev.filter(s => s.id !== targetUserId));
    }
  };

  const acceptRequest = async (connectionId: string) => {
    const { error } = await supabase
      .from('user_connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId);

    if (!error) {
      // Move from pending to connections
      const acceptedRequest = pendingRequests.find(req => req.id === connectionId);
      if (acceptedRequest) {
        setConnections(prev => [acceptedRequest, ...prev]);
        setPendingRequests(prev => prev.filter(req => req.id !== connectionId));
      }
    }
  };

  const rejectRequest = async (connectionId: string) => {
    const { error } = await supabase
      .from('user_connections')
      .update({ status: 'rejected' })
      .eq('id', connectionId);

    if (!error) {
      setPendingRequests(prev => prev.filter(req => req.id !== connectionId));
    }
  };

  const removeConnection = async (connectionId: string) => {
    const { error } = await supabase
      .from('user_connections')
      .delete()
      .eq('id', connectionId);

    if (!error) {
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    }
  };

  const getFilteredConnections = () => {
    return connections.filter(conn =>
      conn.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredPending = () => {
    return pendingRequests.filter(req =>
      req.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getFilteredSuggestions = () => {
    return suggestions.filter(user =>
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getCurrentList = () => {
    switch (activeTab) {
      case 'connections':
        return getFilteredConnections();
      case 'pending':
        return getFilteredPending();
      case 'suggestions':
        return getFilteredSuggestions();
      default:
        return [];
    }
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
            <h1 className="text-lg font-semibold text-foreground">Connections</h1>
            <p className="text-xs text-muted-foreground">
              Your network
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search connections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'connections'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            Connected ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'suggestions'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground'
            }`}
          >
            Suggested
          </button>
        </div>
      </div>

      <div className="pb-20">
        {/* Content */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : getCurrentList().length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {activeTab === 'connections' && 'No connections yet'}
                {activeTab === 'pending' && 'No pending requests'}
                {activeTab === 'suggestions' && 'No suggestions available'}
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === 'connections' && 'Start connecting with people in your community'}
                {activeTab === 'pending' && 'No one has sent you a connection request'}
                {activeTab === 'suggestions' && 'Check back later for new suggestions'}
              </p>
              {activeTab === 'connections' && (
                <Button onClick={() => setActiveTab('suggestions')}>
                  Find People
                </Button>
              )}
            </div>
          ) : (
            getCurrentList().map((item: any) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={item.profile?.avatar_url || item.avatar_url} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {(item.profile?.full_name || item.full_name)?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base">
                        {item.profile?.full_name || item.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.profile?.city || item.city || 'Location not set'}
                        {(item.profile?.zip_code || item.zip_code) && 
                          ` • ${item.profile?.zip_code || item.zip_code}`
                        }
                      </p>
                      {item.mutual_connections && (
                        <p className="text-xs text-muted-foreground">
                          {item.mutual_connections} mutual connections
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      {activeTab === 'connections' && (
                        <>
                          <Button variant="ghost" size="sm" className="p-2">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeConnection(item.id)}
                            className="p-2 text-destructive hover:text-destructive"
                          >
                            <UserX className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      
                      {activeTab === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => acceptRequest(item.id)}
                            className="px-4"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectRequest(item.id)}
                            className="px-4"
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      
                      {activeTab === 'suggestions' && (
                        <Button
                          size="sm"
                          onClick={() => sendConnectionRequest(item.id)}
                          className="px-4"
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      )}
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