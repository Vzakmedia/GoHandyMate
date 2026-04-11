
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { X, Star, MapPin, Phone, Mail, Globe, Calendar } from 'lucide-react';

interface BusinessProfile {
  id: string;
  business_name: string;
  description: string;
  contact_email: string;
  contact_phone?: string;
  website?: string;
  address?: string;
  services_offered: string[];
  rating?: number;
  years_in_business?: number;
  license_number?: string;
  insurance_verified: boolean;
}

interface BusinessProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessId?: string;
  adData: {
    ad_title: string;
    ad_description: string;
    image_url?: string;
    target_audience: string;
  };
}

export const BusinessProfileModal = ({ 
  isOpen, 
  onClose, 
  businessName, 
  businessId,
  adData 
}: BusinessProfileModalProps) => {
  const { toast } = useToast();
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && businessId) {
      fetchBusinessProfile();
    }
  }, [isOpen, businessId]);

  const fetchBusinessProfile = async () => {
    if (!businessId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', businessId)
        .maybeSingle();

      if (error) {
        console.log('No business profile found, showing ad details instead');
        setBusinessProfile(null);
      } else {
        setBusinessProfile(data);
      }
    } catch (error) {
      console.error('Error fetching business profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBusinessProfile = () => {
    if (!businessProfile) {
      // Show advertisement details if no business profile exists
      return (
        <div className="space-y-6">
          {adData.image_url && (
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <img
                src={adData.image_url}
                alt={adData.ad_title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{adData.ad_title}</h3>
            <p className="text-gray-700 leading-relaxed">{adData.ad_description}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Limited Time Offer</span>
            </div>
            <p className="text-yellow-700 mt-1">
              This business is advertising their services but doesn't have a full profile yet. 
              Contact them directly to learn more about their offerings.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Target Audience:</span>
              <Badge variant="secondary">{adData.target_audience}</Badge>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Interested in their services? Get a personalized quote!
            </p>
            <Button className="w-full bg-green-600 hover:bg-green-700">
              Request Quote
            </Button>
          </div>
        </div>
      );
    }

    // Show full business profile
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{businessProfile.business_name}</h3>
          {businessProfile.rating && (
            <div className="flex items-center justify-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(businessProfile.rating!)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-800">{businessProfile.rating}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">About</h4>
          <p className="text-gray-700 leading-relaxed">{businessProfile.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {businessProfile.contact_email && (
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{businessProfile.contact_email}</span>
            </div>
          )}
          {businessProfile.contact_phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{businessProfile.contact_phone}</span>
            </div>
          )}
          {businessProfile.website && (
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <a 
                href={businessProfile.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
          {businessProfile.address && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{businessProfile.address}</span>
            </div>
          )}
        </div>

        {businessProfile.services_offered && businessProfile.services_offered.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Services Offered</h4>
            <div className="flex flex-wrap gap-2">
              {businessProfile.services_offered.map((service, index) => (
                <Badge key={index} variant="outline">{service}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-center">
          {businessProfile.years_in_business && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{businessProfile.years_in_business}</div>
              <div className="text-sm text-blue-800">Years in Business</div>
            </div>
          )}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">
              {businessProfile.insurance_verified ? '✓' : '⚠️'}
            </div>
            <div className="text-sm text-green-800">
              {businessProfile.insurance_verified ? 'Insured' : 'Unverified'}
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button className="flex-1 bg-green-600 hover:bg-green-700">
            Request Quote
          </Button>
          <Button variant="outline" className="flex-1">
            Contact Business
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {businessProfile ? businessProfile.business_name : businessName}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="mt-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            renderBusinessProfile()
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
