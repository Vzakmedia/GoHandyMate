
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, MousePointer, Calendar, DollarSign, Edit, Trash2, Play, Pause, ExternalLink, MoreVertical } from 'lucide-react';
import type { Advertisement } from '@/hooks/useAdvertisements';
import { cn } from "@/lib/utils";

interface AdCardProps {
  ad: Advertisement;
  onEdit: (ad: Advertisement) => void;
  onDelete: (adId: number) => void;
  onPauseResume: (adId: number, currentStatus: string) => void;
}

export const AdCard = ({ ad, onEdit, onDelete, onPauseResume }: AdCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase text-[9px] font-black tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Active
            </div>
        );
      case 'paused':
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 uppercase text-[9px] font-black tracking-widest">
                <Pause size={10} />
                Paused
            </div>
        );
      case 'expired':
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-500 border border-slate-200 uppercase text-[9px] font-black tracking-widest">
                Expired
            </div>
        );
      case 'rejected':
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-100 uppercase text-[9px] font-black tracking-widest">
                Rejected
            </div>
        );
      default:
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 uppercase text-[9px] font-black tracking-widest">
                {status}
            </div>
        );
    }
  };

  const metrics = [
    { label: 'Impressions', value: ad.views_count, icon: <Eye size={12} />, color: 'text-blue-600' },
    { label: 'Engagements', value: ad.clicks_count, icon: <MousePointer size={12} />, color: 'text-emerald-600' },
    { label: 'Duration', value: `${new Date(ad.end_date).toLocaleDateString()}`, icon: <Calendar size={12} />, color: 'text-purple-600' },
    { label: 'Investment', value: `$${ad.cost}`, icon: <DollarSign size={12} />, color: 'text-slate-900' },
  ];

  return (
    <div className="group relative">
      <div className="relative bg-white/80 backdrop-blur-xl border border-black/5 rounded-[32px] overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  {getStatusBadge(ad.status)}
                  <div className="px-3 py-1 rounded-full bg-slate-900 text-white uppercase text-[9px] font-black tracking-widest">
                    {ad.plan_type}
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors duration-300">
                  {ad.ad_title}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onEdit(ad)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => onDelete(ad.id)}
                  className="p-2.5 rounded-xl bg-red-50 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-2xl line-clamp-2">
              {ad.ad_description}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {metrics.map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center", metric.color)}>
                        {metric.icon}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{metric.label}</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 ml-8">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Preview */}
          {ad.image_url && (
            <div className="w-full md:w-48 flex-shrink-0 relative group/asset">
              <div className="relative aspect-square md:aspect-auto md:h-full rounded-2xl overflow-hidden">
                <img 
                  src={ad.image_url} 
                  alt="Campaign Asset"
                  className="w-full h-full object-cover transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/asset:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <ExternalLink className="text-white" size={20} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="px-8 py-5 bg-slate-50/50 border-t border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
                {ad.status !== 'expired' && ad.status !== 'rejected' && (
                    <button 
                        onClick={() => onPauseResume(ad.id, ad.status)}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2",
                            ad.status === 'active' 
                                ? "bg-white text-slate-600 hover:bg-amber-50 hover:text-amber-600" 
                                : "bg-slate-900 text-white hover:bg-emerald-600"
                        )}
                    >
                        {ad.status === 'active' ? (
                            <>
                                <Pause size={12} strokeWidth={3} />
                                Pause Campaign
                            </>
                        ) : (
                            <>
                                <Play size={12} strokeWidth={3} />
                                Resume Campaign
                            </>
                        )}
                    </button>
                )}
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                ID: CAM-{ad.id.toString().padStart(6, '0')}
            </div>
        </div>
      </div>
    </div>
  );
};
