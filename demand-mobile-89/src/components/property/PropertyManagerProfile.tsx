
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { AddUnitModal } from './AddUnitModal';
import { PostJobModal } from './PostJobModal';
import { EditProfileModal } from './EditProfileModal';
import { ProfileHeader } from './profile/ProfileHeader';
import { StatsOverview } from './profile/StatsOverview';
import { RecentUnitsSection } from './profile/RecentUnitsSection';
import { JobOverviewCard } from './profile/JobOverviewCard';
import { QuickActionsCard } from './profile/QuickActionsCard';
import { LocationCoverageCard } from './profile/LocationCoverageCard';
import { UnifiedNotificationSettings } from '@/components/notifications/UnifiedNotificationSettings';

interface Unit {
  id: string;
  unit_number: string;
  unit_name?: string;
  property_address: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  created_at: string;
}

interface JobStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
}

interface ProfileStats {
  totalUnits: number;
  totalJobs: number;
  joinedDate: string;
  locations: string[];
}

export const PropertyManagerProfile = () => {
  const { user, profile } = useAuth();
  const [units, setUnits] = useState<Unit[]>([]);
  const [jobStats, setJobStats] = useState<JobStats>({ total: 0, pending: 0, in_progress: 0, completed: 0 });
  const [profileStats, setProfileStats] = useState<ProfileStats>({ totalUnits: 0, totalJobs: 0, joinedDate: '', locations: [] });
  const [loading, setLoading] = useState(true);
  const [showAddUnitModal, setShowAddUnitModal] = useState(false);
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch recent units
      const { data: unitsData } = await supabase
        .from('units')
        .select('*')
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch job statistics
      const { data: jobsData } = await supabase
        .from('job_requests')
        .select('status')
        .eq('manager_id', user.id);

      // Fetch all units for stats
      const { data: allUnitsData } = await supabase
        .from('units')
        .select('property_address')
        .eq('manager_id', user.id);

      // Type cast units data to match the expected interface
      const typedUnits: Unit[] = (unitsData || []).map(unit => ({
        ...unit,
        status: unit.status as 'vacant' | 'occupied' | 'maintenance'
      }));

      setUnits(typedUnits);

      // Calculate job stats
      const stats = {
        total: jobsData?.length || 0,
        pending: jobsData?.filter(job => job.status === 'pending').length || 0,
        in_progress: jobsData?.filter(job => job.status === 'in_progress').length || 0,
        completed: jobsData?.filter(job => job.status === 'completed').length || 0,
      };
      setJobStats(stats);

      // Calculate profile stats
      const uniqueLocations = [...new Set(allUnitsData?.map(unit => 
        unit.property_address.split(',').slice(-2).join(',').trim()
      ) || [])];

      setProfileStats({
        totalUnits: allUnitsData?.length || 0,
        totalJobs: jobsData?.length || 0,
        joinedDate: profile?.created_at || '',
        locations: uniqueLocations
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, profile]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <ProfileHeader 
        profile={profile}
        profileStats={profileStats}
        onEditProfile={() => setShowEditProfileModal(true)}
      />

      <StatsOverview 
        profileStats={profileStats} 
        jobStats={jobStats} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentUnitsSection 
            units={units} 
            onAddUnit={() => setShowAddUnitModal(true)} 
          />
        </div>

        <div className="space-y-6">
          <JobOverviewCard jobStats={jobStats} />
          <QuickActionsCard 
            onAddUnit={() => setShowAddUnitModal(true)}
            onPostJob={() => setShowPostJobModal(true)}
          />
          <LocationCoverageCard locations={profileStats.locations} />
          <UnifiedNotificationSettings />
        </div>
      </div>

      {/* Modals */}
      <AddUnitModal
        isOpen={showAddUnitModal}
        onClose={() => setShowAddUnitModal(false)}
        onUnitAdded={fetchData}
      />

      <PostJobModal
        open={showPostJobModal}
        onOpenChange={setShowPostJobModal}
        units={units}
        onJobPosted={fetchData}
      />

      <EditProfileModal
        open={showEditProfileModal}
        onOpenChange={setShowEditProfileModal}
        profile={profile}
        onProfileUpdated={fetchData}
      />
    </div>
  );
};
