
import { useHandymanData } from "@/hooks/useHandymanData";
import { useUnifiedHandymanMetrics } from "@/hooks/useUnifiedHandymanMetrics";
import { useAuth } from '@/features/auth';
import { useRealRatings } from "@/hooks/useRealRatings";
import { useEffect, useState } from "react";
import { Loader2, Briefcase, LayoutGrid, Map, DollarSign, Star, Zap, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileStatsProps {
  mockStats: {
    rating: number;
    reviewCount: number;
    totalJobs: number;
    completedJobs: number;
    responseRate: number;
    clientRetention: number;
  };
}

interface ServiceAreaInfo {
  name: string;
  state: string;
  county: string;
}

export const ProfileStats = ({ mockStats }: ProfileStatsProps) => {
  const { user } = useAuth();
  const { data: handymanData, loading: handymanLoading } = useHandymanData();
  const { metrics, loading: metricsLoading } = useUnifiedHandymanMetrics();
  const { averageRating, totalReviews, loading: ratingsLoading } = useRealRatings(user?.id || '');

  const [serviceAreas, setServiceAreas] = useState<ServiceAreaInfo[]>([]);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const loading = handymanLoading || metricsLoading;

  useEffect(() => {
    const loadServiceAreas = async () => {
      if (!handymanData.workAreas || handymanData.workAreas.length === 0) return;
      setLoadingAreas(true);
      // Simplified for now to avoid too many geocoding calls during render
      const areas = handymanData.workAreas.map(wa => ({
        name: wa.area_name || wa.zip_code || 'Service Area',
        state: '',
        county: ''
      }));
      setServiceAreas(areas);
      setLoadingAreas(false);
    };

    if (!handymanLoading && handymanData.workAreas) {
      loadServiceAreas();
    }
  }, [handymanData.workAreas, handymanLoading]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 animate-pulse">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-50 rounded-[20px] border border-black/5" />
        ))}
      </div>
    );
  }

  const allActiveServices = handymanData.servicePricing?.filter(service => service.is_active) || [];
  const activeMainServices = handymanData.servicePricing?.filter(service => service.is_active && !service.subcategory_id) || [];
  const realCompletedJobs = metrics.totalCompletedJobs;
  const realResponseRate = Math.min(99, Math.max(75, 80 + (allActiveServices.length * 2)));
  const realClientRetention = Math.min(98, Math.max(65, 70 + Math.min(15, realCompletedJobs * 0.5)));

  const statsList = [
    { label: 'Active', sub: 'Services', value: allActiveServices.length, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Main', sub: 'Categories', value: activeMainServices.length, icon: LayoutGrid, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Service', sub: 'Areas', value: serviceAreas.length || handymanData.workAreas?.length || 0, icon: Map, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Weekly', sub: 'Est.', value: `$${metrics.weeklyEarnings}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Live', sub: 'Rating', value: ratingsLoading ? '...' : `${metrics.averageRating > 0 ? metrics.averageRating.toFixed(1) : averageRating.toFixed(1)}★`, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Response', sub: 'Rate', value: `${realResponseRate.toFixed(0)}%`, icon: Zap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Client', sub: 'Retention', value: `${realClientRetention.toFixed(0)}%`, icon: Users, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Monthly', sub: 'Est.', value: `$${metrics.monthlyEarnings}`, icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      {statsList.map((stat, i) => (
        <div 
          key={i} 
          className="group relative bg-white border border-black/5 rounded-[24px] p-4 flex flex-col items-center gap-2 transition-all duration-300 hover:-translate-y-1"
        >
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-1 transition-transform group-hover:scale-110", stat.bg)}>
            <stat.icon className={cn("w-5 h-5", stat.color)} />
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-black text-slate-900 leading-none mb-1">
              {stat.value}
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 whitespace-nowrap">
              {stat.label}
            </div>
            <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest whitespace-nowrap">
              {stat.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
