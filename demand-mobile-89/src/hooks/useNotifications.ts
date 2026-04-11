
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useQuoteNotifications } from '@/hooks/useQuoteNotifications';

export interface AppNotification {
  id: string;
  type: 'message' | 'job_request' | 'quote' | 'system';
  title: string;
  description: string;
  isRead: boolean;
  createdAt: string;
  jobId?: string;
  senderId?: string;
  senderName?: string;
}

export const useNotifications = () => {
  const { user, profile } = useAuth();
  const { unreadCount: unreadMessagesCount } = useUnreadMessages();
  const { notifications: quoteNotifications, unreadCount: unreadQuotesCount } = useQuoteNotifications();
  const [systemNotifications, setSystemNotifications] = useState<AppNotification[]>([]);
  const [messageNotifications, setMessageNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('useNotifications: user:', user?.id, 'role:', profile?.user_role);
  console.log('useNotifications: unreadMessagesCount:', unreadMessagesCount);
  console.log('useNotifications: unreadQuotesCount:', unreadQuotesCount);

  // Fetch system notifications
  const fetchSystemNotifications = async () => {
    if (!user || !profile) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .in('recipient_role', [profile.user_role, 'all'])
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedNotifications: AppNotification[] = (data || []).map(notification => ({
        id: notification.id,
        type: 'system',
        title: 'System Notification',
        description: notification.message || 'No message',
        isRead: notification.is_read || false,
        createdAt: notification.created_at || new Date().toISOString(),
        jobId: notification.job_id || undefined,
      }));

      console.log('useNotifications: system notifications:', formattedNotifications);
      setSystemNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching system notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch message notifications
  const fetchMessageNotifications = async () => {
    if (!user) return;

    try {
      console.log('useNotifications: fetching messages for user:', user.id);
      
      // First, get the messages
      const { data: messages, error: messagesError } = await supabase
        .from('job_messages')
        .select('id, message_text, created_at, is_read, job_id, sender_id')
        .eq('receiver_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (messagesError) {
        console.error('useNotifications: Error fetching messages:', messagesError);
        throw messagesError;
      }

      console.log('useNotifications: raw messages:', messages);

      // Get sender profile information for each message
      const formattedMessages: AppNotification[] = [];
      
      for (const message of messages || []) {
        let senderName = 'Unknown';
        
        if (message.sender_id) {
          try {
            const { data: senderProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', message.sender_id)
              .single();
            
            if (senderProfile?.full_name) {
              senderName = senderProfile.full_name;
            }
          } catch (error) {
            console.error('useNotifications: Error fetching sender profile:', error);
            // Continue with 'Unknown' sender name
          }
        }

        formattedMessages.push({
          id: message.id,
          type: 'message',
          title: 'New Message',
          description: message.message_text || 'You have a new message',
          isRead: message.is_read,
          createdAt: message.created_at,
          jobId: message.job_id,
          senderId: message.sender_id,
          senderName,
        });
      }

      console.log('useNotifications: formatted messages:', formattedMessages);
      setMessageNotifications(formattedMessages);
    } catch (error) {
      console.error('Error fetching message notifications:', error);
    }
  };

  // Get all notifications combined
  const getAllNotifications = (): AppNotification[] => {
    const allNotifications: AppNotification[] = [
      ...systemNotifications,
      ...messageNotifications,
      ...quoteNotifications.map(qn => ({
        id: qn.id,
        type: 'quote' as const,
        title: qn.title,
        description: qn.message,
        isRead: qn.is_read,
        createdAt: qn.created_at,
      }))
    ];

    const sortedNotifications = allNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    console.log('useNotifications: all notifications:', sortedNotifications);
    return sortedNotifications;
  };

  // Get total unread count
  const getTotalUnreadCount = () => {
    const total = unreadMessagesCount + unreadQuotesCount + 
           systemNotifications.filter(n => !n.isRead).length;
    console.log('useNotifications: total unread count:', total);
    return total;
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string, type: string) => {
    console.log('useNotifications: marking as read:', notificationId, type);
    
    try {
      if (type === 'system') {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notificationId);
        
        setSystemNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
      } else if (type === 'message') {
        await supabase
          .from('job_messages')
          .update({ is_read: true })
          .eq('id', notificationId);
        
        setMessageNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
      }
      // Quote notifications are handled by useQuoteNotifications hook
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      // Mark all system notifications as read
      const unreadSystemNotifications = systemNotifications.filter(n => !n.isRead);
      if (unreadSystemNotifications.length > 0) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .in('id', unreadSystemNotifications.map(n => n.id));
        
        setSystemNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true }))
        );
      }

      // Mark all message notifications as read
      const unreadMessageNotifications = messageNotifications.filter(n => !n.isRead);
      if (unreadMessageNotifications.length > 0) {
        await supabase
          .from('job_messages')
          .update({ is_read: true })
          .in('id', unreadMessageNotifications.map(n => n.id));
        
        setMessageNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true }))
        );
      }

      // Quote notifications will be handled by their own hook
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Clear notification (remove from list)
  const clearNotification = async (notificationId: string, type: string) => {
    console.log('useNotifications: clearing notification:', notificationId, type);
    
    if (type === 'system') {
      setSystemNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
    } else if (type === 'message') {
      setMessageNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
    }
  };

  // Set up real-time subscription for system notifications
  useEffect(() => {
    if (!user) return;

    console.log('useNotifications: setting up real-time subscriptions for user:', user.id);

    const channel = supabase
      .channel('system-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('useNotifications: new system notification:', payload);
          const newNotification: AppNotification = {
            id: payload.new.id,
            type: 'system',
            title: 'System Notification',
            description: payload.new.message || 'No message',
            isRead: payload.new.is_read || false,
            createdAt: payload.new.created_at || new Date().toISOString(),
            jobId: payload.new.job_id || undefined,
          };
          
          setSystemNotifications(prev => [newNotification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'job_messages',
          filter: `receiver_id=eq.${user.id}`
        },
        (payload) => {
          console.log('useNotifications: new message notification:', payload);
          const newMessage: AppNotification = {
            id: payload.new.id,
            type: 'message',
            title: 'New Message',
            description: payload.new.message_text || 'You have a new message',
            isRead: payload.new.is_read || false,
            createdAt: payload.new.created_at || new Date().toISOString(),
            jobId: payload.new.job_id,
            senderId: payload.new.sender_id,
          };
          
          setMessageNotifications(prev => [newMessage, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Initial fetch
  useEffect(() => {
    if (profile) {
      fetchSystemNotifications();
      fetchMessageNotifications();
    }
  }, [user, profile]);

  return {
    notifications: getAllNotifications(),
    unreadCount: getTotalUnreadCount(),
    loading,
    markAsRead,
    markAllAsRead,
    clearNotification,
    refetch: () => {
      fetchSystemNotifications();
      fetchMessageNotifications();
    }
  };
};
