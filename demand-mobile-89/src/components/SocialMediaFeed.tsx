import { useState, useEffect } from 'react';
import { MessageCircle, Heart, Share2, Users, Plus, Camera, Smile, MapPin, Send } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import { useSocialInteractions } from '@/hooks/useSocialInteractions';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { supabase } from '@/integrations/supabase/client';
import { SocialAdCard } from '@/components/SocialAdCard';
import { ShareDialog } from '@/components/social/ShareDialog';
import { useCommunityChat } from '@/components/community-chat/useCommunityChat';
import { useMessageOperations } from '@/components/community-chat/useMessageOperations';
import { ChatMessage } from '@/components/community-chat/MessageCard';
import { ProfileView } from '@/components/community/ProfileView';

interface SocialPost extends ChatMessage {
  isLiked: boolean;
}

export const SocialMediaFeed = () => {
  const { user, profile } = useAuth();
  const { advertisements, trackInteraction } = useAdvertisements();
  const [selectedLocation, setSelectedLocation] = useState(profile?.city || profile?.zip_code || 'All Areas');
  const [currentPage, setCurrentPage] = useState(1);
  const [showComments, setShowComments] = useState<Set<string>>(new Set());
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [postComments, setPostComments] = useState<Record<string, ChatMessage[]>>({});
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  
  // Use real community chat data with proper location handling
  const { messages, loading, handleUpdateMessage, handleDeleteMessage } = useCommunityChat(selectedLocation);
  const messageOperations = useMessageOperations(user, selectedLocation);
  
  // Use social interactions hook for likes, comments, shares
  const { likedMessages, toggleLike, addComment, sharePost } = useSocialInteractions();

  // Update selected location when profile changes
  useEffect(() => {
    if (profile?.city || profile?.zip_code) {
      setSelectedLocation(profile.city || profile.zip_code);
    }
  }, [profile]);

  // Pagination logic - only count main posts (not replies)
  const POSTS_PER_PAGE = 6;
  const mainMessages = messages.filter(message => !message.reply_to_id);
  const totalPosts = mainMessages.length;
  const displayedPosts = mainMessages.slice(0, currentPage * POSTS_PER_PAGE);
  const hasMorePosts = totalPosts > currentPage * POSTS_PER_PAGE;

  // Convert filtered main posts to social posts format
  const posts: SocialPost[] = displayedPosts.map(message => ({
    ...message,
    isLiked: likedMessages.has(message.id)
  }));

  const handleLike = (postId: string) => {
    toggleLike(postId);
  };

  const handleToggleComments = async (postId: string) => {
    const newShowComments = new Set(showComments);
    if (newShowComments.has(postId)) {
      newShowComments.delete(postId);
    } else {
      newShowComments.add(postId);
      // Fetch comments for this post if not already loaded
      if (!postComments[postId]) {
        await fetchCommentsForPost(postId);
      }
    }
    setShowComments(newShowComments);
  };

  const fetchCommentsForPost = async (postId: string) => {
    try {
      // Use secure function to get comments (which are also community messages)
      const { data: allMessages } = await supabase
        .rpc('get_community_messages_safe', { limit_count: 200 });
        
      if (allMessages) {
        // Filter for comments on this specific post
        const comments = allMessages.filter((msg: ChatMessage) => msg.reply_to_id === postId);
        
        if (comments.length > 0) {
        // Get unique user IDs (use original user_id field for profile lookup)
        const userIds = [...new Set(comments.map((comment: ChatMessage) => comment.user_id))];
        
        // Fetch profiles for all users
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);
        
        // Create a map for quick profile lookup
        const profileMap = new Map(profiles?.map(profile => [profile.id, profile]) || []);
        
        // Type the comments properly as ChatMessage with profile data
        const typedComments: ChatMessage[] = comments.map((comment: ChatMessage) => ({
          ...comment,
          user_id: comment.user_id, // Keep the original user_id for functionality
          profile: profileMap.get(comment.user_id) || undefined,
          replies: [],
          image_url: comment.image_url || undefined,
          reply_to_id: comment.reply_to_id || undefined,
          reply_to_message: comment.reply_to_message || undefined,
          reply_to_user: comment.reply_to_user || undefined
        }));
        setPostComments(prev => ({ ...prev, [postId]: typedComments }));
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentTexts[postId]?.trim();
    if (!commentText || !user) return;

    try {
      await addComment(postId, commentText);
      setCommentTexts(prev => ({ ...prev, [postId]: '' }));
      // Refresh comments to show the new one
      await fetchCommentsForPost(postId);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  // Mix posts with advertisements for a natural feed flow
  const createMixedFeed = () => {
    const mixedItems = [];
    const activeAds = advertisements.filter(ad => ad.status === 'active');
    
    if (activeAds.length === 0) {
      // No ads available, just return posts
      posts.forEach(post => {
        mixedItems.push({ type: 'post', data: post });
      });
      return mixedItems;
    }
    
    // Insert ads more frequently for better visibility
    posts.forEach((post, index) => {
      mixedItems.push({ type: 'post', data: post });
      
      // Insert an ad every 2 posts, or always after the first post if we have few posts
      if ((index + 1) % 2 === 0 || (posts.length <= 3 && index === 0)) {
        const adIndex = Math.floor(mixedItems.filter(item => item.type === 'ad').length) % activeAds.length;
        mixedItems.push({ type: 'ad', data: activeAds[adIndex] });
      }
    });
    
    // If we have ads but no posts, show at least one ad
    if (posts.length === 0 && activeAds.length > 0) {
      mixedItems.push({ type: 'ad', data: activeAds[0] });
    }
    
    return mixedItems;
  };

  const handleAdInteraction = (adId: number, type: 'view' | 'click' | 'like' | 'share') => {
    // Only track view and click interactions in the backend
    if (type === 'view' || type === 'click') {
      trackInteraction(adId, type);
    }
    // Handle like and share locally for now
    console.log(`Ad ${type} interaction:`, adId);
  };

  const handleProfileClick = (userId: string) => {
    setSelectedProfile(userId);
  };

  // If showing a profile, render ProfileView
  if (selectedProfile) {
    return (
      <ProfileView
        userId={selectedProfile}
        onBack={() => setSelectedProfile(null)}
        onNavigateToConnections={() => {}}
        onNavigateToGroups={() => {}}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Container - Mobile optimized */}
      <div className="w-full px-3 py-4 sm:px-4 sm:py-6 max-w-2xl mx-auto">
        
        {/* Create Post Card */}
        {user && (
          <Card className="mb-4 sm:mb-6 border">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                  <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {(profile?.full_name || user?.user_metadata?.full_name || user?.email)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Textarea
                    placeholder="What's on your mind? Share with your neighbors..."
                    value={messageOperations.newMessage}
                    onChange={(e) => messageOperations.setNewMessage(e.target.value)}
                    className="min-h-[60px] sm:min-h-[80px] resize-none text-sm sm:text-base"
                  />
                  
                  {/* Image preview */}
                  {messageOperations.selectedImage && (
                    <div className="mt-3 flex items-center space-x-2 p-2 bg-muted rounded">
                      <img
                        src={URL.createObjectURL(messageOperations.selectedImage)}
                        alt="Preview"
                        className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                      />
                      <span className="text-xs sm:text-sm text-muted-foreground truncate">{messageOperations.selectedImage.name}</span>
                      <button
                        onClick={() => messageOperations.setSelectedImage(null)}
                        className="text-destructive hover:text-destructive/80 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-3 gap-2">
                    <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-primary whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3"
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Photo</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-primary whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3"
                        onClick={() => {
                          // Auto-set location based on user profile
                          if (profile?.city || profile?.zip_code) {
                            setSelectedLocation(profile.city || profile.zip_code);
                          }
                        }}
                      >
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Location</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary whitespace-nowrap text-xs sm:text-sm px-2 sm:px-3">
                        <Smile className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Feeling</span>
                      </Button>
                    </div>
                    
                    {/* Hidden file input */}
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) messageOperations.setSelectedImage(file);
                      }}
                    />
                    <Button 
                      onClick={messageOperations.sendMessage}
                      disabled={!messageOperations.newMessage.trim() && !messageOperations.selectedImage}
                      className="px-4 sm:px-6 text-xs sm:text-sm"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed with Integrated Ads */}
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-card rounded-lg border">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Be the first to share something with your community!</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {createMixedFeed().map((item, index) => {
              if (item.type === 'ad') {
                return (
                  <SocialAdCard 
                    key={`ad-${item.data.id}-${index}`}
                    ad={item.data}
                    onInteraction={handleAdInteraction}
                  />
                );
              } else {
                const post = item.data;
                return (
                  <Card key={post.id} className="border">
                    <CardContent className="p-0">
                      
                      {/* Post Header */}
                      <div className="flex items-center justify-between p-3 sm:p-4 pb-3">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                            <AvatarImage src={post.profile?.avatar_url} />
                            <AvatarFallback className="bg-secondary/50 text-secondary-foreground">
                              {(post.profile?.full_name || post.user_name).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                           <div className="min-w-0 flex-1">
                             <div className="flex items-center space-x-2">
                               <button 
                                 onClick={() => handleProfileClick(post.user_id)}
                                 className="font-semibold text-foreground text-sm sm:text-base truncate hover:underline cursor-pointer"
                               >
                                 {post.profile?.full_name || post.user_name}
                               </button>
                               {post.profile && (
                                 <Badge variant="secondary" className="text-xs px-1.5 py-0 shrink-0">
                                   ✓
                                 </Badge>
                               )}
                             </div>
                            <div className="flex items-center space-x-1 text-xs sm:text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="truncate">{post.location}</span>
                              <span>•</span>
                              <span className="whitespace-nowrap">{formatTimestamp(post.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="px-3 sm:px-4 pb-3">
                        <p className="text-foreground leading-relaxed text-sm sm:text-base">{post.message}</p>
                      </div>

                      {/* Post Image */}
                      {post.image_url && (
                        <div className="px-3 sm:px-4 pb-3">
                          <img 
                            src={post.image_url} 
                            alt="Post content" 
                            className="w-full rounded-lg max-h-80 sm:max-h-96 object-cover"
                          />
                        </div>
                      )}

                      {/* Post Stats */}
                      <div className="px-3 sm:px-4 py-2 border-t">
                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                          <div className="flex items-center space-x-3 sm:space-x-4">
                            <span>{post.likes_count} likes</span>
                            {post.replies_count > 0 && (
                              <button 
                                onClick={() => handleToggleComments(post.id)}
                                className="hover:underline cursor-pointer hover:text-primary"
                              >
                                {post.replies_count} comments
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="px-3 sm:px-4 py-2 border-t">
                        <div className="flex items-center justify-around">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleLike(post.id)}
                            className={`flex-1 text-xs sm:text-sm ${post.isLiked ? 'text-destructive hover:text-destructive/80' : 'text-muted-foreground hover:text-destructive'}`}
                          >
                            <Heart className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span className="hidden sm:inline">Like</span>
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleToggleComments(post.id)}
                            className={`flex-1 text-xs sm:text-sm ${showComments.has(post.id) ? 'text-primary hover:text-primary/80' : 'text-muted-foreground hover:text-primary'}`}
                          >
                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Comment</span>
                          </Button>
                          
                          <ShareDialog 
                            messageId={post.id} 
                            onShare={sharePost}
                          >
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex-1 text-xs sm:text-sm text-muted-foreground hover:text-primary"
                            >
                              <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Share</span>
                            </Button>
                          </ShareDialog>
                        </div>
                      </div>

                      {/* Comments Dropdown */}
                      {showComments.has(post.id) && (
                        <div className="px-3 sm:px-4 py-3 bg-muted/30 border-t">
                          
                          {/* Existing Comments */}
                          {postComments[post.id] && postComments[post.id].length > 0 && (
                            <div className="mb-4 max-h-48 sm:max-h-60 overflow-y-auto space-y-2 sm:space-y-3">
                               {postComments[post.id].map((comment) => (
                                 <div key={comment.id} className="flex items-start space-x-2 bg-card rounded-lg p-2 sm:p-3">
                                   <button onClick={() => handleProfileClick(comment.user_id)}>
                                     <Avatar className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 cursor-pointer hover:opacity-80">
                                       <AvatarImage src={comment.profile?.avatar_url} />
                                       <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                                         {(comment.profile?.full_name || comment.user_name).charAt(0).toUpperCase()}
                                       </AvatarFallback>
                                     </Avatar>
                                   </button>
                                   <div className="flex-1 min-w-0">
                                     <div className="bg-muted/50 rounded-2xl px-2 sm:px-3 py-1.5 sm:py-2">
                                       <button 
                                         onClick={() => handleProfileClick(comment.user_id)}
                                         className="font-semibold text-xs sm:text-sm text-foreground mb-1 hover:underline cursor-pointer"
                                       >
                                         {comment.profile?.full_name || comment.user_name}
                                       </button>
                                       <p className="text-xs sm:text-sm text-foreground">{comment.message}</p>
                                     </div>
                                     <div className="flex items-center space-x-3 sm:space-x-4 mt-1 px-2 sm:px-3">
                                       <span className="text-xs text-muted-foreground">
                                         {formatTimestamp(comment.created_at)}
                                       </span>
                                       <button 
                                         onClick={() => toggleLike(comment.id)}
                                         className={`text-xs font-medium flex items-center space-x-1 ${
                                           likedMessages.has(comment.id) 
                                             ? 'text-destructive' 
                                             : 'text-muted-foreground hover:text-destructive'
                                         }`}
                                       >
                                         <Heart className={`w-3 h-3 ${likedMessages.has(comment.id) ? 'fill-current' : ''}`} />
                                         <span>Like</span>
                                         {comment.likes_count > 0 && (
                                           <span>({comment.likes_count})</span>
                                         )}
                                       </button>
                                       <button className="text-xs text-muted-foreground hover:text-primary font-medium">
                                         Reply
                                       </button>
                                     </div>
                                   </div>
                                 </div>
                              ))}
                            </div>
                          )}

                          {/* Add Comment Form */}
                          {user && (
                            <form onSubmit={(e) => handleCommentSubmit(post.id, e)}>
                              <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0">
                                  <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {(profile?.full_name || user?.user_metadata?.full_name || user?.email)?.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 flex items-center bg-card rounded-full px-3 py-2 border">
                                  <Input
                                    placeholder="Write a comment..."
                                    value={commentTexts[post.id] || ''}
                                    onChange={(e) => setCommentTexts(prev => ({ ...prev, [post.id]: e.target.value }))}
                                    className="flex-1 bg-transparent border-none focus:ring-0 focus:border-none shadow-none p-0 text-xs sm:text-sm"
                                  />
                                  
                                  {commentTexts[post.id]?.trim() && (
                                    <Button
                                      type="submit"
                                      size="sm"
                                      variant="ghost"
                                      className="ml-2 p-1 h-auto text-primary hover:text-primary/80 hover:bg-transparent"
                                    >
                                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </form>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
        )}

        {/* Load More */}
        {hasMorePosts && (
          <div className="text-center py-6 sm:py-8">
            <Button 
              variant="outline" 
              className="px-6 sm:px-8 text-sm sm:text-base"
              onClick={handleLoadMore}
            >
              <span className="sm:hidden">Load More ({totalPosts - displayedPosts.length})</span>
              <span className="hidden sm:inline">Load More Posts ({totalPosts - displayedPosts.length} remaining)</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};