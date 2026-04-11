
import { useState } from 'react';
import { X, Phone, Shovel, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface CompactAdBannerProps {
  ad: Advertisement;
  onClose: () => void;
  showShovel?: boolean;
}

export const CompactAdBanner = ({ ad, onClose, showShovel = false }: CompactAdBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showFullDetails, setShowFullDetails] = useState(false);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  return (
    <>
      {/* Shovel separator with fade animation */}
      {showShovel && (
        <div className="flex justify-center py-2 bg-gray-50">
          <div className="animate-fade-in">
            <Shovel className="w-6 h-6 text-gray-400 animate-pulse" />
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200 shadow-sm animate-fade-in">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1">
              Ad
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col space-y-3">
            {/* Image Section */}
            {ad.image_url && (
              <div className="w-full h-32 sm:h-40 rounded-lg overflow-hidden">
                <img 
                  src={ad.image_url} 
                  alt={ad.ad_title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Content Section */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {ad.ad_title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {ad.ad_description}
              </p>
              {ad.target_zip_codes && ad.target_zip_codes.length > 0 && (
                <p className="text-xs text-gray-500">
                  Service Area: {ad.target_zip_codes.join(', ')}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-sm px-4 py-2"
                onClick={() => window.open('#', '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Contact Now
              </Button>
              
              <Dialog open={showFullDetails} onOpenChange={setShowFullDetails}>
                <DialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-sm px-4 py-2"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{ad.ad_title}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* Full-size image */}
                    {ad.image_url && (
                      <div className="w-full h-64 rounded-lg overflow-hidden">
                        <img 
                          src={ad.image_url} 
                          alt={ad.ad_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Full description */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">About this service</h4>
                        <p className="text-gray-700 leading-relaxed">{ad.ad_description}</p>
                      </div>
                      
                      {/* Service details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        {ad.target_zip_codes && ad.target_zip_codes.length > 0 && (
                          <div>
                            <span className="font-medium text-gray-900">Service Areas:</span>
                            <p className="text-gray-600">{ad.target_zip_codes.join(', ')}</p>
                          </div>
                        )}
                        
                        <div>
                          <span className="font-medium text-gray-900">Plan Type:</span>
                          <p className="text-gray-600 capitalize">{ad.plan_type}</p>
                        </div>
                        
                        {ad.start_date && (
                          <div>
                            <span className="font-medium text-gray-900">Available Since:</span>
                            <p className="text-gray-600">{new Date(ad.start_date).toLocaleDateString()}</p>
                          </div>
                        )}
                        
                        <div>
                          <span className="font-medium text-gray-900">Views:</span>
                          <p className="text-gray-600">{ad.views_count} views</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action buttons in modal */}
                    <div className="flex gap-3 pt-4 border-t">
                      <Button 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => window.open('#', '_self')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Contact Now
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowFullDetails(false)}
                      >
                        Close
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
