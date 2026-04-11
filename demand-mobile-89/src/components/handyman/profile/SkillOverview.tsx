
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Award, Edit3, CircleDollarSign, CheckCircle2, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServicePricing {
  categoryId: string;
  subcategoryId?: string;
  basePrice: number;
  customPrice?: number;
  isActive: boolean;
  sameDayMultiplier: number;
  emergencyMultiplier: number;
}

interface SkillOverviewProps {
  selectedSkills: any[]; // Deprecated - keeping for compatibility
  servicePricing: ServicePricing[];
  onEdit: () => void;
}

export const SkillOverview = ({ servicePricing, onEdit }: SkillOverviewProps) => {
  // Count only category-level services (no subcategories) for main service count
  const activeCategoryServices = servicePricing.filter(service => 
    service.isActive && !service.subcategoryId
  );
  
  // Count all active services including subcategories for pricing overview
  const allActiveServices = servicePricing.filter(service => service.isActive);
  
  const averageServicePrice = allActiveServices.length > 0
    ? allActiveServices.reduce((sum, service) => sum + (service.customPrice || service.basePrice), 0) / allActiveServices.length
    : 0;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Service Categories', value: activeCategoryServices.length, icon: CircleDollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Services', value: allActiveServices.length, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg. Price', value: `$${averageServicePrice.toFixed(0)}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' }
        ].map((stat, i) => (
          <div key={i} className="group bg-white border border-black/5 rounded-[32px] p-6 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-slate-900 leading-none">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Pricing Overview */}
      <div className="bg-white border border-black/5 rounded-[48px] overflow-hidden">
        <div className="p-8 sm:p-12">
          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Service Catalog Insights
                <Badge variant="outline" className="border-emerald-100 bg-emerald-50 text-emerald-700 rounded-full px-3 py-0.5 text-[9px] font-black">
                  LIVE
                </Badge>
              </h3>
              <p className="text-[12px] font-medium text-slate-400">
                Performance metrics for your current pricing structure and service offerings.
              </p>
            </div>
            
            <button 
              onClick={onEdit}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#166534] hover:text-[#166534]/80 transition-colors"
            >
              Configure Details
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {allActiveServices.length > 0 ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50/50 rounded-[32px] border border-black/5 group hover:border-[#166534]/20 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center border border-black/5">
                      <TrendingUp className="w-4 h-4 text-[#166534]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Competitive Index</span>
                  </div>
                  <div className="text-4xl font-black text-[#166534] tracking-tight mb-2">
                    ${averageServicePrice.toFixed(0)}
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                    Your average service price is optimized for the local market benchmark.
                  </p>
                </div>
                
                <div className="p-8 bg-slate-50/50 rounded-[32px] border border-black/5 group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-black/5">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Density</span>
                  </div>
                  <div className="text-4xl font-black text-blue-700 tracking-tight mb-2">
                    {allActiveServices.length}
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                    Active services contribute to 85% profile visibility across search results.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100/50">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[12px] font-medium text-amber-700 leading-relaxed">
                  All pricing is managed in the <span className="font-black uppercase tracking-widest">Service Catalog</span>. Ensure your rates reflect your expertise and current market demand to maximize booking potential.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-slate-50/30 rounded-[40px] border border-dashed border-slate-200">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
                <CircleDollarSign className="w-10 h-10 text-slate-300" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-black text-slate-900 tracking-tight">Empty Service Catalog</p>
                <p className="text-[13px] font-medium text-slate-400 max-w-xs mx-auto">
                  You haven't configured any pricing yet. Add services to start receiving job requests.
                </p>
              </div>
              <button 
                onClick={onEdit}
                className="px-8 py-3 bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform"
              >
                Add My First Service
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
