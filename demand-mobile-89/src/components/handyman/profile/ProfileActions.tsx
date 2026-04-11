
import { Button } from "@/components/ui/button";
import { Edit, Save, X, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileActionsProps {
  isEditing: boolean;
  loading: boolean;
  onSave: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export const ProfileActions = ({
  isEditing,
  loading,
  onSave,
  onEdit,
  onCancel
}: ProfileActionsProps) => {
  if (isEditing) {
    return (
      <div className="flex flex-col gap-4 w-full sm:flex-row sm:justify-center animate-fade-in">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-black/5 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
        >
          <X className="w-4 h-4" />
          Cancel Changes
        </button>
        <button
          onClick={onSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#166534]/90 transition-all active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Processing...' : 'Save Profile'}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onEdit}
      className="group flex items-center justify-center gap-2 px-10 py-3.5 rounded-full bg-white border border-black/5 text-[11px] font-black uppercase tracking-widest text-[#166534] hover:border-emerald-200 hover:bg-emerald-50/30 transition-all active:scale-95 animate-fade-in"
    >
      <Edit className="w-4 h-4 transition-transform group-hover:scale-110" />
      Edit Profile Details
    </button>
  );
};
