import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useHandymanData } from "@/hooks/useHandymanData";
import { useAuth } from '@/features/auth';
import { useUnifiedHandymanMetrics } from "@/hooks/useUnifiedHandymanMetrics";
import { LiveMetricsSection } from "../overview/LiveMetricsSection";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Loader2,
  Wrench,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BaseDashboardOverviewProps {
  variant?: 'simple' | 'detailed';
  showLiveMetrics?: boolean;
  additionalCards?: React.ReactNode[];
}

export const BaseDashboardOverview = ({
  variant = 'simple',
  showLiveMetrics = false,
  additionalCards = []
}: BaseDashboardOverviewProps) => {
  const { user } = useAuth();
  const { data: handymanData, loading: handymanLoading } = useHandymanData();
  const { metrics, loading: metricsLoading } = useUnifiedHandymanMetrics();

  const loading = handymanLoading || (showLiveMetrics ? metricsLoading : false);

  // Calculate real metrics from handyman data
  const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
  const averageRate = activeSkills.length > 0
    ? activeSkills.reduce((sum, skill) => sum + (Number(skill.hourly_rate) || 0), 0) / activeSkills.length
    : 0;
  const activeServices = handymanData.servicePricing?.filter(service => service.is_active) || [];
  const workAreas = handymanData.workAreas || [];

  // Calculate earning potentials
  const weeklyPotential = Math.round(averageRate * 20); // 20 hours per week
  const monthlyPotential = Math.round(averageRate * 80); // 80 hours per month
  const progressPercentage = monthlyPotential > 0 ? (weeklyPotential * 4 / monthlyPotential) * 100 : 0;

  if (loading) {
    const loadingContent = variant === 'detailed' ? (
      <div className="space-y-6">
        <div className="animate-pulse bg-muted rounded-lg h-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );

    return loadingContent;
  }

  // Live metrics for detailed variant
  if (variant === 'detailed' && showLiveMetrics) {
    // Use today's earnings from unified metrics
    const actualTodayEarnings = metrics.todayEarnings;

    const totalActiveServices = Math.max(activeSkills.length, activeServices.length);

    const liveMetrics = {
      todayEarnings: actualTodayEarnings,
      monthlyEarnings: metrics.monthlyEarnings,
      activeSkills: totalActiveServices,
      activeJobs: metrics.totalActiveJobs,
      completedJobs: metrics.totalCompletedJobs,
      thisMonthCompleted: metrics.thisMonthCompletedJobs,
      totalEarnings: metrics.totalEarnings
    };

    return (
      <div className="space-y-6">
        <LiveMetricsSection
          liveMetrics={liveMetrics}
          todayCompletedJobs={metrics.todayCompletedJobs}
        />
        {additionalCards.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {additionalCards}
          </div>
        )}
      </div>
    );
  }

  // Simple variant
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="rounded-[2.5rem] border border-black/5 bg-white overflow-hidden group transition-all duration-500">
        <CardHeader className="bg-slate-50/50 border-b border-black/5 p-8">
          <CardTitle className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#166534]/5 flex items-center justify-center text-[#166534]">
              <BarChart3 className="h-4 w-4" />
            </div>
            Earnings Potential
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-black/5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Weekly Target</span>
                <span className="text-xl font-black text-slate-900">${weeklyPotential.toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#166534]/5 border border-[#166534]/10">
                <span className="text-[10px] font-bold text-[#166534]/60 uppercase tracking-widest block mb-1">Avg Hourly</span>
                <span className="text-xl font-black text-[#166534]">${averageRate.toFixed(0)}/hr</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Monthly Quota</span>
                <span className="text-xs font-black text-[#166534]">${monthlyPotential.toLocaleString()}</span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-2.5 bg-slate-100" />
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] pt-1 text-center">
                System utilized based on {activeSkills.length} active service tokens
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2.5rem] border border-black/5 bg-white overflow-hidden group transition-all duration-500">
        <CardHeader className="bg-slate-50/50 border-b border-black/5 p-8">
          <CardTitle className="flex items-center gap-3 text-sm font-black text-slate-900 uppercase tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-[#fbbf24]/10 flex items-center justify-center text-[#fbbf24]">
              <TrendingUp className="h-4 w-4" />
            </div>
            Identity & Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                activeSkills.length > 0 ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-300"
              )}>
                <Wrench className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Skills Verification</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  {activeSkills.length > 0 ? `${activeSkills.length} Active tokens deployed` : 'Profile initialization pending'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                activeServices.length > 0 ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-300"
              )}>
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Service Availability</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  {activeServices.length > 0 ? `${activeServices.length} Active corridors active` : 'Logic calibration missing'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                workAreas.length > 0 ? "bg-purple-50 text-purple-600" : "bg-slate-50 text-slate-300"
              )}>
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">Territory Coverage</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  {workAreas.length > 0 ? `${workAreas.length} Jurisdiction zones mapped` : 'Locality signals not detected'}
                </p>
              </div>
            </div>

            {activeSkills.length === 0 && activeServices.length === 0 && (
              <div className="mt-4 p-4 bg-amber-50/50 border border-amber-100 rounded-2xl">
                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-tight">
                  <span className="block mb-1 opacity-60">System Notification:</span>
                  Deploy skills and pricing models to initiate job feeds
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {additionalCards.length > 0 && additionalCards}
    </div>
  );
};