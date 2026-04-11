import { useState } from 'react';
import { ExternalLink, Phone, Star, MapPin, Clock, Shield, Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CommentDialog } from './CommentDialog';
import { ShareDialog } from './ShareDialog';
import { useAdInteractions } from '@/hooks/useAdInteractions';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface SocialAdCardProps {
  ad: Advertisement;
  onInteraction: (adId: number, type: 'view' | 'click' | 'like' | 'share') => void;
}

export const SocialAdCard = ({ ad, onInteraction }: SocialAdCardProps) => {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  
  const {
    adMetrics,
    isLiked,
    toggleAdLike,
    shareAd,
    addAdComment,
    trackBooking
  } = useAdInteractions(ad.id);

  const handleLike = () => {
    toggleAdLike();
  };

  const handleShare = (method: 'copy' | 'facebook' | 'twitter' | 'whatsapp') => {
    shareAd(method);
  };

  const handleComment = (comment: string) => {
    addAdComment(comment);
  };

  const handleClick = () => {
    onInteraction(ad.id, 'click');
    trackBooking(); // Track when user clicks call/book buttons
  };

  const getBusinessAvatar = () => {
    // Generate a simple avatar based on business name
    const initials = ad.ad_title.split(' ').map(word => word.charAt(0)).join('').slice(0, 2);
    return initials;
  };

  return (
    <Card className="border-gray-200 bg-gradient-to-br from-green-50 to-white">
      <CardContent className="p-0">
        
        {/* Ad Header */}
        <div className="flex items-center justify-between p-4 pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-green-200">
              <AvatarImage src={ad.image_url || ''} />
              <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                {getBusinessAvatar()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900">{ad.ad_title}</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-2 py-0">
                  ✓ Verified Business
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-0 border-orange-200 text-orange-700 bg-orange-50">
                  Sponsored
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>Local Business</span>
                <span>•</span>
                <span>Promoted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Content */}
        <div className="px-4 pb-3">
          <p className="text-gray-800 leading-relaxed mb-3">{ad.content}</p>
          
          {/* Service highlights */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
              <Star className="w-3 h-3 mr-1 fill-current" />
              4.9 Rating
            </Badge>
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Same Day Service
            </Badge>
            <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Licensed & Insured
            </Badge>
          </div>
        </div>

        {/* Ad Image */}
        {ad.image_url && (
          <div className="px-4 pb-3">
            <img 
              src={ad.image_url} 
              alt={ad.ad_title} 
              className="w-full rounded-lg max-h-64 object-cover border border-green-100"
            />
          </div>
        )}

        {/* Call to Action Section */}
        <div className="px-4 pb-3">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{ad.ad_description}</h4>
                <p className="text-green-100 text-sm opacity-90">Professional service • Instant booking available</p>
              </div>
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-4"
                  onClick={handleClick}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-green-600 w-full"
                  onClick={handleClick}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Book Online
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Engagement Stats */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>{adMetrics.likes_count} {adMetrics.likes_count === 1 ? 'like' : 'likes'}</span>
              <span>{adMetrics.shares_count} {adMetrics.shares_count === 1 ? 'share' : 'shares'}</span>
              <span>{adMetrics.bookings_count} {adMetrics.bookings_count === 1 ? 'booking' : 'bookings'} today</span>
            </div>
            <span className="text-green-600 font-medium">Special Offer</span>
          </div>
        </div>

        {/* Social Action Buttons */}
        <div className="px-4 py-2 border-t border-gray-100">
          <div className="flex items-center justify-around">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLike}
              className={`flex-1 transition-colors ${
                isLiked 
                  ? 'text-red-600 hover:text-red-700' 
                  : 'text-gray-600 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              {isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCommentDialogOpen(true)}
              className="flex-1 text-gray-600 hover:text-green-600"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Comment
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShareDialogOpen(true)}
              className="flex-1 text-gray-600 hover:text-green-600"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Ad disclaimer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            This is a sponsored post from a verified local business
          </p>
        </div>
      </CardContent>

      {/* Comment Dialog */}
      <CommentDialog
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        onSubmit={handleComment}
      />

      {/* Share Dialog */}
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        onShare={handleShare}
      />
    </Card>
  );
};