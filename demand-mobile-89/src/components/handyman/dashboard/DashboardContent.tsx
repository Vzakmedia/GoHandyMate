import { DashboardOverview } from './DashboardOverview';
import { UnifiedJobsPage } from '@/components/handyman/UnifiedJobsPage';
import { EarningsMetricsOverview } from '@/components/handyman/earnings/EarningsMetricsOverview';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { HandymanProfile } from '@/components/HandymanProfile';
import { MobileSubscriptionPage } from '@/components/handyman/earnings/MobileSubscriptionPage';
import { HandymanMessagingHub } from '@/components/handyman/HandymanMessagingHub';
import { CreditCard, Sparkles } from 'lucide-react';
import { useState } from 'react';

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
      case 'dashboard':
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <HandymanMessagingHub />
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
