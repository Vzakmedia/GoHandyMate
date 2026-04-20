
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

interface DashboardHeaderProps {
  profileName?: string;
  businessName?: string;
  isSubscribed: boolean;
  subscriptionPlan?: string;
}

export const DashboardHeader = ({ profileName, businessName, isSubscribed, subscriptionPlan }: DashboardHeaderProps) => {
  const formatPlanName = (plan: string) => {
    const planNames: { [key: string]: string } = {
      'basic': 'Basic Plan',
      'business': 'Business Plan',
      'enterprise': 'Enterprise Plan'
    };
    return planNames[plan] || plan.charAt(0).toUpperCase() + plan.slice(1) + ' Plan';
  };

  // Use business name for contractors, fall back to profile name
  const displayName = businessName || profileName || 'Contractor';

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
      <div className="space-y-1">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Business Hub</h1>
          <Badge className="bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest border-none px-2 py-0.5 rounded-md">
            Live
          </Badge>
        </div>
        <div className="flex flex-col">
          <p className="text-slate-500 font-bold text-sm tracking-tight">
            Welcome back, <span className="text-slate-900">{displayName}</span>
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            System active & monitoring territory performance
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-black/5">
        <div className="flex flex-col items-end mr-3 hidden sm:flex">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Status</span>
          <span className="text-xs font-bold text-slate-900">{isSubscribed ? "Verified Professional" : "Guest Access"}</span>
        </div>

        {subscriptionPlan && isSubscribed ? (
          <Badge className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full flex items-center gap-2 border-none shadow-lg transition-all duration-300 hover:scale-105">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Crown className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{formatPlanName(subscriptionPlan)}</span>
          </Badge>
        ) : (
          <Badge variant="destructive" className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border-none shadow-md">
            Subscription Required
          </Badge>
        )}
      </div>
    </div>
  );
};
