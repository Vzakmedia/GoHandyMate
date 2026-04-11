import { Briefcase, RefreshCw, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyJobsStateProps {
  onRefresh: () => void;
}

export const EmptyJobsState = ({ onRefresh }: EmptyJobsStateProps) => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 flex flex-col items-center justify-center p-12 text-center min-h-[480px] animate-fade-in">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-24 h-24 rounded-[32px] bg-slate-50 border border-black/5 flex items-center justify-center transition-transform duration-500">
          <Briefcase className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="space-y-3 mb-10">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Pipeline Empty</h3>
        <p className="text-[13px] text-slate-400 font-medium max-w-[320px] mx-auto leading-relaxed">
          Your job queue is currently calibrated for new requests. When customers assign tasks, they'll appear here for real-time management.
        </p>
      </div>

      <button 
        onClick={onRefresh}
        className="group flex items-center gap-3 px-10 py-4 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#166534]/90 transition-all active:scale-95"
      >
        <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
        Sync Pipeline
      </button>
    </div>
  );
};
