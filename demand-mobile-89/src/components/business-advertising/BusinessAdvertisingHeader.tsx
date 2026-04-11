
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Star, ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

interface BusinessAdvertisingHeaderProps {
  onNavigateHome: () => void;
}

export const BusinessAdvertisingHeader = ({ onNavigateHome }: BusinessAdvertisingHeaderProps) => {
  return (
    <header className="sticky top-0 z-[100] w-full bg-white/70 backdrop-blur-2xl border-b border-black/5 transition-all duration-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 md:py-6">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-black/5 text-slate-400 hover:text-slate-900 transition-all active:scale-95 group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">Enterprise Ready</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase mb-1">
              Business Advertising
            </h1>
            <p className="text-[12px] font-medium text-slate-500 leading-relaxed">accelerate your local market growth.</p>
          </div>
          <div className="flex justify-center items-center gap-8 mt-6">
            <div className="text-center group cursor-default">
              <div className="flex items-center justify-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xl font-black text-slate-900 tracking-tight">2.5x</span>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">avg. roi</p>
            </div>
            <div className="w-px h-8 bg-black/5"></div>
            <div className="text-center group cursor-default">
              <div className="flex items-center justify-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-xl font-black text-slate-900 tracking-tight">98%</span>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">satisfaction</p>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border border-black/5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 group shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
            </button>
            <div className="h-10 w-px bg-black/5"></div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-1">
                Business Advertising
              </h1>
              <p className="text-[13px] font-medium text-slate-500 tracking-tight">accelerate your reach with precision targeted local campaigns.</p>
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-right group cursor-default">
              <div className="flex items-center justify-end gap-2.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-2xl font-black text-slate-900 tracking-tight">2.5x</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Average R.O.I.</p>
            </div>
            <div className="text-right group cursor-default">
              <div className="flex items-center justify-end gap-2.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-2xl font-black text-slate-900 tracking-tight">98%</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1.5">Member Rating</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
