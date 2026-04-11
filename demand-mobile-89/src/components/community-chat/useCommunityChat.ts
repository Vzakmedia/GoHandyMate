
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';
import { ChatMessage } from './MessageCard';

export const useCommunityChat = (selectedLocation: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchUserProfiles = async (userIds: string[]) => {
    if (userIds.length === 0) return {};

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      if (error) throw error;

      const profileMap: Record<string, any> = {};
      profiles?.forEach(profile => {
        profileMap[profile.id] = profile;
      });

      return profileMap;
    } catch (error) {
      console.error('Error fetching user profiles:', error);
      return {};
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Use secure function to get community messages with privacy protection
      const { data: messagesData, error } = await supabase
        .rpc('get_community_messages_safe', { limit_count: 50 });

      if (error) throw error;

      let filteredMessages = messagesData || [];

      // Apply location filter if needed
      if (selectedLocation !== 'All Areas') {
        const locationFilter = selectedLocation.split('(')[0].trim();
        filteredMessages = filteredMessages.filter((msg: any) => 
          msg.location && msg.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }

      // Get unique user IDs for profile fetching
      const userIds = [...new Set(filteredMessages.map((msg: any) => msg.user_id))];
      
      // Fetch user profiles
      const profilesMap = await fetchUserProfiles(userIds);
      
      // Attach profile data to messages
      const messagesWithProfiles = filteredMessages.map((msg: any) => ({
        ...msg,
        profile: profilesMap[msg.user_id] || null
      }));

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('community_messages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_messages'
        },
        async (payload) => {
          console.log('Real-time message update:', payload);
          if (payload.eventType === 'INSERT') {
            const newMessage = payload.new as ChatMessage;
            
            // Fetch profile for the new message
            const profilesMap = await fetchUserProfiles([newMessage.user_id]);
            const messageWithProfile = {
              ...newMessage,
              profile: profilesMap[newMessage.user_id] || null
            };
            
            setMessages(prev => [...prev, messageWithProfile]);
          } else if (payload.eventType === 'UPDATE') {
            setMessages(prev => prev.map(msg => 
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            ));
          } else if (payload.eventType === 'DELETE') {
            setMessages(prev => prev.filter(msg => msg.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const toggleLike = async (messageId: string) => {
    if (!user) return;

    const isLiked = likedMessages.has(messageId);
    
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const newLikesCount = isLiked ? message.likes_count - 1 : message.likes_count + 1;

      const { error } = await supabase
        .from('community_messages')
        .update({ likes_count: newLikesCount })
        .eq('id', messageId);

      if (error) throw error;

      setLikedMessages(prev => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.delete(messageId);
        } else {
          newSet.add(messageId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleUpdateMessage = (messageId: string, newMessage: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, message: newMessage } : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, [selectedLocation]);

  return {
    messages,
    loading,
    likedMessages,
    toggleLike,
    user,
    handleUpdateMessage,
    handleDeleteMessage
  };
};
