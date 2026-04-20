
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Activity } from "lucide-react";
import { useContractorMetrics } from "@/hooks/useContractorMetrics";
import { cn } from "@/lib/utils";

interface DashboardOverviewProps {
  stats: {
    avgProjectValue: number;
  };
}

export const DashboardOverview = ({ stats }: DashboardOverviewProps) => {
  const { metrics } = useContractorMetrics();

  const currentMonthRevenue = metrics.monthlyRevenue || 0;
  const lastMonthRevenue = Math.round(currentMonthRevenue * 0.8); // Estimate based on current
  const monthlyGoal = Math.round(currentMonthRevenue * 1.33); // Goal is 33% higher than current
  const goalProgress = monthlyGoal > 0 ? Math.min((currentMonthRevenue / monthlyGoal) * 100, 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue Performance Card */}
      <Card className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#166534]/5 text-[#166534] border border-[#166534]/10">
              <BarChart3 className="h-5 w-5" />
            </div>
            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Revenue Dynamics</span>
          </CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-11">
            System performance & growth indexing
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <div className="space-y-6">
            <div className="flex justify-between items-center group/item hover:bg-slate-50 p-2 rounded-xl transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Period</span>
              <span className="text-base font-black text-slate-900 tracking-tight">${currentMonthRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center group/item hover:bg-slate-50 p-2 rounded-xl transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historical Baseline</span>
              <span className="text-base font-black text-slate-500 tracking-tight">${lastMonthRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center group/item hover:bg-slate-50 p-2 rounded-xl transition-colors">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Average</span>
              <span className="text-base font-black text-slate-900 tracking-tight">${stats.avgProjectValue.toLocaleString()}</span>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Goal Saturation</span>
                <span className="text-[9px] font-black text-[#166534] uppercase tracking-widest">{Math.round(goalProgress)}% complete</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <p className="text-[9px] font-medium text-slate-500 text-center uppercase tracking-widest opacity-60 italic">
                {monthlyGoal.toLocaleString()} Total System Target
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Territorial Activity Card */}
      <Card className="bg-white rounded-[2.5rem] border border-black/5 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
        <CardHeader className="p-8 pb-4">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-900 text-white border border-black/10">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">System Feed</span>
          </CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-11">
            Real-time project telemetry
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <div className="space-y-6">
            {metrics.recentActivity && metrics.recentActivity.length > 0 ? (
              metrics.recentActivity.slice(0, 3).map((activity, index) => (
                <div key={index} className="flex items-center gap-5 p-3 rounded-2xl hover:bg-slate-50 transition-all duration-300 group/item border border-transparent hover:border-black/5">
                  <div className="relative">
                    <div className={cn("w-3 h-3 rounded-full shadow-sm animate-pulse",
                      activity.type === 'completed' ? 'bg-emerald-500 shadow-emerald-500/20' :
                        activity.type === 'accepted' ? 'bg-blue-500 shadow-blue-500/20' : 'bg-[#fbbf24] shadow-amber-500/20'
                    )} />
                    <div className={cn("absolute inset-0 rounded-full opacity-30 animate-ping",
                      activity.type === 'completed' ? 'bg-emerald-500' :
                        activity.type === 'accepted' ? 'bg-blue-500' : 'bg-[#fbbf24]'
                    )} />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">{activity.title}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.description}</p>
                  </div>
                  <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover/item:text-slate-500 transition-colors">
                    Detecting...
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-black/5 opacity-50">
                  <Activity className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting system telemetry</p>
              </div>
            )}
          </div>

          <button className="w-full mt-6 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all duration-300 border border-black/5">
            Access Full Archive
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
