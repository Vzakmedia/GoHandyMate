
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useAudioNotifications } from '@/hooks/useAudioNotifications';
import { toast } from 'sonner';

interface JobMessage {
  id: string;
  job_id: string;
  sender_id: string;
  receiver_id: string;
  message_text: string;
  message_type: string;
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export const useJobMessages = (jobId: string) => {
  const { user } = useAuth();
  const { playMessageTone } = useAudioNotifications();
  const [messages, setMessages] = useState<JobMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Fetch existing messages
  const fetchMessages = async () => {
    if (!user || !jobId) return;

    try {
      const { data, error } = await supabase
        .from('job_messages')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Send a new message
  const sendMessage = async (messageText: string, receiverId: string) => {
    if (!user || !messageText.trim()) return;

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('job_messages')
        .insert({
          job_id: jobId,
          sender_id: user.id,
          receiver_id: receiverId,
          message_text: messageText.trim(),
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;
      
      // Message will be added via real-time subscription
      toast.success('Message sent!');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Mark messages as read
  const markAsRead = async (messageIds: string[]) => {
    if (!user || messageIds.length === 0) return;

    try {
      const { error } = await supabase
        .from('job_messages')
        .update({ is_read: true })
        .in('id', messageIds)
        .eq('receiver_id', user.id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !jobId) return;

    fetchMessages();

    const channel = supabase
      .channel(`job-messages-${jobId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_messages',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          const newMessage = payload.new as JobMessage;
          setMessages(prev => [...prev, newMessage]);
          
          // Play notification sound if message is from another user
          if (newMessage.sender_id !== user.id) {
            playMessageTone();
            toast.info('New message received');
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'job_messages',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          const updatedMessage = payload.new as JobMessage;
          setMessages(prev => 
            prev.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, jobId, playMessageTone]);

  // Auto-mark messages as read when they come into view
  useEffect(() => {
    if (!user || messages.length === 0) return;

    const unreadMessages = messages
      .filter(msg => !msg.is_read && msg.receiver_id === user.id)
      .map(msg => msg.id);

    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }
  }, [messages, user]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
    fetchMessages
  };
};
