
import { CheckCircle2, CloudCog, Database, Zap, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const SyncStatusTab = () => {
  const syncItems = [
    {
      title: 'Customer Section Access',
      description: 'Pricing data synchronized with customer-facing service selection protocols.',
      status: 'Live',
      statusColor: 'text-emerald-500',
      dotColor: 'bg-emerald-500',
      animate: true,
      icon: zapIcon
    },
    {
      title: 'Global Database Cluster',
      description: 'All changes are automatically distributed across the global database nodes.',
      status: 'Connected',
      statusColor: 'text-blue-500',
      dotColor: 'bg-blue-500',
      animate: false,
      icon: databaseIcon
    }
  ];

  return (
    <div className="bg-white border border-black/5 rounded-[48px] overflow-hidden animate-fade-in">
      <div className="p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <CloudCog className="w-6 h-6 text-[#166534]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Real-time Infrastructure</h3>
            <p className="text-[12px] font-medium text-slate-400">Monitoring your profile synchronization status.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50/50 rounded-[32px] border border-black/5 group hover:border-emerald-100 transition-all">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-black/5 shrink-0 transition-transform">
                <Zap className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-800 truncate mb-0.5">Customer Delivery Protocol</h4>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed truncate sm:whitespace-normal">
                  Pricing data synchronized with live customer-facing service selection.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 shrink-0">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Live Status</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-slate-50/50 rounded-[32px] border border-black/5 group hover:border-blue-100 transition-all">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-black/5 shrink-0 transition-transform">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] font-black uppercase tracking-widest text-slate-800 truncate mb-0.5">Persistent Core Database</h4>
                <p className="text-[11px] font-medium text-slate-400 leading-relaxed truncate sm:whitespace-normal">
                  Atomic synchronization with global database clusters to ensure data integrity.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-2 bg-blue-50 rounded-full border border-blue-100 shrink-0">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">Encrypted</span>
            </div>
          </div>

          <div className="p-8 bg-[#166534]/5 rounded-[32px] border border-[#166534]/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
              <ShieldCheck className="w-32 h-32 text-[#166534]" />
            </div>
            <div className="relative z-10">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#166534] mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Advanced Sync Features
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8">
                {[
                  'Real-time pricing live-view',
                  'Cross-category sync engine',
                  'Live availability broadcasting',
                  'Atomic price multiplier locks',
                  'Instant cache invalidation',
                  '256-bit data encryption'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]/40" />
                    <span className="text-[11px] font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const zapIcon = <Zap className="w-5 h-5 text-emerald-500" />;
const databaseIcon = <Database className="w-5 h-5 text-blue-500" />;
