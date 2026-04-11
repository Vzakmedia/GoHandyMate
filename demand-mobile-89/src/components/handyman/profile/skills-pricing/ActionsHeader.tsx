
import { Button } from "@/components/ui/button";
import { RefreshCw, RotateCcw, Settings, Save, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionsHeaderProps {
  isEditing: boolean;
  loading: boolean;
  syncingToCustomer: boolean;
  lastSyncTime: Date | null;
  onRefresh: () => void;
  onSyncToCustomer: () => void;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ActionsHeader = ({
  isEditing,
  loading,
  syncingToCustomer,
  lastSyncTime,
  onRefresh,
  onSyncToCustomer,
  onEditToggle,
  onSave,
  onCancel
}: ActionsHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between pb-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#166534]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Expertise & Pricing
          </h2>
        </div>
        <p className="text-[13px] font-medium text-slate-500 max-w-xl leading-relaxed">
          Manage your professional service categories, detailed pricing structures, and optimize how customers see your expertise.
        </p>
        {lastSyncTime && (
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full border border-emerald-100">
            <CheckCircle2 className="w-3 h-3" />
            Live Sync: {lastSyncTime.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="group flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-black/5 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
        >
          <RefreshCw className={cn("w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180", loading && "animate-spin")} />
          Refresh
        </button>

        <button
          onClick={onSyncToCustomer}
          disabled={syncingToCustomer}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all active:scale-95"
        >
          <RotateCcw className={cn("w-3.5 h-3.5", syncingToCustomer && "animate-spin")} />
          {syncingToCustomer ? 'Syncing...' : 'Sync Profile'}
        </button>
        
        {!isEditing ? (
          <button 
            onClick={onEditToggle} 
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#166534]/90 transition-all active:scale-95"
          >
            <Settings className="w-3.5 h-3.5" />
            Edit Settings
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onCancel}
              className="px-6 py-3 rounded-full border border-black/5 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#166534]/90 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Sync
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
