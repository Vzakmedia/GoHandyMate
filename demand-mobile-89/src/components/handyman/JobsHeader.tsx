import { Badge } from "@/components/ui/badge";
import { RefreshCw, Activity, Briefcase, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobsHeaderProps {
  lastRefresh: Date;
  activeJobsCount: number;
  onRefresh: () => void;
  loading: boolean;
}

export const JobsHeader = ({ lastRefresh, activeJobsCount, onRefresh, loading }: JobsHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between pb-6 animate-fade-in text-center sm:text-left">
      <div className="space-y-2">
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <div className="w-12 h-12 rounded-2xl bg-[#166534] flex items-center justify-center transition-transform">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Job Management
          </h2>
        </div>
        <p className="text-[13px] font-medium text-slate-500 max-w-xl leading-relaxed">
          Monitor your active requests, track in-progress assignments, and manage your professional work pipeline in real-time.
        </p>
        <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#166534] bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <Activity className="w-3 h-3" />
            Active Pipeline: {activeJobsCount} Jobs
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-black/5">
            <Clock className="w-3 h-3 text-slate-300" />
            Refreshed: {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center sm:justify-end gap-3">
        <button 
          onClick={onRefresh} 
          disabled={loading}
          className="group flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#166534]/90 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180", loading && "animate-spin")} />
          Sync Pipeline
        </button>
      </div>
    </div>
  );
};
