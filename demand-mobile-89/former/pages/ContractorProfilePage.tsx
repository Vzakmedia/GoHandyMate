import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, MapPin, Clock, CheckCircle, Building, Phone, Mail, Globe } from 'lucide-react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { toast } from 'sonner';

interface ContractorProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  business_name?: string;
  company_name?: string;
  user_role: string;
  account_status: string;
  created_at: string;
  phone?: string;
  average_rating?: number;
  total_ratings?: number;
  jobs_this_month?: number;
  business_profiles?: {
    business_name: string;
    contact_email: string;
    contact_phone?: string;
    description?: string;
    services_offered?: string[];
    years_in_business?: number;
    website?: string;
    address?: string;
    insurance_verified?: boolean;
    license_number?: string;
  }[];
}

export const ContractorProfilePage = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const [contractor, setContractor] = useState<ContractorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContractorProfile = async () => {
      if (!profileId) return;

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            business_profiles (*)
          `)
          .eq('id', profileId)
          .eq('user_role', 'contractor')
          .single();

        if (error) {
          console.error('Error fetching contractor profile:', error);
          toast.error('Failed to load contractor profile');
          return;
        }

        setContractor(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('An error occurred while loading the profile');
      } finally {
        setLoading(false);
      }
    };

    fetchContractorProfile();
  }, [profileId]);

  const handleGetQuote = () => {
    // Redirect to customer-facing booking page for contractors too
    navigate(`/book/${profileId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!contractor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Contractor Not Found</h2>
          <p className="text-gray-600 mb-4">The contractor profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/professionals')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Professionals
          </Button>
        </Card>
      </div>
    );
  }

  const businessProfile = contractor.business_profiles?.[0];
  const displayName = businessProfile?.business_name || contractor.business_name || contractor.company_name || contractor.full_name;
  const rating = contractor.average_rating || 0;
  const reviewCount = contractor.total_ratings || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/professionals')} 
            variant="outline" 
            size="sm"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Professionals
          </Button>
        </div>

        {/* Main Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6 mb-6">
              <div className="relative">
                <img
                  src={contractor.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${contractor.id}`}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
                  {contractor.account_status === 'active' && (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>
                
                {/* Show owner name for contractors if business name is displayed */}
                {(businessProfile?.business_name || contractor.business_name || contractor.company_name) && contractor.full_name && (
                  <p className="text-gray-600 mb-2">Owner: {contractor.full_name}</p>
                )}
                
                <div className="flex items-center space-x-1 mb-3">
                  <Building className="w-4 h-4 text-blue-600" />
                  <Badge variant="outline" className="text-sm">
                    Licensed Contractor
                  </Badge>
                </div>

                <div className="flex items-center space-x-1 mb-4">
                  {rating > 0 ? (
                    <>
                      {renderStars(rating)}
                      <span className="text-lg font-medium text-gray-700 ml-2">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">
                        ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">No reviews yet</span>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  {businessProfile?.years_in_business && (
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{businessProfile.years_in_business} years in business</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{contractor.jobs_this_month || 0}</span>
                    <span>projects completed</span>
                  </div>
                </div>

                <Button onClick={handleGetQuote} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Get Free Quote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        {businessProfile && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              {businessProfile.description && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-gray-700">{businessProfile.description}</p>
                </div>
              )}

              {businessProfile.services_offered && businessProfile.services_offered.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {businessProfile.services_offered.map((service, index) => (
                      <Badge key={index} variant="secondary">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businessProfile.contact_phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span>{businessProfile.contact_phone}</span>
                  </div>
                )}
                {businessProfile.contact_email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <span>{businessProfile.contact_email}</span>
                  </div>
                )}
                {businessProfile.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <a 
                      href={businessProfile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {businessProfile.website}
                    </a>
                  </div>
                )}
                {businessProfile.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span>{businessProfile.address}</span>
                  </div>
                )}
              </div>

              {(businessProfile.insurance_verified || businessProfile.license_number) && (
                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold mb-2">Credentials</h3>
                  <div className="flex flex-wrap gap-2">
                    {businessProfile.insurance_verified && (
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        ✓ Insured
                      </Badge>
                    )}
                    {businessProfile.license_number && (
                      <Badge variant="outline" className="text-blue-700 border-blue-300">
                        License: {businessProfile.license_number}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};