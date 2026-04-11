
import { useUnifiedHandymanMetrics } from "@/hooks/useUnifiedHandymanMetrics";
import { useHandymanData } from "@/hooks/useHandymanData";
import { useAuth } from '@/features/auth';
import { useRealRatings } from "@/hooks/useRealRatings";
import { PerformancePanel } from "./PerformancePanel";
import { SummaryPanel } from "./SummaryPanel";
import { JobFeedPanel } from "./JobFeedPanel";
import { RatingPanel } from "./RatingPanel";
import { Loader2, Sparkles, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export const DashboardOverview = () => {
  const { user } = useAuth();
  const { metrics, loading: metricsLoading } = useUnifiedHandymanMetrics();
  const { data: handymanData, loading: handymanLoading } = useHandymanData();
  const { averageRating, totalReviews, loading: ratingsLoading } = useRealRatings(user?.id || '');

  const loading = metricsLoading || handymanLoading;

  if (loading) {
    return (
      <div className="space-y-10 animate-pulse outline-none">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="h-[480px] bg-white/60 backdrop-blur-xl rounded-[48px] border border-black/5 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#166534] animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing performance...</p>
          </div>
          <div className="h-[480px] bg-white/60 backdrop-blur-xl rounded-[48px] border border-black/5 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#166534] animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Calculating summary...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="h-[480px] bg-white/60 backdrop-blur-xl rounded-[48px] border border-black/5 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#166534] animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading job feed...</p>
          </div>
          <div className="h-[480px] bg-white/60 backdrop-blur-xl rounded-[48px] border border-black/5 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#166534] animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing reputation...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
  const activeServicesCount = activeSkills.length;

  const activities = [
    { id: '1', title: 'New service request', time: '2 hours ago', type: 'job' as const },
    { id: '2', title: 'Service feed initialized', time: 'Yesterday', type: 'update' as const },
  ];

  return (
    <div className="flex flex-col gap-10 animate-fade-in outline-none">
      {/* Dynamic Header Badge */}
      <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/60 backdrop-blur-xl border border-black/5 w-fit group">
        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-emerald-700 transition-colors">Live business operational intelligence</span>
        <Sparkles className="w-3.5 h-3.5 text-emerald-500 ml-1 group-hover:rotate-12 transition-transform" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="h-full">
          <PerformancePanel
            todayEarnings={metrics.todayEarnings}
            activeServices={activeServicesCount}
            todayCompletedJobs={metrics.todayCompletedJobs}
            metrics={{
              completionRate: 98,
              responseTime: 95,
              utilization: 45
            }}
          />
        </div>

        <div className="h-full">
          <SummaryPanel
            metrics={{
              jobsCompleted: metrics.totalCompletedJobs,
              hoursWorked: 32,
              newLeads: metrics.totalActiveJobs,
              revenueGrowth: 12
            }}
            activities={activities}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        <div className="h-full">
          <JobFeedPanel
            status={activeServicesCount > 0 ? 'active' : 'inactive'}
            onAddService={() => { }}
            metrics={{
              inProgress: metrics.totalActiveJobs,
              assigned: 0,
              completed: metrics.totalCompletedJobs
            }}
          />
        </div>

        <div className="h-full">
          <RatingPanel
            averageRating={averageRating}
            totalReviews={totalReviews}
          />
        </div>
      </div>
    </div>
  );
};

