
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointer, Calendar, DollarSign, MapPin, Phone, Globe, Star, Heart, Share2 } from 'lucide-react';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface PublicAdCardProps {
  ad: Advertisement;
  onView: (adId: number) => void;
  onClick: (adId: number) => void;
}

export const PublicAdCard = ({ ad, onView, onClick }: PublicAdCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{ad.ad_title}</h3>
              <Badge variant="outline">{ad.plan_type}</Badge>
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">{ad.ad_description}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{ad.views_count} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <MousePointer className="w-4 h-4" />
                <span>{ad.clicks_count} clicks</span>
              </div>
            </div>

            <Button 
              onClick={() => {
                onView(ad.id);
                onClick(ad.id);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              View Details
            </Button>
          </div>
          
          {ad.image_url && (
            <div className="ml-4 flex-shrink-0">
              <img 
                src={ad.image_url} 
                alt="Ad preview"
                className="w-24 h-16 object-cover rounded"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
