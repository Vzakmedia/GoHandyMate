
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  profileName?: string;
  isSubscribed: boolean;
  subscriptionPlan?: string;
}

export const DashboardHeader = ({
  profileName,
  isSubscribed,
  subscriptionPlan
}: DashboardHeaderProps) => {
  const firstName = profileName?.split(' ')[0] || 'Professional';

    return (
        <div className="flex flex-col space-y-6 md:flex-row md:justify-between md:items-end md:space-y-0 relative z-10 pt-8 pb-4 animate-fade-in outline-none">
            <div className="min-w-0 pr-4 sm:pr-0 space-y-2">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">
                        Handyman Dashboard
                    </h1>
                    <div className="h-8 w-px bg-black/5 hidden sm:block"></div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-black/5">
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live system</span>
                    </div>
                </div>
                <p className="text-[15px] font-medium text-slate-500 leading-relaxed max-w-2xl">
                    Welcome back, <span className="text-slate-900 font-bold">{firstName}</span>. Manage your business settings and see your performance.
                </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                {!isSubscribed ? (
                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-rose-50 border border-rose-100 group cursor-pointer hover:bg-rose-100 transition-colors">
                        <AlertCircle className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Action required</span>
                            <span className="text-[11px] font-bold text-rose-900 leading-tight">Authorize subscription</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-black/5 transition-all duration-500 group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform duration-500">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex flex-col pr-2">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Identity verified</span>
                                <Sparkles className="w-3 h-3 text-emerald-400" />
                            </div>
                            <span className="text-[12px] font-black text-slate-900 tracking-tight uppercase">
                                {subscriptionPlan || 'Premium'} enabled
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
