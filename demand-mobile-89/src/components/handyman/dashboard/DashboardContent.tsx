import { DashboardOverview } from './DashboardOverview';
import { UnifiedJobsPage } from '@/components/handyman/UnifiedJobsPage';
import { EarningsMetricsOverview } from '@/components/handyman/earnings/EarningsMetricsOverview';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { HandymanProfile } from '@/components/HandymanProfile';
import { MobileSubscriptionPage } from '@/components/handyman/earnings/MobileSubscriptionPage';
import { Button } from '@/components/ui/button';
import { CreditCard, MessageSquare, Zap, ShieldCheck, Sparkles, Inbox, Lock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DashboardContentProps {
  activeTab: string;
}

export const DashboardContent = ({ activeTab }: DashboardContentProps) => {
  const [showMobileSubscription, setShowMobileSubscription] = useState(false);

  if (activeTab === 'earnings' && showMobileSubscription) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <MobileSubscriptionPage onBack={() => setShowMobileSubscription(false)} />
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'jobs':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <UnifiedJobsPage />
          </div>
        );
      case 'earnings':
        return (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <EarningsMetricsOverview />
            
            {/* Mobile: Show button to access subscription page */}
            <div className="block lg:hidden">
              <button
                onClick={() => setShowMobileSubscription(true)}
                className="w-full flex items-center justify-center gap-3 h-16 bg-white/90 backdrop-blur-xl border border-black/5 rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] text-[#166534] transition-all active:scale-95"
              >
                <CreditCard className="w-5 h-5" />
                <span>Subscription settings</span>
              </button>
            </div>

            {/* Desktop: Show subscription plans directly */}
            <div className="hidden lg:block space-y-8">
              <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-slate-50 border border-black/5 w-fit">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-900">Subscription Plans</h3>
              </div>
              <div className="bg-white/40 backdrop-blur-xl rounded-[48px] border border-black/5 p-4">
                <SubscriptionPlans userRole="handyman" />
              </div>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="group/msg bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 p-16 sm:p-24 text-center flex flex-col items-center justify-center gap-10 min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 p-16 opacity-5 pointer-events-none group-hover/msg:rotate-12 transition-transform duration-1000">
              <MessageSquare className="w-48 h-48 text-slate-900" />
            </div>

            <div className="relative">
              <div className="w-24 h-24 rounded-[32px] bg-slate-900 flex items-center justify-center group-hover/msg:scale-110 transition-transform duration-700 relative z-10">
                <Inbox className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-2xl bg-emerald-500 border-4 border-white flex items-center justify-center group-hover/msg:scale-110 transition-transform duration-700 delay-100 z-20">
                <Lock className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 mb-2">
                  System update pending
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Messages</h3>
              </div>
              <p className="text-[15px] font-medium text-slate-500 max-w-[340px] leading-relaxed mx-auto lowercase first-letter:uppercase">
                Your messages with clients will appear here once the system update is complete.
              </p>
            </div>
            
            <button className="flex items-center gap-3 px-10 py-5 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 hover:-translate-y-1 transition-all duration-500 active:scale-95 group/btn">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
              Check status
            </button>
          </div>
        );
      case 'profile':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <HandymanProfile />
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      {renderContent()}
    </div>
  );
};
