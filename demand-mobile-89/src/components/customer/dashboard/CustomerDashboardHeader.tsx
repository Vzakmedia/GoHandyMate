import { Sparkles, CalendarDays } from "lucide-react";

interface Props {
  profileName?: string;
}

export const CustomerDashboardHeader = ({ profileName }: Props) => {
  const firstName = profileName?.split(' ')[0] || 'Guest';

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col space-y-6 md:flex-row md:justify-between md:items-end md:space-y-0 relative z-10 pt-8 pb-4">
      <div className="min-w-0 pr-4 sm:pr-0 space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tighter">
            Good morning, {firstName}
          </h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Ready</span>
          </div>
        </div>
        <p className="text-[15px] font-medium text-slate-500 leading-relaxed max-w-2xl">
          Here is what's happening with your home services today.
        </p>
      </div>

      <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white border border-black/5">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5">
          <CalendarDays className="w-5 h-5 text-slate-600" />
        </div>
        <div className="flex flex-col pr-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Today</span>
          <span className="text-[12px] font-black text-slate-900 tracking-tight uppercase">
            {today}
          </span>
        </div>
      </div>
    </div>
  );
};
