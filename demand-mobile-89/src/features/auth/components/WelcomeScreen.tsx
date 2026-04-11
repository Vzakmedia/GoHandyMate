
import { Button } from '@/components/ui/button';
import {
  Users2, Hammer, ArrowRight, CheckCircle
} from 'lucide-react';

interface WelcomeScreenProps {
  onRoleSelect: (role: 'customer' | 'handyman') => void;
  onContinueAsGuest: () => void;
}

export const WelcomeScreen = ({ onRoleSelect, onContinueAsGuest }: WelcomeScreenProps) => {
  return (
    <div className="min-h-[100dvh] bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 overflow-x-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-50/50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-50/50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Header Section */}
        <div className="text-center space-y-4 sm:space-y-6 max-w-3xl mx-auto mt-8 sm:mt-0">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] sm:text-[11px] font-black tracking-[0.15em] uppercase border border-[#EBEBE0] shadow-sm mb-2 sm:mb-4">
            <CheckCircle className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-green-600" />
            Get Started
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
            Choose how you want to use <br className="hidden sm:block" />
            <span className="text-green-800">GoHandyMate</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">
            Pick the path that fits you best — whether you need help at home or want to grow your income as a skilled handyman.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto">
          {/* Customers Card */}
          <div
            className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-[#F0FDF4] border border-transparent hover:border-green-200 transition-all duration-500 cursor-pointer overflow-hidden min-h-[350px] sm:min-h-[420px] shadow-sm hover:shadow-xl hover:-translate-y-1"
            onClick={() => onRoleSelect('customer')}
          >
            <div className="space-y-6">
              <div className="text-[10px] font-black tracking-[0.15em] text-green-800/60 uppercase">
                Customers
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight group-hover:text-green-900 transition-colors">
                I need help with home projects
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Find trusted, local professionals for repairs, installations, cleaning, and more all in a few taps.
              </p>
            </div>

            {/* Inner White Pill */}
            <div className="mt-12 bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="text-[9px] font-black tracking-wider text-slate-400 uppercase">What you get</div>
                <div className="text-[11px] font-bold text-[#0A0A0A] leading-tight max-w-[120px]">
                  Verified local pros, reviews & secure payment
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                <Users2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Handymen Card */}
          <div
            className="group relative flex flex-col justify-between p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-[#ECFDF5] border border-transparent hover:border-emerald-200 transition-all duration-500 cursor-pointer overflow-hidden min-h-[350px] sm:min-h-[420px] shadow-sm hover:shadow-xl hover:-translate-y-1"
            onClick={() => onRoleSelect('handyman')}
          >
            <div className="space-y-6">
              <div className="text-[10px] font-black tracking-[0.15em] text-emerald-800/60 uppercase">
                Handymen
              </div>
              <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight group-hover:text-emerald-900 transition-colors">
                Offer your skills and grow your income
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Get matched with nearby jobs, build your reputation, and get paid fast for every completed task.
              </p>
            </div>

            {/* Inner White Pill */}
            <div className="mt-12 bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
              <div className="space-y-1">
                <div className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Best for</div>
                <div className="text-[11px] font-bold text-[#0A0A0A] leading-tight max-w-[120px]">
                  Independent handymen & on-call pros
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Hammer className="w-5 h-5" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* CONTRACTOR - PENDING (commented out)
          <div className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-[#F1F5F9] ...">
            ...
          </div>
          */}

          {/* PROPERTY_MANAGER - Moved to customer upgrade features (commented out)
          <div className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-[#F8FAFC] ...">
            ...
          </div>
          */}
        </div>

        {/* Footer CTA */}
        <div className="flex flex-col items-center space-y-6 sm:space-y-8 mt-10 sm:mt-16 mb-6">
          <div className="h-px w-24 bg-slate-200" />
          <Button
            onClick={onContinueAsGuest}
            variant="ghost"
            className="group text-slate-500 hover:text-green-800 font-bold transition-all duration-300 flex items-center gap-2 text-sm sm:text-base h-auto py-2"
          >
            Looking to just explore?
            <span className="text-green-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Continue as Guest <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
          <p className="text-sm text-slate-400 font-medium max-w-sm text-center italic">
            "Join thousands of happy building owners and skilled professionals on GoHandyMate."
          </p>
        </div>
      </div>
    </div>
  );
};
