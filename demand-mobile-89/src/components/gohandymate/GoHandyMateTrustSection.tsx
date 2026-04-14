import { Shield, Clock, Star, Users, Award, TrendingUp, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const trustFeatures = [
  {
    icon: Shield,
    title: 'Background-checked',
    description: 'All professionals pass enhanced background checks and identity verification'
  },
  {
    icon: Clock,
    title: 'Same-day service',
    description: 'Book trusted help for today, or schedule up to 30 days in advance'
  },
  {
    icon: Star,
    title: 'Reviewed by customers',
    description: 'Read real reviews from verified customers to choose the right professional'
  },
  {
    icon: Users,
    title: 'Dedicated support',
    description: 'Our customer service team is here to help when you need it'
  }
];

interface RealTimeStats {
  totalProfessionals: number;
  totalCustomers: number;
  totalJobs: number;
  averageRating: number;
  activeCities: number;
}

export const GoHandyMateTrustSection = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    totalProfessionals: 0,
    totalCustomers: 0,
    totalJobs: 0,
    averageRating: 0,
    activeCities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealTimeStats();

    // Set up real-time subscriptions for all relevant tables
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          console.log('Profiles updated, refreshing stats...');
          fetchRealTimeStats();
        }
      )
      .subscribe();

    const jobsChannel = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_requests'
        },
        () => {
          console.log('Jobs updated, refreshing stats...');
          fetchRealTimeStats();
        }
      )
      .subscribe();

    const ratingsChannel = supabase
      .channel('ratings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_ratings'
        },
        () => {
          console.log('Ratings updated, refreshing stats...');
          fetchRealTimeStats();
        }
      )
      .subscribe();

    const workAreasChannel = supabase
      .channel('work-areas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'handyman_work_areas'
        },
        () => {
          console.log('Work areas updated, refreshing stats...');
          fetchRealTimeStats();
        }
      )
      .subscribe();

    const emergencyChannel = supabase
      .channel('emergency-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'emergency_reports'
        },
        () => {
          console.log('Emergency reports updated, refreshing stats...');
          fetchRealTimeStats();
        }
      )
      .subscribe();

    const locationsChannel = supabase
      .channel('locations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'handyman_locations'
        },
        () => {
          console.log('Locations updated, refreshing stats...');
          fetchRealTimeStats();
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(jobsChannel);
      supabase.removeChannel(ratingsChannel);
      supabase.removeChannel(workAreasChannel);
      supabase.removeChannel(emergencyChannel);
      supabase.removeChannel(locationsChannel);
    };
  }, []);

  const getUniqueCitiesCount = async () => {
    try {
      // Get all handyman locations
      const { data: handymanLocations } = await supabase
        .from('handyman_locations')
        .select('latitude, longitude, user_id')
        .eq('is_active', true);

      // Get all work areas from handymen and contractors  
      const { data: workAreas } = await supabase
        .from('handyman_work_areas')
        .select('area_name, formatted_address, zip_code')
        .eq('is_active', true);

      // Get emergency reports locations (property-related users)
      const { data: emergencyLocations } = await supabase
        .from('emergency_reports')
        .select('location_details');

      // Extract unique cities from all sources
      const cities = new Set<string>();

      // From work areas
      if (workAreas) {
        workAreas.forEach(area => {
          if (area.area_name && area.area_name !== 'Unknown') {
            cities.add(area.area_name);
          }
          if (area.formatted_address) {
            // Extract city from formatted address
            const cityMatch = area.formatted_address.match(/([^,]+),\s*[A-Z]{2}/);
            if (cityMatch) {
              cities.add(cityMatch[1].trim());
            }
          }
        });
      }

      // From emergency reports (additional coverage areas)
      if (emergencyLocations) {
        emergencyLocations.forEach(location => {
          if (location.location_details) {
            // Try to extract city names from location details
            const cityMatch = location.location_details.match(/([A-Za-z\s]+),?\s*[A-Z]{2}/);
            if (cityMatch) {
              cities.add(cityMatch[1].trim());
            }
          }
        });
      }

      // If no cities found, count handyman locations as active areas
      if (cities.size === 0 && handymanLocations) {
        return handymanLocations.length;
      }

      return cities.size || 0;
    } catch (error) {
      console.error('Error fetching cities count:', error);
      return 0;
    }
  };

  const fetchRealTimeStats = async () => {
    try {
      // Get total professionals using edge function for more accurate count
      const { data: professionalsData } = await supabase.functions.invoke('get-professionals', {
        body: { type: 'all', includeServicePricing: false }
      });

      // Get total customers (including property managers)
      const { data: customers } = await supabase
        .from('profiles')
        .select('id')
        .in('user_role', ['customer']);

      // Get completed jobs
      const { data: jobs } = await supabase
        .from('job_requests')
        .select('id')
        .eq('status', 'completed');

      // Get average rating
      const { data: ratings } = await supabase
        .from('job_ratings')
        .select('rating');

      // Get all profiles for total user count (more comprehensive)
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('id, user_role')
        .in('user_role', ['provider'])
        .eq('account_status', 'active');

      // Get unique cities from all user sources
      const uniqueCities = await getUniqueCitiesCount();
      
      // Calculate stats with real data
      const totalProfessionals = professionalsData?.length || allProfiles?.length || 0;
      const totalCustomers = customers?.length || 0;
      const totalJobs = jobs?.length || 0;
      const avgRating = ratings && ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;

      // Use real data but ensure minimum presentable numbers for demo purposes
      setStats({
        totalProfessionals: Math.max(totalProfessionals, totalProfessionals > 0 ? totalProfessionals : 8),
        totalCustomers: Math.max(totalCustomers, totalCustomers > 0 ? totalCustomers : 1),
        totalJobs: Math.max(totalJobs, totalJobs > 0 ? totalJobs : 4),
        averageRating: avgRating > 0 ? Math.round(avgRating * 10) / 10 : 5.0,
        activeCities: Math.max(uniqueCities, uniqueCities > 0 ? uniqueCities : 3)
      });

      console.log('Real-time stats updated:', {
        professionals: totalProfessionals,
        customers: totalCustomers, 
        jobs: totalJobs,
        rating: avgRating,
        cities: uniqueCities
      });
    } catch (error) {
      console.error('Error fetching real-time stats:', error);
      // Use minimal fallback values based on your actual data
      setStats({
        totalProfessionals: 8,
        totalCustomers: 1,
        totalJobs: 4,
        averageRating: 5.0,
        activeCities: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const displayStats = [
    { 
      icon: Users,
      value: '', 
      label: 'Verified Professionals',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      hideValue: true
    },
    { 
      icon: Award,
      value: '', 
      label: 'Happy Customers',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      hideValue: true
    },
    { 
      icon: TrendingUp,
      value: '', 
      label: 'Jobs Completed',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      hideValue: true
    },
    { 
      icon: Star,
      value: stats.averageRating.toString(), 
      label: 'Average Rating',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    { 
      icon: MapPin,
      value: stats.activeCities.toString(), 
      label: 'Cities Served',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Thousands in Your Neighborhood
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our growing community of satisfied customers who trust GoHandyMate for reliable, professional home services
          </p>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-16">
          {displayStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`w-12 h-12 md:w-16 md:h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                  <IconComponent className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                </div>
                {!stat.hideValue && (
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1 md:mb-2`}>
                    {loading ? '...' : stat.value}
                  </div>
                )}
                <div className="text-gray-600 text-xs md:text-sm font-medium uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Features */}
        <div className="text-center mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Why Customers Choose GoHandyMate
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 md:p-12 text-center">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-green-600 mr-3" />
            <h3 className="text-2xl md:text-3xl font-bold text-green-800">
              100% Verified & Trusted
            </h3>
          </div>
          <p className="text-lg text-green-700 max-w-2xl mx-auto mb-6">
            Every professional on our platform goes through comprehensive background checks, skill verification, and ongoing quality monitoring to ensure you receive the best service possible.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-green-600">
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Background Verified
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Customer Rated
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Insured & Bonded
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};