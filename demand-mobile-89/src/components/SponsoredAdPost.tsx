
import { useState } from 'react';
import { Heart, MessageCircle, Share2, Phone, ExternalLink, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SponsoredAdPostProps {
  ad: {
    id: string;
    title: string;
    description: string;
    business_name: string;
    contact_info: string;
    image_url?: string;
    website_url?: string;
    service_area?: string;
    created_at: string;
  };
}

export const SponsoredAdPost = ({ ad }: SponsoredAdPostProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(Math.floor(Math.random() * 50) + 5);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const days = Math.floor(diffInHours / 24);
    return days === 1 ? '1d ago' : `${days}d ago`;
  };

  // Safety checks for required data
  if (!ad || !ad.business_name || !ad.title || !ad.description) {
    return null;
  }

  return (
    <div className="w-full py-3">
      {/* Compact Sponsored Badge */}
      <div className="mb-2">
        <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 text-xs border border-yellow-200">
          Sponsored
        </Badge>
      </div>

      {/* Compact Business Header */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold text-xs">
            {ad.business_name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{ad.business_name}</h3>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{formatTimeAgo(ad.created_at)}</span>
            </div>
          </div>
          {ad.service_area && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{ad.service_area}</span>
            </div>
          )}
        </div>
      </div>

      {/* Compact Ad Content */}
      <div className="mb-3">
        <h4 className="font-medium text-sm text-gray-900 mb-1">{ad.title}</h4>
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">{ad.description}</p>
        
        {/* Compact Image */}
        {ad.image_url && (
          <div className="mt-2 rounded-lg overflow-hidden">
            <img 
              src={ad.image_url} 
              alt={ad.title}
              className="w-full h-32 sm:h-40 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => window.open(ad.website_url || '#', '_blank')}
            />
          </div>
        )}

        {/* Compact Call-to-Action Buttons */}
        <div className="flex gap-2 mt-2">
          {ad.contact_info && (
            <Button 
              size="sm" 
              className="flex-1 bg-blue-600 hover:bg-blue-700 h-8 text-xs px-3"
              onClick={() => window.open(`tel:${ad.contact_info}`, '_self')}
            >
              <Phone className="w-3 h-3 mr-1" />
              Call
            </Button>
          )}
          {ad.website_url && (
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 h-8 text-xs px-3"
              onClick={() => window.open(ad.website_url, '_blank')}
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Visit
            </Button>
          )}
        </div>
      </div>

      {/* Compact Engagement Actions */}
      <div className="border-t border-gray-100 pt-2">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{likes} likes</span>
          <span>3 comments</span>
        </div>
        
        <div className="flex items-center justify-around border-t border-gray-100 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center space-x-1 transition-colors flex-1 justify-center h-8 text-xs ${
              isLiked
                ? 'text-red-600 hover:text-red-700'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
            <span>Like</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors flex-1 justify-center h-8 text-xs"
          >
            <MessageCircle className="w-3 h-3" />
            <span>Comment</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors flex-1 justify-center h-8 text-xs"
          >
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
