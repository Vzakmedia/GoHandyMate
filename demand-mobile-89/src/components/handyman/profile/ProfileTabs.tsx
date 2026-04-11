
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './OverviewTab';
import { EnhancedSkillsAndPricingTab } from './EnhancedSkillsAndPricingTab';
import { WorkAreasTab } from './WorkAreasTab';
import { AvailabilityTab } from './AvailabilityTab';
import { ReviewsTab } from './ReviewsTab';
import { SettingsTab } from './SettingsTab';
import { LayoutDashboard, Wrench, MapPin, Clock, Star, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'skills', label: 'Services', icon: Wrench },
    { id: 'areas', label: 'Work Areas', icon: MapPin },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <div className="flex justify-center mb-8">
        <div className="overflow-x-auto scrollbar-hide py-2 px-4 w-full sm:w-auto">
          <TabsList className="inline-flex h-auto p-1.5 bg-white/40 backdrop-blur-xl border border-black/5 rounded-full min-w-max">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-500",
                  "text-[10px] sm:text-xs font-black uppercase tracking-[0.15em]",
                  "data-[state=active]:bg-[#166534] data-[state=active]:text-white",
                  "text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon className={cn(
                  "w-4 h-4 transition-transform duration-500",
                  activeTab === tab.id ? "scale-110" : "scale-100 group-hover:scale-110"
                )} />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </div>

      <div className="animate-fade-in [animation-duration:600ms]">
        <TabsContent value="overview" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="skills" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <EnhancedSkillsAndPricingTab />
        </TabsContent>

        <TabsContent value="areas" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <WorkAreasTab />
        </TabsContent>

        <TabsContent value="availability" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <AvailabilityTab />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <ReviewsTab />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 focus-visible:outline-none focus-visible:ring-0">
          <SettingsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
};
