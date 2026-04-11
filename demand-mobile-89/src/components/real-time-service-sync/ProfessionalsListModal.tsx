
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, User } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { HandymanService } from './types';

interface ProfessionalsListModalProps {
  isOpen: boolean;
  onClose: () => void;
  subserviceName: string;
  services: HandymanService[];
  onProfileView: (handymanId: string) => void;
}

export const ProfessionalsListModal = ({ 
  isOpen, 
  onClose, 
  subserviceName, 
  services,
  onProfileView 
}: ProfessionalsListModalProps) => {
  const [professionalProfiles, setProfessionalProfiles] = useState<Record<string, any>>({});
  
  // Fetch real profile data for professionals
  useEffect(() => {
    const fetchProfessionalProfiles = async () => {
      const uniqueUserIds = [...new Set(services.map(s => s.user_id))];
      
      if (uniqueUserIds.length === 0) return;
      
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, average_rating, total_ratings')
        .in('id', uniqueUserIds);
      
      if (profiles) {
        const profilesMap = profiles.reduce((acc, profile) => {
          acc[profile.id] = profile;
          return acc;
        }, {});
        setProfessionalProfiles(profilesMap);
      }
    };
    
    if (isOpen && services.length > 0) {
      fetchProfessionalProfiles();
    }
  }, [isOpen, services]);
  
  // Group services by handyman
  const groupedByHandyman = services.reduce((acc, service) => {
    if (!acc[service.user_id]) {
      const profile = professionalProfiles[service.user_id];
      acc[service.user_id] = {
        handyman: {
          id: service.user_id,
          name: profile?.full_name || service.handyman_name,
          avatar_url: profile?.avatar_url,
          rating: profile?.average_rating || service.handyman_rating || 0,
          reviews: profile?.total_ratings || service.handyman_reviews || 0
        },
        services: []
      };
    }
    acc[service.user_id].services.push(service);
    return acc;
  }, {} as Record<string, { handyman: any; services: HandymanService[] }>);

  const handleBookNow = (handymanId: string, serviceName: string, price: number) => {
    window.location.href = `/book/${handymanId}?service=${encodeURIComponent(serviceName)}&price=${price}`;
    toast.success(`Booking ${serviceName} for $${price}`);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{subserviceName}</h2>
              <p className="text-gray-600">{Object.keys(groupedByHandyman).length} professionals available</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {Object.entries(groupedByHandyman).map(([handymanId, { handyman, services: handymanServices }]) => {
            const avgPrice = Math.round(
              handymanServices.reduce((sum, s) => sum + (s.custom_price || s.base_price), 0) / handymanServices.length
            );

            return (
              <Card key={handymanId} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar with real photo */}
                    <div 
                      className="w-16 h-16 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform border-2 border-gray-200"
                      onClick={() => onProfileView(handymanId)}
                    >
                      {handyman.avatar_url ? (
                        <img 
                          src={handyman.avatar_url} 
                          alt={handyman.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                          {handyman.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 
                          className="font-bold text-lg text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => onProfileView(handymanId)}
                        >
                          {handyman.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(handyman.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {(handyman.rating || 0).toFixed(1)} ({handyman.reviews || 0} reviews)
                        </span>
                      </div>
                      
                      {/* Services with Pricing */}
                      <div className="space-y-3 mb-4">
                        {handymanServices.map((service, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-900">
                                {service.subcategory_name || service.category_name}
                              </span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {service.is_active ? 'Available' : 'Unavailable'}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">
                                ${service.custom_price || service.base_price}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">/hr</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          onClick={() => handleBookNow(handymanId, subserviceName, handymanServices[0]?.custom_price || handymanServices[0]?.base_price || 0)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Book Now
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => onProfileView(handymanId)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};
