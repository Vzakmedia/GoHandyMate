
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Megaphone, Target, BarChart3, LayoutGrid } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BusinessAdvertisingTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export const BusinessAdvertisingTabs = ({ activeTab, onTabChange, children }: BusinessAdvertisingTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex justify-center mb-12">
        <TabsList className="h-16 inline-flex bg-white/40 backdrop-blur-xl border border-black/5 rounded-[24px] p-2 shadow-2xl shadow-black/5">
          <TabsTrigger 
            value="pricing" 
            className="flex items-center gap-3 px-8 rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300"
          >
            <DollarSign className={cn("w-4 h-4", activeTab === 'pricing' ? "text-emerald-400" : "text-slate-400")} />
            <span className="text-[11px] font-black uppercase tracking-widest">Growth Plans</span>
          </TabsTrigger>
          <TabsTrigger 
            value="submit" 
            className="flex items-center gap-3 px-8 rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300"
          >
            <Megaphone className={cn("w-4 h-4", activeTab === 'submit' ? "text-blue-400" : "text-slate-400")} />
            <span className="text-[11px] font-black uppercase tracking-widest">Configuration</span>
          </TabsTrigger>
          <TabsTrigger 
            value="my-ads" 
            className="flex items-center gap-3 px-8 rounded-2xl data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-300"
          >
            <BarChart3 className={cn("w-4 h-4", activeTab === 'my-ads' ? "text-purple-400" : "text-slate-400")} />
            <span className="text-[11px] font-black uppercase tracking-widest">My Portfolio</span>
          </TabsTrigger>
        </TabsList>
      </div>
      
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {children}
      </div>
    </Tabs>
  );
};
