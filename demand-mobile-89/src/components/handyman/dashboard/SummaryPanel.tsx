import { BarChart3, RefreshCw, Calendar, ArrowRight, TrendingUp, Users, CheckCircle, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryPanelProps {
    metrics: {
        jobsCompleted: number;
        hoursWorked: number;
        newLeads: number;
        revenueGrowth: number;
    };
    activities: Array<{
        id: string;
        title: string;
        time: string;
        type: 'job' | 'update' | 'rating';
    }>;
}

export const SummaryPanel = ({ metrics, activities }: SummaryPanelProps) => {
    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 p-8 sm:p-10 flex flex-col gap-10 h-full transition-all duration-500 animate-fade-in outline-none group/panel">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center group-hover/panel:scale-110 transition-transform duration-500">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">Business stats</h3>
                        <p className="text-[12px] font-medium text-slate-500 leading-relaxed">aggregated insights across your service delivery pipeline.</p>
                    </div>
                </div>
                <button className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-black/5 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 group">
                    <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700" />
                    Sync data
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'New pipeline', value: metrics.newLeads, icon: <TrendingUp className="w-3.5 h-3.5" />, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                  { label: 'Quotes sent', value: 0, icon: <Users className="w-3.5 h-3.5" />, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
                  { label: 'Completed', value: metrics.jobsCompleted, icon: <CheckCircle className="w-3.5 h-3.5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                  { label: 'Satisfaction', value: '98%', icon: <Star className="w-3.5 h-3.5" />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                ].map((stat, i) => (
                  <div key={i} className="group/stat relative overflow-hidden bg-white rounded-[32px] border border-black/5 p-6 flex flex-col gap-3 hover:-translate-y-1 transition-all duration-500">
                      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center border transition-transform duration-500 group-hover/stat:scale-110", stat.bg, stat.color, stat.border)}>
                        {stat.icon}
                      </div>
                      <div className="space-y-0.5">
                        <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{stat.label}</span>
                        <span className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                      </div>
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover/stat:opacity-10 transition-opacity">
                        {stat.icon}
                      </div>
                  </div>
                ))}
            </div>

            <div className="flex-1 bg-slate-50/50 border border-black/5 rounded-[40px] p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Sparkles className="w-32 h-32 text-slate-900" />
                </div>
                
                <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Recent activity</h4>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Syncing...</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-6 py-6 relative z-10">
                    <div className="w-16 h-16 rounded-[24px] bg-white border border-black/5 flex items-center justify-center group-hover/panel:scale-110 transition-transform duration-700">
                      <Calendar className="w-8 h-8 text-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">No active schedule detected</p>
                      <p className="text-[13px] font-medium text-slate-500 max-w-[240px] leading-relaxed mx-auto">
                          incoming bookings and system integrations will automatically populate this realtime feed.
                      </p>
                    </div>
                    <button className="mt-4 px-8 py-3.5 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#166534]/90 transition-all active:scale-95 flex items-center gap-3">
                      Go to Jobs Feed
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
};
