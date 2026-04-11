import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, Clock, CheckCircle2, User, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { AgentChatInterface } from './AgentChatInterface';

interface ChatSession {
  id: string;
  customer_id: string;
  agent_id?: string | null;
  status: 'waiting' | 'active' | 'closed' | 'transferred';
  subject?: string | null;
  created_at: string;
  updated_at: string;
  customer_profile?: {
    full_name: string;
    email: string;
  };
  unread_count?: number;
}

export const ChatManagement = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedSessionData, setSelectedSessionData] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);
  const { toast } = useToast();

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select(`
          *,
          profiles!customer_id(full_name, email)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get unread message counts for each session
      const sessionsWithCounts = await Promise.all(
        (data || []).map(async (session) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id)
            .eq('is_read', false)
            .neq('sender_id', (await supabase.auth.getUser()).data.user?.id);

          return {
            ...session,
            customer_profile: session.profiles || undefined,
            unread_count: count || 0
          };
        })
      );

      setSessions(sessionsWithCounts as ChatSession[]);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load chat sessions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const assignToSelf = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ 
          agent_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'active'
        })
        .eq('id', sessionId);

      if (error) throw error;

      await loadSessions();
      toast({
        title: "Success",
        description: "Chat session assigned to you",
      });
    } catch (error) {
      console.error('Error assigning chat:', error);
      toast({
        title: "Error",
        description: "Failed to assign chat session",
        variant: "destructive"
      });
    }
  };

  const closeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ status: 'closed' })
        .eq('id', sessionId);

      if (error) throw error;

      await loadSessions();
      if (selectedSession === sessionId) {
        setSelectedSession(null);
      }
      toast({
        title: "Success",
        description: "Chat session closed",
      });
    } catch (error) {
      console.error('Error closing chat:', error);
      toast({
        title: "Error",
        description: "Failed to close chat session",
        variant: "destructive"
      });
    }
  };

  // Auto-assign waiting sessions to available agents
  const autoAssignSessions = async () => {
    if (!autoAssignEnabled) return;

    try {
      const waitingSessions = sessions.filter(s => s.status === 'waiting');
      const currentUser = await supabase.auth.getUser();
      
      if (waitingSessions.length > 0 && currentUser.data.user) {
        // Check if current user is an available agent
        const { data: agentData } = await supabase
          .from('chat_agents')
          .select('*')
          .eq('user_id', currentUser.data.user.id)
          .eq('is_active', true)
          .eq('is_online', true)
          .single();

        if (agentData && agentData.current_chat_count < agentData.max_concurrent_chats) {
          // Auto-assign the oldest waiting session
          const oldestSession = waitingSessions[0];
          await assignToSelf(oldestSession.id);
        }
      }
    } catch (error) {
      console.error('Error in auto-assignment:', error);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
    const sessionData = sessions.find(s => s.id === sessionId);
    setSelectedSessionData(sessionData || null);
  };

  useEffect(() => {
    loadSessions();

    // Set up real-time subscription for new sessions
    const channel = supabase
      .channel('chat_management')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions'
        },
        () => {
          loadSessions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto-assign effect
  useEffect(() => {
    if (autoAssignEnabled && sessions.length > 0) {
      autoAssignSessions();
    }
  }, [sessions, autoAssignEnabled]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'active':
        return <MessageCircle className="w-4 h-4 text-green-500" />;
      case 'closed':
        return <CheckCircle2 className="w-4 h-4 text-gray-500" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700';
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chat Management</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant={autoAssignEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoAssignEnabled(!autoAssignEnabled)}
            className="flex items-center space-x-1"
          >
            <Zap className="w-4 h-4" />
            <span>Auto-assign {autoAssignEnabled ? 'ON' : 'OFF'}</span>
          </Button>
          <Badge variant="secondary">
            {sessions.filter(s => s.status === 'waiting').length} Waiting
          </Badge>
          <Badge variant="secondary">
            {sessions.filter(s => s.status === 'active').length} Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chat Sessions List */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Chat Sessions</h3>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              {sessions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No chat sessions found
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSession === session.id 
                          ? 'border-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleSessionSelect(session.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(session.status)}
                          <span className="font-medium text-sm">
                            {session.customer_profile?.full_name || 'Anonymous'}
                          </span>
                          {session.unread_count > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {session.unread_count}
                            </Badge>
                          )}
                        </div>
                        <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                          {session.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {session.subject || 'No subject'}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{format(new Date(session.created_at), 'MMM d, HH:mm')}</span>
                        <div className="flex space-x-2">
                          {session.status === 'waiting' && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                assignToSelf(session.id);
                              }}
                              className="text-xs h-6"
                            >
                              Assign to Me
                            </Button>
                          )}
                          {session.status === 'active' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                closeSession(session.id);
                              }}
                              className="text-xs h-6"
                            >
                              Close
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">
              {selectedSession ? 'Chat Interface' : 'Select a chat session'}
            </h3>
          </CardHeader>
          <CardContent className="p-4">
            {selectedSession && selectedSessionData ? (
              <AgentChatInterface
                sessionId={selectedSession}
                customerName={selectedSessionData.customer_profile?.full_name}
                onClose={() => {
                  setSelectedSession(null);
                  setSelectedSessionData(null);
                }}
              />
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a chat session to start responding</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};