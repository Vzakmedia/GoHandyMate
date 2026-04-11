
import { Card, CardContent } from '@/components/ui/card';
import { Eye, MousePointer, Calendar, DollarSign, TrendingUp, Activity, Target } from 'lucide-react';
import type { Advertisement } from '@/hooks/useAdvertisements';
import { cn } from "@/lib/utils";

interface AdStatsCardsProps {
  advertisements: Advertisement[];
}

export const AdStatsCards = ({ advertisements }: AdStatsCardsProps) => {
  const totalViews = advertisements.reduce((sum, ad) => sum + ad.views_count, 0);
  const totalClicks = advertisements.reduce((sum, ad) => sum + ad.clicks_count, 0);
  const activeAds = advertisements.filter(ad => ad.status === 'active').length;
  const totalSpent = advertisements.reduce((sum, ad) => sum + ad.cost, 0);

  const stats = [
    {
        label: 'Total Impressions',
        value: totalViews.toLocaleString(),
        icon: <Eye size={18} />,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        gradient: 'from-blue-600/5 to-blue-600/10'
    },
    {
        label: 'Engagement Rate',
        value: totalClicks.toLocaleString(),
        icon: <MousePointer size={18} />,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        gradient: 'from-emerald-600/5 to-emerald-600/10'
    },
    {
        label: 'Active Campaigns',
        value: activeAds.toString(),
        icon: <Activity size={18} />,
        color: 'text-purple-600',
        bg: 'bg-purple-50',
        gradient: 'from-purple-600/5 to-purple-600/10'
    },
    {
        label: 'Total Investment',
        value: `$${totalSpent.toLocaleString()}`,
        icon: <TrendingUp size={18} />,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        gradient: 'from-amber-600/5 to-amber-600/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="group relative">
            <div className={cn("absolute -inset-0.5 bg-gradient-to-br rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500", stat.gradient)}></div>
            <div className="relative bg-white/60 backdrop-blur-xl border border-black/5 rounded-3xl p-6 shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                    </div>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-inner", stat.bg, stat.color)}>
                        {stat.icon}
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Analytics</span>
                </div>
            </div>
        </div>
      ))}
    </div>
  );
};
