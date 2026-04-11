
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSubscriptionCardProps {
  isSubscribed: boolean;
  subscriptionPlan?: string;
  activeSkills: number;
  activeServices: number;
}

export const DashboardSubscriptionCard = ({
  isSubscribed,
  subscriptionPlan,
  activeSkills,
  activeServices
}: DashboardSubscriptionCardProps) => {
  const formatPlanName = (plan: string) => {
    const planNames: { [key: string]: string } = {
      'starter': 'Starter Membership',
      'pro': 'Professional Suite',
      'elite': 'Elite Executive'
    };
    return planNames[plan] || plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
  };

  return (
    <div className="space-y-10 animate-fade-in outline-none">
      {/* Real-time Data Status */}
      {activeSkills === 0 && activeServices === 0 && (
        <div className="group/init bg-white/90 backdrop-blur-xl rounded-[48px] border border-amber-100/50 p-8 sm:p-10 flex flex-col items-start gap-8 transition-all duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover/init:rotate-12 transition-transform duration-1000">
            <Sparkles className="w-32 h-32 text-amber-900" />
          </div>

          <div className="flex items-center gap-6 relative z-10 w-full">
            <div className="w-20 h-20 rounded-[32px] bg-amber-500 flex items-center justify-center group-hover/init:scale-110 transition-transform duration-700">
              <Sparkles className="w-10 h-10 text-white fill-white" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">
                  Initialize professional identity
                </h3>
                <div className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest border border-amber-100">
                  Required
                </div>
              </div>
              <p className="text-[14px] font-medium text-slate-500 leading-relaxed max-w-2xl">
                deploy your unique skills and standardized service pricing to activate live job feeds and business intelligence metrics in your professional hub.
              </p>
            </div>
            <button className="hidden lg:flex items-center gap-3 px-8 py-4 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 hover:-translate-y-1 transition-all duration-500 active:scale-95 group/btn">
              Configure now
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Subscription Status Card */}
      {isSubscribed && subscriptionPlan && (
        <div className="group/sub relative bg-slate-900 rounded-[48px] p-10 sm:p-12 overflow-hidden transition-all duration-500 border border-slate-800">
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-emerald-500/20 transition-all duration-1000" />
          <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] opacity-40 group-hover:bg-blue-500/20 transition-all duration-1000" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex items-center gap-10">
              <div className="w-24 h-24 rounded-[40px] bg-white/[0.03] backdrop-blur-xl flex items-center justify-center text-emerald-400 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000 relative">
                <Crown className="w-12 h-12" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse" />
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                    {formatPlanName(subscriptionPlan)}
                  </h2>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live reputation</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 opacity-80">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Identity verified professional</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">elite service verification enabled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <button className="w-full sm:w-auto px-10 py-5 bg-white border border-white text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 rounded-full hover:-translate-y-1 active:scale-95 transition-all duration-500">
                Manage console
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-500 backdrop-blur-sm active:scale-95">
                Billing history
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
