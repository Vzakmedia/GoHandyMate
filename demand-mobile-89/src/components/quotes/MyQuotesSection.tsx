
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Clock, CheckCircle, XCircle, AlertCircle, Send, Briefcase, User, Calendar, Inbox, Loader2 } from 'lucide-react';
import { useCustomQuotes } from '@/hooks/useCustomQuotes';
import { cn } from '@/lib/utils';

export const MyQuotesSection = () => {
  const { myQuotes, loading } = useCustomQuotes();

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 p-20 flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <Loader2 className="w-10 h-10 text-[#166534] animate-spin mb-4" />
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Syncing your submissions...</p>
      </div>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'accepted':
        return { label: 'Approved', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: <CheckCircle className="w-3 h-3" /> };
      case 'rejected':
        return { label: 'Declined', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: <XCircle className="w-3 h-3" /> };
      default:
        return { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: <AlertCircle className="w-3 h-3" /> };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">
            Active submissions
          </h3>
          <div className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black shadow-lg">
            {myQuotes.length}
          </div>
        </div>
      </div>

      {myQuotes.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-sm border-2 border-dashed border-black/5 rounded-[48px] p-24 text-center group hover:border-[#166534]/20 transition-colors duration-700">
          <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-700">
            <Send className="w-10 h-10 text-slate-300 group-hover:text-[#166534] transition-colors" />
          </div>
          <div className="max-w-xs mx-auto space-y-2">
            <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">No quotes sent</h4>
            <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
              Start by transmitting professional proposals to available requests. Your sent quotes will appear here for tracking.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {myQuotes.map((quote) => {
            const status = getStatusConfig(quote.status);
            return (
              <div key={quote.id} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-[#166534]/0 rounded-[42px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
                
                <div className="relative bg-white/90 backdrop-blur-xl border border-black/5 rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
                  <div className="p-6 sm:p-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                      <div className="space-y-4 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm", status.bg, status.color, status.border)}>
                            {status.icon}
                            {status.label}
                          </div>
                          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-black/5 text-[10px] font-black uppercase tracking-widest">
                            Sent Proposal
                          </div>
                        </div>
                        
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-[#166534]">
                          {quote.custom_quote_requests?.service_name || 'Service Request'}
                        </h3>
                        
                        <p className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-2 max-w-2xl">
                          {quote.description}
                        </p>
                      </div>

                      <div className="flex flex-col items-start lg:items-end justify-center px-8 py-6 bg-slate-50/50 rounded-[32px] border border-black/5 shrink-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Proposed quote</span>
                        <span className="text-3xl font-black text-emerald-600 tracking-tight leading-none">
                          ${quote.quoted_price}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-black/5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                            <User className="w-4 h-4 text-[#166534]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Target client</p>
                            <p className="text-[12px] font-bold text-slate-700 truncate">
                              {quote.custom_quote_requests?.profiles?.full_name || 'Verified Customer'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                            <Calendar className="w-4 h-4 text-[#166534]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Submission date</p>
                            <p className="text-[12px] font-bold text-slate-700">
                              {new Date(quote.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {quote.estimated_hours && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                              <Clock className="w-4 h-4 text-[#166534]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Estimate</p>
                              <p className="text-[12px] font-bold text-slate-700">{quote.estimated_hours} hours labor</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 border border-black/5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tracked in live feed</span>
                      </div>
                    </div>

                    {quote.availability_note && (
                      <div className="mt-8 p-6 bg-slate-50 rounded-[24px] border border-black/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Availability log</p>
                        <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic">
                          "{quote.availability_note}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
