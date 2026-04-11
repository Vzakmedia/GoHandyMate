
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench, Award, TrendingUp, CircleDollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsOverviewProps {
  activeSkillsCount: number;
  expertSkillsCount: number;
  activeServicesCount: number;
}

export const StatsOverview = ({ 
  activeSkillsCount, 
  expertSkillsCount, 
  activeServicesCount 
}: StatsOverviewProps) => {
  const stats = [
    {
      label: 'Active Services',
      value: activeServicesCount,
      icon: Wrench,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Live in your profile'
    },
    {
      label: 'Service Categories',
      value: activeServicesCount > 0 ? Math.ceil(activeServicesCount / 2) : 0, // Mocking categories
      icon: Award,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      description: 'Specialized areas'
    },
    {
      label: 'Growth Ready',
      value: activeServicesCount > 5 ? "Excellent" : "Good",
      isBadge: true,
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'Market positioning'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="group relative bg-white border border-black/5 rounded-[24px] p-6 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  {stat.label}
                </p>
                {stat.isBadge ? (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900 leading-none">
                      {stat.value}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                ) : (
                  <p className="text-3xl font-black text-slate-900 leading-none">
                    {stat.value}
                  </p>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                {stat.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
