import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Activity, Briefcase, DollarSign, TrendingUp, Zap, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerformancePanelProps {
    todayEarnings: number;
    activeServices: number;
    todayCompletedJobs: number;
    metrics: {
        completionRate: number;
        responseTime: number;
        utilization: number;
    };
}

export const PerformancePanel = ({
    todayEarnings,
    activeServices,
    todayCompletedJobs,
    metrics
}: PerformancePanelProps) => {
    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 p-8 sm:p-10 flex flex-col gap-10 w-full h-full transition-all duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#166534] flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">Performance</h3>
                        <p className="text-[12px] font-medium text-slate-500 leading-relaxed">Track your business performance.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Live feed</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Today's earnings */}
                <div className="group relative bg-[#166534] rounded-[32px] p-6 flex flex-col justify-between overflow-hidden hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                        <DollarSign className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100 opacity-70">Today's Earnings</span>
                            <p className="text-[28px] font-black text-white tracking-tighter mt-1 leading-none">${todayEarnings}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2.5 relative z-10">
                        <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-[10px] font-black text-white">
                            {todayCompletedJobs} JOBS
                        </div>
                        <span className="text-[10px] font-bold text-emerald-100">completed today</span>
                    </div>
                </div>

                {/* Performance index */}
                <div className="group relative bg-slate-900 rounded-[32px] p-6 flex flex-col justify-between overflow-hidden hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                        <TrendingUp className="w-24 h-24 text-white" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly total</span>
                            <p className="text-[28px] font-black text-white tracking-tighter mt-1 leading-none">$0.00</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2.5 relative z-10">
                        <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-[10px] font-black text-slate-300">
                            BASELINE
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">tracking progress</span>
                    </div>
                </div>

                {/* Offering status */}
                <div className="group relative bg-amber-500 rounded-[32px] p-6 flex flex-col justify-between overflow-hidden hover:scale-[1.02] transition-all duration-500">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                        <Briefcase className="w-24 h-24 text-amber-900" />
                    </div>
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-900/70">Live services</span>
                            <p className="text-[28px] font-black text-amber-950 tracking-tighter mt-1 leading-none">{activeServices}</p>
                        </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2.5 relative z-10">
                        <div className="px-3 py-1 rounded-full bg-amber-950/20 backdrop-blur-sm text-[10px] font-black text-amber-950">
                            {activeServices > 0 ? 'ACTIVE' : 'SETUP'}
                        </div>
                        <span className="text-[10px] font-black text-amber-900/80 uppercase tracking-widest">Market reach</span>
                    </div>
                </div>
            </div>

            <div className="space-y-8 flex-1">
                <div className="space-y-3 group">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <Target className="w-4 h-4 text-[#166534]" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Job success rate</span>
                        </div>
                        <span className="text-[14px] font-black text-[#166534]">{metrics.completionRate}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#166534] rounded-full transition-all duration-1000"
                            style={{ width: `${metrics.completionRate}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-3 group">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <Zap className="w-4 h-4 text-emerald-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Response efficiency</span>
                        </div>
                        <span className="text-[14px] font-black text-emerald-600">{metrics.responseTime}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                            style={{ width: `${metrics.responseTime}%` }}
                        />
                    </div>
                </div>

                <div className="space-y-3 group">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                            <TrendingUp className="w-4 h-4 text-amber-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Capacity utilization</span>
                        </div>
                        <span className="text-[14px] font-black text-amber-600">{metrics.utilization}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                            style={{ width: `${metrics.utilization}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
