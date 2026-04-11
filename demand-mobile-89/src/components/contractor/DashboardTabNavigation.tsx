import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Briefcase,
  FolderKanban,
  FileText,
  Wrench,
  CreditCard,
  User
} from "lucide-react";

interface DashboardTabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardTabNavigation = ({ activeTab, onTabChange }: DashboardTabNavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'quotes', label: 'Quotes', icon: FileText },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'subscription', label: 'Plan', icon: CreditCard },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="mb-10 overflow-x-auto scrollbar-hide">
      <div className="inline-flex items-center gap-2 p-2 bg-white/50 backdrop-blur-md border border-black/5 rounded-[2.5rem] shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Button
              key={tab.id}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "rounded-full px-8 py-5 transition-all duration-500 group relative overflow-hidden",
                isActive
                  ? "bg-[#166534] text-white shadow-lg scale-105"
                  : "text-slate-500 hover:text-[#166534] hover:bg-slate-100/50"
              )}
            >
              <div className="flex items-center gap-3 relative z-10">
                <Icon className={cn("w-4 h-4", isActive ? "animate-pulse" : "group-hover:scale-110 transition-transform")} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
              </div>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
