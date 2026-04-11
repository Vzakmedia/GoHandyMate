
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MapPin, Phone, Mail, Calendar, ArrowLeft, MessageCircle, Heart, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  user_role: 'handyman' | 'contractor';
  account_status: string;
  city?: string;
  address?: string;
  created_at: string;
}

const ProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Profile not found");

      const profileData: ProfileData = {
        ...data,
        user_role: data.user_role as 'handyman' | 'contractor',
        account_status: data.account_status || 'pending'
      };

      setProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
            {/* Mobile Layout */}
            <div className="block sm:hidden">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback className="text-lg">
                    {profile.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight truncate">{profile.full_name}</CardTitle>
                  <div className="flex flex-wrap items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {profile.user_role}
                    </Badge>
                    <Badge 
                      className={`text-xs ${
                        profile.account_status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                      }`}
                    >
                      {profile.account_status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Mobile Rating & Actions */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < 4 ? 'text-amber-400 fill-current' : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    4.0 (No reviews)
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">
                    <Heart className="w-3.5 h-3.5 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" className="flex-1 text-xs">
                    <MessageCircle className="w-3.5 h-3.5 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback className="text-xl">
                    {profile.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {profile.user_role}
                    </Badge>
                    <Badge 
                      className={
                        profile.account_status === 'active' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
                      }
                    >
                      {profile.account_status}
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < 4 ? 'text-amber-400 fill-current' : 'text-muted-foreground'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        4.0 (No reviews yet)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-3 sm:px-6 space-y-4 sm:space-y-6">
            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-xs sm:text-sm">Email</p>
                    <p className="text-muted-foreground text-xs sm:text-sm truncate">{profile.email}</p>
                  </div>
                </div>
                
                {profile.phone && (
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-xs sm:text-sm">Phone</p>
                      <p className="text-muted-foreground text-xs sm:text-sm">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-3 sm:my-4" />

            {/* Location */}
            {(profile.city || profile.address) && (
              <>
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground text-xs sm:text-sm">Location</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      {profile.address && `${profile.address}, `}
                      {profile.city}
                    </p>
                  </div>
                </div>
                <Separator className="my-3 sm:my-4" />
              </>
            )}

            {/* Member Since */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground text-xs sm:text-sm">Member Since</p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </div>

            <Separator className="my-3 sm:my-4" />

            {/* Services or Skills Section */}
            <div>
              <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">
                {profile.user_role === 'handyman' ? 'Skills' : 'Services'}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Badge variant="secondary" className="text-xs">Plumbing</Badge>
                <Badge variant="secondary" className="text-xs">Electrical</Badge>
                <Badge variant="secondary" className="text-xs">Carpentry</Badge>
                <Badge variant="secondary" className="text-xs">Painting</Badge>
                <Badge variant="secondary" className="text-xs">General Repairs</Badge>
              </div>
            </div>

            <Separator className="my-3 sm:my-4" />

            {/* Reviews Section */}
            <div>
              <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Recent Reviews</h3>
              <div className="space-y-4">
                <p className="text-muted-foreground text-center py-3 sm:py-4 text-xs sm:text-sm">
                  No reviews yet.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 sm:space-x-3 pt-3 sm:pt-4">
              <Button className="flex-1 text-xs sm:text-sm">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="flex-1 text-xs sm:text-sm">
                Request Quote
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
