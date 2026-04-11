
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Advertisement } from '@/hooks/useAdvertisements';
import { cn } from "@/lib/utils";

interface AdFiltersProps {
  advertisements: Advertisement[];
  activeFilter: 'all' | 'active' | 'paused' | 'expired';
  onFilterChange: (value: 'all' | 'active' | 'paused' | 'expired') => void;
}

export const AdFilters = ({ advertisements, activeFilter, onFilterChange }: AdFiltersProps) => {
  const counts = {
    all: advertisements.length,
    active: advertisements.filter(ad => ad.status === 'active').length,
    paused: advertisements.filter(ad => ad.status === 'paused').length,
    expired: advertisements.filter(ad => ad.status === 'expired').length,
  };

  const filters: { id: 'all' | 'active' | 'paused' | 'expired'; label: string }[] = [
    { id: 'all', label: 'All Assets' },
    { id: 'active', label: 'Active' },
    { id: 'paused', label: 'Paused' },
    { id: 'expired', label: 'Expired' },
  ];

  return (
    <Tabs value={activeFilter} onValueChange={(value) => onFilterChange(value as 'all' | 'active' | 'paused' | 'expired')} className="w-full">
      <TabsList className="h-12 inline-flex bg-slate-100/50 backdrop-blur-sm border border-black/5 rounded-2xl p-1.5 w-full md:w-auto">
        {filters.map((filter) => (
          <TabsTrigger 
            key={filter.id}
            value={filter.id}
            className="flex items-center gap-2 px-6 rounded-xl data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">{filter.label}</span>
            <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-bold",
                activeFilter === filter.id ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"
            )}>
                {counts[filter.id]}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
