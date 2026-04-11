import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

export const useAdInteractions = (adId: number) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [likedAds, setLikedAds] = useState<Set<string>>(new Set());
  const [adMetrics, setAdMetrics] = useState({
    likes_count: 0,
    shares_count: 0,
    comments_count: 0,
    bookings_count: 0
  });

  // Fetch user's liked ads
  const fetchLikedAds = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('advertisement_interactions')
        .select('advertisement_id')
        .eq('user_id', user.id)
        .eq('interaction_type', 'like');

      if (data) {
        setLikedAds(new Set(data.map(like => like.advertisement_id.toString())));
      }
    } catch (error) {
      console.error('Error fetching liked ads:', error);
    }
  };

  // Fetch advertisement metrics
  const fetchAdMetrics = async () => {
    try {
      const { data } = await supabase
        .from('advertisements')
        .select('likes_count, shares_count, comments_count, bookings_count')
        .eq('id', adId)
        .single();

      if (data) {
        setAdMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching ad metrics:', error);
    }
  };

  // Toggle like on an advertisement
  const toggleAdLike = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to like advertisements",
        variant: "destructive",
      });
      return;
    }

    const isLiked = likedAds.has(adId.toString());
    
    try {
      if (isLiked) {
        // Remove like
        await supabase
          .from('advertisement_interactions')
          .delete()
          .eq('advertisement_id', adId)
          .eq('user_id', user.id)
          .eq('interaction_type', 'like');

        // Update likes count
        await supabase.rpc('decrement_ad_likes', { ad_id: adId });

        setLikedAds(prev => {
          const newSet = new Set(prev);
          newSet.delete(adId.toString());
          return newSet;
        });

        setAdMetrics(prev => ({ ...prev, likes_count: Math.max(prev.likes_count - 1, 0) }));

        toast({
          title: "Like removed",
          description: "You unliked this advertisement",
        });
      } else {
        // Add like
        await supabase
          .from('advertisement_interactions')
          .insert({
            advertisement_id: adId,
            user_id: user.id,
            interaction_type: 'like'
          });

        // Update likes count
        await supabase.rpc('increment_ad_likes', { ad_id: adId });

        setLikedAds(prev => new Set([...prev, adId.toString()]));
        setAdMetrics(prev => ({ ...prev, likes_count: prev.likes_count + 1 }));

        toast({
          title: "Advertisement liked!",
          description: "You liked this advertisement",
        });
      }
    } catch (error) {
      console.error('Error toggling ad like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  // Share advertisement
  const shareAd = async (method: 'copy' | 'facebook' | 'twitter' | 'whatsapp') => {
    const baseUrl = window.location.origin;
    const adUrl = `${baseUrl}/ad/${adId}`;

    try {
      switch (method) {
        case 'copy':
          await navigator.clipboard.writeText(adUrl);
          toast({
            title: "Link copied!",
            description: "Advertisement link copied to clipboard",
          });
          break;

        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(adUrl)}`, '_blank');
          break;

        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(adUrl)}&text=Check out this business!`, '_blank');
          break;

        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`Check out this business: ${adUrl}`)}`, '_blank');
          break;
      }

      // Track share interaction
      if (user) {
        await supabase
          .from('advertisement_interactions')
          .insert({
            advertisement_id: adId,
            user_id: user.id,
            interaction_type: 'share',
            interaction_data: { method }
          });

        // Update shares count
        await supabase.rpc('increment_ad_shares', { ad_id: adId });
        setAdMetrics(prev => ({ ...prev, shares_count: prev.shares_count + 1 }));
      }

    } catch (error) {
      console.error('Error sharing ad:', error);
      toast({
        title: "Error",
        description: "Failed to share advertisement",
        variant: "destructive",
      });
    }
  };

  // Add comment to advertisement
  const addAdComment = async (comment: string) => {
    if (!user || !comment.trim()) return;

    try {
      await supabase
        .from('advertisement_interactions')
        .insert({
          advertisement_id: adId,
          user_id: user.id,
          interaction_type: 'comment',
          interaction_data: { comment }
        });

      // Update comments count
      await supabase.rpc('increment_ad_comments', { ad_id: adId });
      setAdMetrics(prev => ({ ...prev, comments_count: prev.comments_count + 1 }));

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

  // Track booking interaction
  const trackBooking = async () => {
    if (!user) return;

    try {
      await supabase
        .from('advertisement_interactions')
        .insert({
          advertisement_id: adId,
          user_id: user.id,
          interaction_type: 'booking'
        });

      // Update bookings count
      await supabase.rpc('increment_ad_bookings', { ad_id: adId });
      setAdMetrics(prev => ({ ...prev, bookings_count: prev.bookings_count + 1 }));
    } catch (error) {
      console.error('Error tracking booking:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchLikedAds();
    }
    fetchAdMetrics();
  }, [user, adId]);

  // Set up real-time subscription for ad metrics
  useEffect(() => {
    const channel = supabase
      .channel('ad-metrics')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'advertisements',
          filter: `id=eq.${adId}`
        },
        (payload) => {
          if (payload.new) {
            setAdMetrics({
              likes_count: payload.new.likes_count || 0,
              shares_count: payload.new.shares_count || 0,
              comments_count: payload.new.comments_count || 0,
              bookings_count: payload.new.bookings_count || 0
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [adId]);

  return {
    likedAds,
    adMetrics,
    toggleAdLike,
    shareAd,
    addAdComment,
    trackBooking,
    isLiked: likedAds.has(adId.toString()),
    refetchMetrics: fetchAdMetrics
  };
};