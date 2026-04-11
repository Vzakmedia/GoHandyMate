import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: string;
  content: string;
  message?: string; // backward compatibility
  created_at: string;
  is_read: boolean;
  sender_type?: 'customer' | 'agent'; // computed property
}

export interface ChatSession {
  id: string;
  customer_id: string;
  agent_id?: string | null;
  status: 'waiting' | 'active' | 'closed' | 'transferred';
  subject?: string | null;
  created_at: string;
  updated_at: string;
}

export const useChat = (sessionId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const { toast } = useToast();

  // Load chat session and messages
  const loadChat = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      setSession(sessionData);

      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      
      // Add computed sender_type based on sender_id vs customer_id
      const messagesWithType = (messagesData || []).map(msg => ({
        ...msg,
        sender_type: msg.sender_id === sessionData?.customer_id ? 'customer' as const : 'agent' as const
      }));
      
      setMessages(messagesWithType);
    } catch (error) {
      console.error('Error loading chat:', error);
      toast({
        title: "Error",
        description: "Failed to load chat session",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [sessionId, toast]);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (isTyping: boolean) => {
    if (!sessionId) return;

    try {
      const channel = supabase.channel(`chat_${sessionId}`);
      await channel.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          is_typing: isTyping
        }
      });
    } catch (error) {
      console.error('Error sending typing indicator:', error);
    }
  }, [sessionId]);

  // Handle typing events
  const handleTyping = useCallback(() => {
    setTyping(true);
    sendTypingIndicator(true);
    
    // Auto-stop typing after 3 seconds
    const timer = setTimeout(() => {
      setTyping(false);
      sendTypingIndicator(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [sendTypingIndicator]);

  const stopTyping = useCallback(() => {
    setTyping(false);
    sendTypingIndicator(false);
  }, [sendTypingIndicator]);

  // Send a message
  const sendMessage = useCallback(async (message: string) => {
    if (!sessionId || !message.trim()) return;

    setSending(true);
    stopTyping(); // Stop typing when sending
    
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          content: message.trim(),
          sender_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  }, [sessionId, toast, stopTyping]);

  // Create new chat session
  const createSession = useCallback(async (subject?: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          subject: subject || 'Support Request',
          customer_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating chat session:', error);
      toast({
        title: "Error",
        description: "Failed to create chat session",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  // Mark messages as read
  const markAsRead = useCallback(async () => {
    if (!sessionId) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('session_id', sessionId)
        .neq('sender_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [sessionId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!sessionId) return;

    loadChat();

    const channel = supabase
      .channel(`chat_${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          const newMessage = {
            ...payload.new,
            sender_type: payload.new.sender_id === session?.customer_id ? 'customer' as const : 'agent' as const
          } as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_sessions',
          filter: `id=eq.${sessionId}`
        },
        (payload) => {
          setSession(payload.new as ChatSession);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === payload.new.id ? {
                ...payload.new,
                sender_type: payload.new.sender_id === session?.customer_id ? 'customer' as const : 'agent' as const
              } as ChatMessage : msg
            )
          );
        }
      )
      .on('broadcast', { event: 'typing' }, (payload) => {
        const currentUserId = supabase.auth.getUser().then(u => u.data.user?.id);
        currentUserId.then(userId => {
          if (payload.payload.user_id !== userId) {
            setOtherUserTyping(payload.payload.is_typing);
          }
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, loadChat]);

  return {
    messages,
    session,
    loading,
    sending,
    typing,
    otherUserTyping,
    sendMessage,
    createSession,
    markAsRead,
    handleTyping,
    stopTyping
  };
};