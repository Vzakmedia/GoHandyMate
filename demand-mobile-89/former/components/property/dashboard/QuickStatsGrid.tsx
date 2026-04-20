
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Building, Home, AlertTriangle, DollarSign } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

interface DashboardStats {
  totalProperties: number;
  totalUnits: number;
  activeJobs: number;
  urgentJobs: number;
  monthlyBudget: number;
  occupancyRate: number;
  propertiesGrowth: number;
}

export const QuickStatsGrid = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalUnits: 0,
    activeJobs: 0,
    urgentJobs: 0,
    monthlyBudget: 0,
    occupancyRate: 0,
    propertiesGrowth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        // Fetch units data
        const { data: unitsData } = await supabase
          .from('units')
          .select('*')
          .eq('manager_id', user.id);

        // Fetch job requests data
        const { data: jobsData } = await supabase
          .from('job_requests')
          .select('*')
          .eq('manager_id', user.id);

        // Calculate unique properties
        const uniqueProperties = [...new Set(unitsData?.map(unit => unit.property_id) || [])];
        
        // Calculate active jobs (not completed)
        const activeJobs = jobsData?.filter(job => 
          job.status !== 'completed' && job.status !== 'cancelled'
        ) || [];

        // Calculate urgent jobs (high priority)
        const urgentJobs = jobsData?.filter(job => 
          job.priority === 'urgent' || job.priority === 'high'
        ) || [];

        // Calculate occupancy rate
        const occupiedUnits = unitsData?.filter(unit => unit.status === 'occupied') || [];
        const occupancyRate = unitsData?.length ? 
          Math.round((occupiedUnits.length / unitsData.length) * 100) : 0;

        // Calculate monthly budget (sum of pending job budgets)
        const monthlyBudget = jobsData?.reduce((sum, job) => 
          sum + (job.budget || 0), 0) || 0;

        // Calculate growth (this month vs last month units)
        const thisMonth = new Date();
        thisMonth.setDate(1); // First day of current month
        const lastMonth = new Date(thisMonth);
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const thisMonthUnits = unitsData?.filter(unit => 
          new Date(unit.created_at) >= thisMonth
        ) || [];

        setStats({
          totalProperties: uniqueProperties.length,
          totalUnits: unitsData?.length || 0,
          activeJobs: activeJobs.length,
          urgentJobs: urgentJobs.length,
          monthlyBudget: monthlyBudget,
          occupancyRate: occupancyRate,
          propertiesGrowth: thisMonthUnits.length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Set up real-time subscriptions
    const unitsSubscription = supabase
      .channel('units-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'units', filter: `manager_id=eq.${user.id}` },
        () => fetchStats()
      )
      .subscribe();

    const jobsSubscription = supabase
      .channel('jobs-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'job_requests', filter: `manager_id=eq.${user.id}` },
        () => fetchStats()
      )
      .subscribe();

    return () => {
      unitsSubscription.unsubscribe();
      jobsSubscription.unsubscribe();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Properties</p>
              <p className="text-3xl font-bold text-blue-700">{stats.totalProperties}</p>
            </div>
            <Building className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-xs text-blue-600 mt-2">
            {stats.propertiesGrowth > 0 ? `+${stats.propertiesGrowth} this month` : 'No growth this month'}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total Units</p>
              <p className="text-3xl font-bold text-green-700">{stats.totalUnits}</p>
            </div>
            <Home className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs text-green-600 mt-2">{stats.occupancyRate}% occupied</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Active Jobs</p>
              <p className="text-3xl font-bold text-orange-700">{stats.activeJobs}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-xs text-orange-600 mt-2">
            {stats.urgentJobs} urgent
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Budget</p>
              <p className="text-3xl font-bold text-purple-700">
                ${(stats.monthlyBudget / 1000).toFixed(1)}K
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xs text-purple-600 mt-2">Pending jobs budget</p>
        </CardContent>
      </Card>
    </div>
  );
};
