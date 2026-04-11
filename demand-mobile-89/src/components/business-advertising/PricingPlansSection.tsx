
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Sparkles, Rocket, Crown } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface PricingPlan {
  id: 'basic' | 'premium' | 'featured';
  name: string;
  price: number;
  duration: number;
  impressions: number;
  targeting: string[];
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

interface PricingPlansSectionProps {
  plans: PricingPlan[];
  selectedPlan: string;
  onPlanSelect: (planId: 'basic' | 'premium' | 'featured') => void;
}

export const PricingPlansSection = ({ plans, selectedPlan, onPlanSelect }: PricingPlansSectionProps) => {
  return (
    <div className="space-y-12 md:space-y-16 py-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
          Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Growth Engine</span>
        </h3>
        <p className="text-[15px] font-medium text-slate-500 leading-relaxed max-w-2xl mx-auto lowercase first-letter:uppercase">
          every plan is precision-engineered for maximum engagement. secure checkout. immediate activation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => onPlanSelect(plan.id)}
            className={cn(
              "relative group cursor-pointer transition-all duration-500",
              selectedPlan === plan.id ? "scale-[1.02]" : "hover:scale-[1.01]"
            )}
          >
            {/* Glossy Background Layer */}
            <div className={cn(
              "absolute inset-0 rounded-[40px] transition-all duration-500",
              selectedPlan === plan.id 
                ? "bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] border-2 border-slate-900" 
                : "bg-white/40 backdrop-blur-xl border border-black/5 hover:bg-white/60 shadow-xl shadow-black/5"
            )}></div>

            <div className="relative z-10 p-8 flex flex-col h-full">
              {plan.popular && (
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-slate-900 text-[9px] font-black uppercase tracking-widest text-white shadow-xl flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-amber-400" />
                  Most Popular
                </div>
              )}

              <div className="space-y-6 flex-grow">
                {/* Icon & Name */}
                <div className="space-y-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-6",
                    plan.color === 'text-blue-600' ? "bg-blue-50 text-blue-600" : 
                    plan.color === 'text-purple-600' ? "bg-purple-50 text-purple-600" : 
                    "bg-emerald-50 text-emerald-600"
                  )}>
                    {plan.id === 'basic' && <Rocket size={28} className="font-black" />}
                    {plan.id === 'premium' && <Sparkles size={28} className="font-black" />}
                    {plan.id === 'featured' && <Crown size={28} className="font-black" />}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase">{plan.name}</h4>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Active for {plan.duration} days</p>
                  </div>
                </div>

                {/* Price */}
                <div className="py-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[20px] font-black text-slate-900">$</span>
                    <span className="text-5xl font-black text-slate-900 tracking-tightest">{plan.price}</span>
                  </div>
                </div>

                {/* Reach Stats */}
                <div className="p-5 rounded-3xl bg-slate-50 border border-black/5 space-y-1">
                  <div className="text-2xl font-black text-slate-900 tracking-tight">
                    {plan.impressions.toLocaleString()}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Reach Impressions</p>
                </div>

                {/* Features */}
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {plan.targeting.map((target, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-black/5 text-[9px] font-black uppercase tracking-widest text-slate-600">
                        {target}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-[13px] font-medium text-slate-600 tracking-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlanSelect(plan.id);
                  }}
                  className={cn(
                    "w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                    selectedPlan === plan.id
                      ? "bg-slate-900 text-white shadow-2xl shadow-slate-900/20"
                      : "bg-white border border-black/5 text-slate-900 hover:bg-slate-50 hover:-translate-y-0.5 shadow-xl shadow-black/5"
                  )}
                >
                  <CreditCard className="w-4 h-4" />
                  {selectedPlan === plan.id ? 'Plan Selected' : `Select Plan ($${plan.price})`}
                </button>
              </div>
            </div>

            {/* Selection Tick Overlay */}
            {selectedPlan === plan.id && (
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center z-20 shadow-xl scale-110 animate-in zoom-in-0 duration-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
