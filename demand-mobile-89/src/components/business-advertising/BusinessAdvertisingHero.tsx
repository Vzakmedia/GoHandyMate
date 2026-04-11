
import { TrendingUp, Star, Zap, Target, Globe } from 'lucide-react';
import { cn } from "@/lib/utils";

export const BusinessAdvertisingHero = () => {
  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-[48px] p-8 md:p-16 mb-12 shadow-2xl group/hero transition-all duration-700">
      {/* Premium Mesh Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-emerald-500/20 opacity-50 group-hover/hero:opacity-70 transition-opacity duration-1000"></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 contrast-150 brightness-150"></div>

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Market Accelerator v2.0</span>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-[1.05] uppercase">
              Reach More <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">Local Customers</span>
            </h2>
            <p className="text-lg md:text-xl font-medium text-slate-300 max-w-xl leading-relaxed">
              connect with homeowners in your area who need your specific expertise. precision targeting meets frictionless growth.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-6">
            <div className="space-y-1">
              <div className="text-3xl font-black text-white tracking-tight">98%</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth Rate</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-white tracking-tight">2.5x</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. ROI</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-black text-white tracking-tight">SEC</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activation</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex justify-center relative">
          {/* Floating Element Presentation */}
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Main Center Icon */}
            <div className="w-48 h-48 bg-white/10 backdrop-blur-3xl rounded-[40px] border border-white/20 shadow-2xl flex items-center justify-center group-hover/hero:scale-105 transition-transform duration-700 relative z-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <TrendingUp className="w-24 h-24 text-white drop-shadow-2xl" />
            </div>

            {/* Orbiting Elements */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-bounce cursor-default z-30">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <div className="absolute bottom-4 left-0 w-20 h-20 bg-purple-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-pulse cursor-default z-30">
              <Target className="w-10 h-10 text-white" />
            </div>
            <div className="absolute top-1/2 -left-12 w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-spin-slow cursor-default z-30">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <div className="absolute -bottom-8 right-12 w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center shadow-2xl cursor-default z-10 animate-float">
                <Globe className="w-6 h-6 text-white/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
