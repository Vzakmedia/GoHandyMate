
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Plus, Target } from 'lucide-react';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';
import { EditAdDialog } from './EditAdDialog';
import { AdStatsCards } from './AdStatsCards';
import { AdFilters } from './AdFilters';
import { AdCard } from './AdCard';
import { EmptyAdsState } from './EmptyAdsState';
import type { Advertisement } from '@/hooks/useAdvertisements';

interface MyAdsManagerProps {
  onCreateNewAd: () => void;
}

export const MyAdsManager = ({ onCreateNewAd }: MyAdsManagerProps) => {
  const { advertisements, loading, updateAdStatus, deleteAdvertisement, refetch } = useAdvertisements();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'paused' | 'expired'>('all');
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  const filteredAds = advertisements.filter(ad => {
    if (activeFilter === 'all') return true;
    return ad.status === activeFilter;
  });

  const handlePauseResume = async (adId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await updateAdStatus(adId.toString(), newStatus);
      
      toast({
        title: "Status Updated",
        description: `Advertisement ${newStatus === 'active' ? 'activated' : 'paused'} successfully.`,
      });
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: "Error",
        description: err.message || "Failed to update advertisement status.",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (adId: number) => {
    if (confirm('Are you sure you want to delete this advertisement? This action cannot be undone.')) {
      try {
        await deleteAdvertisement(adId);
        toast({
          title: "Ad Deleted",
          description: "Your advertisement has been successfully deleted.",
        });
      } catch (error: unknown) {
        const err = error as Error;
        toast({
          title: "Error",
          description: err.message || "Failed to delete advertisement. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingAd(ad);
  };

  const handleEditSave = async () => {
    await refetch();
    setEditingAd(null);
  };

  if (!user) {
    return (
      <div className="text-center py-20 bg-white/40 backdrop-blur-xl border border-black/5 rounded-[40px]">
        <h3 className="text-[14px] font-black uppercase tracking-widest text-slate-900 mb-2">Authentication Required</h3>
        <p className="text-slate-500 text-sm font-medium mb-8">Please sign in to manage your advertising portfolio</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20 bg-white/40 backdrop-blur-xl border border-black/5 rounded-[40px]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-6">Retrieving Campaigns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white">
                <Target size={12} className="text-blue-400" />
                Advertising Portfolio
            </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">My Advertisements</h2>
          <p className="text-slate-500 text-[13px] font-medium max-w-lg">Manage, monitor, and optimize your active advertising campaigns in real-time.</p>
        </div>
        <button 
            onClick={onCreateNewAd} 
            className="h-14 px-8 rounded-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-600/10 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
        >
          <Plus size={18} strokeWidth={3} />
          Launch New Campaign
        </button>
      </div>

      {/* Stats Cards */}
      <div className="bg-white/40 backdrop-blur-xl border border-black/5 rounded-[40px] p-8 md:p-10 shadow-2xl shadow-black/5">
        <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 ml-2">Performance Overview</h3>
        <AdStatsCards advertisements={advertisements} />
      </div>

      {/* Portfolio Body */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-black/5">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Campaign Manager</h3>
            <AdFilters 
                advertisements={advertisements}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />
        </div>

        <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as 'all' | 'active' | 'paused' | 'expired')} className="w-full">
            <TabsContent value={activeFilter} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
                {filteredAds.length === 0 ? (
                    <EmptyAdsState 
                        activeFilter={activeFilter}
                        onCreateNewAd={onCreateNewAd}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {filteredAds.map((ad) => (
                            <AdCard
                                key={ad.id}
                                ad={ad}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onPauseResume={handlePauseResume}
                            />
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
      </div>

      <EditAdDialog 
        advertisement={editingAd}
        open={!!editingAd}
        onClose={() => setEditingAd(null)}
        onSave={handleEditSave}
      />
    </div>
  );
};
