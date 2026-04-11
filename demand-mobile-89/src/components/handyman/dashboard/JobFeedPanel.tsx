import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, CheckCircle2, Clock, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobFeedPanelProps {
    status: 'active' | 'inactive';
    onAddService: () => void;
    metrics: {
        inProgress: number;
        assigned: number;
        completed: number;
    };
}

export const JobFeedPanel = ({ status, onAddService, metrics }: JobFeedPanelProps) => {
    return (
        <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 flex flex-col overflow-hidden h-full transition-all duration-500 animate-fade-in outline-none group/panel">
            <div className="p-8 sm:p-10 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-4 h-4 rounded-full animate-pulse relative",
                      status === 'active' ? "bg-emerald-500" : "bg-slate-300"
                    )}>
                        {status === 'active' && (
                            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-25"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">Operational pipeline</h3>
                        <p className="text-[12px] font-medium text-slate-500 leading-relaxed">live stream of active assignments and incoming requests.</p>
                    </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500",
                  status === 'active' 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-slate-50 text-slate-400 border-slate-100"
                )}>
                    {status === 'active' ? 'Broadcast live' : 'Offline mode'}
                </div>
            </div>

            <div className="flex-1 px-8 sm:px-10 pb-4 mt-4">
                <div className="bg-slate-50/50 border border-black/5 rounded-[40px] p-10 text-center flex flex-col items-center justify-center gap-8 h-full relative overflow-hidden group/empty">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Zap className="w-32 h-32 text-slate-900" />
                    </div>
                    
                    <div className="w-20 h-20 rounded-[32px] bg-white border border-black/5 flex items-center justify-center group-hover/empty:scale-110 transition-transform duration-700 relative z-10">
                        <Briefcase className="w-10 h-10 text-slate-200" />
                    </div>
                    
                    <div className="space-y-2 relative z-10">
                        <p className="text-lg font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">No active work stream</p>
                        <p className="text-[14px] font-medium text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                            once your services are published, real-time job assignments will automatically populate this dynamic feed.
                        </p>
                    </div>
                    
                    <button
                        onClick={onAddService}
                        className="relative z-10 flex items-center gap-3 px-10 py-4 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#166534]/90 hover:-translate-y-1 active:scale-95 transition-all duration-500"
                    >
                        <Plus className="w-4 h-4" />
                        Initialize Service
                    </button>
                    
                    {status === 'inactive' && (
                        <div className="mt-2 flex items-center justify-center gap-2 opacity-50 relative z-10">
                            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verify identity to begin</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 sm:p-10 pt-4">
                <div className="grid grid-cols-3 bg-white border border-black/5 rounded-[32px] overflow-hidden">
                    <div className="flex flex-col items-center gap-2.5 p-6 transition-all duration-500 hover:bg-amber-50 group cursor-default">
                        <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-slate-400 group-hover:text-amber-500 transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-amber-600 transition-colors">In-flight</span>
                        </div>
                        <span className="text-3xl font-black text-slate-900 group-hover:text-amber-600 tracking-tighter transition-all">{metrics.inProgress}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2.5 p-6 border-x border-black/5 transition-all duration-500 hover:bg-blue-50 group cursor-default">
                        <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">Allocated</span>
                        </div>
                        <span className="text-3xl font-black text-slate-900 group-hover:text-blue-600 tracking-tighter transition-all">{metrics.assigned}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2.5 p-6 transition-all duration-500 hover:bg-emerald-50 group cursor-default">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-emerald-600 transition-colors">Delivered</span>
                        </div>
                        <span className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 tracking-tighter transition-all">{metrics.completed}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
