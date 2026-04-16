
import {
  Home,
  Briefcase,
  DollarSign,
  User,
  MessageSquare,
  LayoutDashboard,
  Wallet,
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabNavigation = ({ activeTab, onTabChange }: DashboardTabNavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="mb-10 overflow-x-auto scrollbar-hide py-4 -mx-6 px-6 sm:mx-0 sm:px-0 animate-fade-in outline-none">
      <div className="inline-flex items-center p-2 bg-white/60 backdrop-blur-xl border border-black/5 rounded-[32px] min-w-max relative group">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "group/tab relative flex items-center px-8 py-3.5 rounded-[24px] transition-all duration-500 gap-3 outline-none",
                isActive 
                  ? "bg-[#166534] text-white scale-[1.02] -translate-y-0.5" 
                  : "text-slate-400 hover:text-slate-900 hover:bg-white transition-all active:scale-95"
              )}
            >
              <Icon className={cn("w-4 h-4 transition-transform duration-500 group-hover/tab:scale-110", isActive ? "text-white" : "text-slate-400 group-hover/tab:text-[#166534]")} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors duration-500",
                isActive ? "text-white" : "text-slate-400 group-hover/tab:text-slate-900"
              )}>
                {tab.label}
              </span>
              
              {isActive && (
                <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-emerald-300 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
