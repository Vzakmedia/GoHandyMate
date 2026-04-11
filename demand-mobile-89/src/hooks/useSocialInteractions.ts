import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

export const useSocialInteractions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());

  // Fetch user's liked messages
  const fetchLikedMessages = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('community_message_likes')
        .select('message_id')
        .eq('user_id', user.id);

      if (data) {
        setLikedMessages(new Set(data.map(like => like.message_id)));
      }
    } catch (error) {
      console.error('Error fetching liked messages:', error);
    }
  };

  // Toggle like on a message
  const toggleLike = async (messageId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    const isLiked = likedMessages.has(messageId);
    
    try {
      if (isLiked) {
        // Remove like
        await supabase
          .from('community_message_likes')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', user.id);

        // Update likes count
        await supabase.rpc('decrement_message_likes', { message_id: messageId });

        setLikedMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });

        toast({
          title: "Like removed",
          description: "You unliked this post",
        });
      } else {
        // Add like
        await supabase
          .from('community_message_likes')
          .insert({
            message_id: messageId,
            user_id: user.id
          });

        // Update likes count
        await supabase.rpc('increment_message_likes', { message_id: messageId });

        setLikedMessages(prev => new Set([...prev, messageId]));

        toast({
          title: "Post liked!",
          description: "You liked this post",
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  // Add comment to a message
  const addComment = async (messageId: string, comment: string) => {
    if (!user || !comment.trim()) return;

    try {
      const { data: message } = await supabase
        .from('community_messages')
        .select('user_name, location')
        .eq('id', messageId)
        .single();

      if (!message) return;

      // Create reply message
      await supabase
        .from('community_messages')
        .insert({
          user_id: user.id,
          user_name: user.user_metadata?.full_name || user.email || 'Anonymous',
          message: comment,
          location: message.location,
          reply_to_id: messageId,
          likes_count: 0,
          replies_count: 0
        });

      // Increment replies count on original message
      await supabase.rpc('increment_message_replies', { message_id: messageId });

      toast({
        title: "Comment added!",
        description: "Your comment has been posted",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  // Share functionality
  const sharePost = async (messageId: string, method: 'copy' | 'facebook' | 'twitter' | 'whatsapp') => {
    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/post/${messageId}`;

    try {
      switch (method) {
        case 'copy':
          await navigator.clipboard.writeText(postUrl);
          toast({
            title: "Link copied!",
            description: "Post link copied to clipboard",
          });
          break;

        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
          break;

        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=Check out this post from our community!`, '_blank');
          break;

        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this post: ${postUrl}`)}`, '_blank');
          break;
      }

      // Track share interaction
      await supabase
        .from('post_interactions')
        .insert({
          user_id: user?.id,
          message_id: messageId,
          interaction_type: 'share',
          interaction_data: { method }
        });

    } catch (error) {
      console.error('Error sharing post:', error);
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchLikedMessages();
    }
  }, [user]);

  return {
    likedMessages,
    toggleLike,
    addComment,
    sharePost,
    refetchLikes: fetchLikedMessages
  };
};