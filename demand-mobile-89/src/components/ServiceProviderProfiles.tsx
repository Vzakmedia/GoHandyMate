import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { MapPin, Star, Phone, Mail, Clock, Search, Filter } from 'lucide-react';

interface SkillRate {
  id: string;
  user_id: string;
  skill_name: string;
  hourly_rate: number;
  is_active: boolean;
}

interface ServiceProvider {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  user_role: 'handyman';
  subscription_plan?: string;
  account_status: 'pending' | 'active' | 'rejected' | 'suspended';
  avatar_url?: string;
  skill_rates?: SkillRate[];
}

export const ServiceProviderProfiles = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'handyman'>('all');
  const [filterLocation, setFilterLocation] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_role', 'handyman')
        .eq('account_status', 'active');

      if (profilesError) throw profilesError;

      // Fetch skill rates separately for handymen
      const handymenIds = profilesData?.filter(p => p.user_role === 'handyman').map(p => p.id) || [];
      let skillRatesData: SkillRate[] = [];
      
      if (handymenIds.length > 0) {
        const { data: rates, error: ratesError } = await supabase
          .from('handyman_skill_rates')
          .select('*')
          .in('user_id', handymenIds);
        
        if (!ratesError) {
          skillRatesData = (rates as SkillRate[]) || [];
        }
      }

      const mappedProviders: ServiceProvider[] = (profilesData || []).map(profile => ({
        id: profile.id,
        full_name: profile.full_name || 'Unknown',
        email: profile.email,
        phone: profile.phone || undefined,
        address: profile.address || undefined,
        city: profile.city || undefined,
        user_role: 'handyman' as const,
        subscription_plan: profile.subscription_plan || undefined,
        account_status: profile.account_status as 'pending' | 'active' | 'rejected' | 'suspended',
        avatar_url: profile.avatar_url || undefined,
        skill_rates: skillRatesData.filter(rate => rate.user_id === profile.id) || []
      }));

      setProviders(mappedProviders);
    } catch (error) {
      console.error('Error fetching service providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || provider.user_role === filterRole;
    const matchesLocation = !filterLocation || 
                           (provider.city && provider.city.toLowerCase().includes(filterLocation.toLowerCase())) ||
                           (provider.address && provider.address.toLowerCase().includes(filterLocation.toLowerCase()));
    
    return matchesSearch && matchesRole && matchesLocation;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterRole} onValueChange={(value: 'all' | 'handyman') => setFilterRole(value)}>
          <SelectTrigger className="w-full lg:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="handyman">Handymen</SelectItem>
            {/* contractor option removed — contractor role archived */}
          </SelectContent>
        </Select>

        <Input
          placeholder="Filter by location..."
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="w-full lg:w-48"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <Card key={provider.id} className="transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {provider.avatar_url ? (
                    <img
                      src={provider.avatar_url}
                      alt={provider.full_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {provider.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{provider.full_name}</CardTitle>
                    <Badge variant={provider.user_role === 'handyman' ? 'default' : 'secondary'}>
                      {provider.user_role}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">4.8</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {provider.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{provider.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{provider.email}</span>
                </div>
                {(provider.city || provider.address) && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{provider.city || provider.address}</span>
                  </div>
                )}
              </div>

              {provider.skill_rates && provider.skill_rates.length > 0 && (
                <div>
                  <h5 className="font-medium text-sm text-gray-900 mb-2">Skills:</h5>
                  <div className="flex flex-wrap gap-1">
                    {provider.skill_rates.slice(0, 3).map((skill: SkillRate, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill.skill_name}
                      </Badge>
                    ))}
                    {provider.skill_rates.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.skill_rates.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {provider.subscription_plan && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan:</span>
                  <Badge className="capitalize bg-green-100 text-green-800">
                    {provider.subscription_plan}
                  </Badge>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">
                  View Profile
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProviders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or check back later for new providers.
          </p>
        </div>
      )}
    </div>
  );
};
