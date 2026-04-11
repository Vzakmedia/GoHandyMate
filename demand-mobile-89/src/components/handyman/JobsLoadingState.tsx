
import { Briefcase, Loader2, RefreshCw } from "lucide-react";

export const JobsLoadingState = () => {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 flex flex-col items-center justify-center p-20 text-center min-h-[480px] animate-pulse">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl" />
        <div className="relative w-24 h-24 rounded-[32px] bg-slate-50 border border-black/5 flex items-center justify-center">
          <div className="relative">
            <Briefcase className="w-10 h-10 text-[#166534]/40" strokeWidth={1.5} />
            <Loader2 className="absolute -top-2 -right-2 w-6 h-6 text-[#166534] animate-spin" />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3 justify-center mb-2">
          <div className="w-2 h-2 rounded-full bg-[#166534] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-[#166534] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-[#166534] animate-bounce" />
        </div>
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#166534]">
          Syncing Work Pipeline
        </h3>
        <p className="text-[13px] text-slate-400 font-medium tracking-tight">
          Calibrating active job requests...
        </p>
      </div>
    </div>
  );
};
