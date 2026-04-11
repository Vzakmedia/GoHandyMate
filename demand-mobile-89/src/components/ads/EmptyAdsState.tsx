
import { Megaphone, Plus } from 'lucide-react';

interface EmptyAdsStateProps {
  activeFilter: 'all' | 'active' | 'paused' | 'expired';
  onCreateNewAd: () => void;
}

export const EmptyAdsState = ({ activeFilter, onCreateNewAd }: EmptyAdsStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-8 bg-white/40 backdrop-blur-xl border border-black/5 rounded-[40px] text-center space-y-6">
      <div className="w-20 h-20 rounded-[32px] bg-slate-50 flex items-center justify-center text-slate-300 shadow-inner group-hover:scale-110 transition-transform duration-500">
        <Megaphone size={32} />
      </div>
      
      <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">No Campaigns Found</h3>
          <p className="text-slate-500 text-sm font-medium max-w-xs mx-auto leading-relaxed">
            {activeFilter === 'all' 
              ? "Your portfolio is currently waiting for its first high-impact campaign." 
              : `No campaigns currently matching the "${activeFilter}" criteria were identified.`
            }
          </p>
      </div>

      <button 
        onClick={onCreateNewAd} 
        className="h-12 px-6 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all duration-300 flex items-center gap-2"
      >
        <Plus size={14} strokeWidth={3} />
        Initialize First Campaign
      </button>
    </div>
  );
};
