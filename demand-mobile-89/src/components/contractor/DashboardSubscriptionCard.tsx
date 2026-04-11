
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSubscriptionCardProps {
  isSubscribed: boolean;
  subscriptionPlan?: string;
}

export const DashboardSubscriptionCard = ({ isSubscribed, subscriptionPlan }: DashboardSubscriptionCardProps) => {
  if (!isSubscribed || !subscriptionPlan) return null;

  const formatPlanName = (plan: string) => {
    const planNames: { [key: string]: string } = {
      'basic': 'Business Professional',
      'business': 'Corporate Suite',
      'enterprise': 'Enterprise Executive'
    };
    return planNames[plan] || plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
  };

  return (
    <Card className="rounded-[2.5rem] border-none bg-slate-900 text-white overflow-hidden shadow-2xl relative group transition-all duration-500 hover:shadow-[#166534]/10">
      {/* Premium Background Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#166534]/10 rounded-full -translate-y-40 translate-x-40 blur-3xl group-hover:bg-[#166534]/15 transition-all duration-700" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full translate-y-24 -translate-x-24 blur-3xl opacity-50" />

      <CardContent className="p-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 rounded-[2rem] bg-[#166534]/10 flex items-center justify-center text-emerald-400 border border-[#166534]/20 shadow-inner group-hover:scale-105 transition-transform duration-500">
              <Crown className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {formatPlanName(subscriptionPlan)}
                </h2>
                <Badge className="bg-emerald-500 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 border-none rounded-full">
                  VERIFIED
                </Badge>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Premium Corporate Identification Active
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#fbbf24] animate-pulse" />
                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">
                    Your account is indexed for high-priority territory leads
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 backdrop-blur-sm shadow-sm group-hover:border-emerald-500/30">
              Billing Portal
            </button>
            <button className="px-8 py-4 bg-emerald-500 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 hover:scale-105 active:scale-95">
              Upgrade Tier
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
