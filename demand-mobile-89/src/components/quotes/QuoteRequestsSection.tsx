
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Loader2, RefreshCw, MapPin, Search, Filter, Signal, Sparkles, Inbox } from 'lucide-react';
import { useCustomQuotes } from '@/hooks/useCustomQuotes';
import { QuoteRequestCard } from './QuoteRequestCard';
import { cn } from '@/lib/utils';

export const QuoteRequestsSection = () => {
  const { quoteRequests, loading, fetchQuoteRequests } = useCustomQuotes();
  const [refreshing, setRefreshing] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [filteredRequests, setFilteredRequests] = useState(quoteRequests);

  useEffect(() => {
    let filtered = quoteRequests;

    if (locationFilter.trim()) {
      filtered = filtered.filter(request => 
        request.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (urgencyFilter !== 'all') {
      filtered = filtered.filter(request => request.urgency === urgencyFilter);
    }

    setFilteredRequests(filtered);
  }, [quoteRequests, locationFilter, urgencyFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchQuoteRequests();
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setLocationFilter('');
    setUrgencyFilter('all');
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 p-20 flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <Loader2 className="w-10 h-10 text-[#166534] animate-spin mb-4" />
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Syncing available requests...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in outline-none">
      {/* Filters Section */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-[#166534]/0 rounded-[42px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
        <Card className="relative bg-white/60 backdrop-blur-xl border-black/5 rounded-[40px] overflow-hidden shadow-2xl shadow-black/5">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-4 h-4 text-[#166534]" />
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Targeting filters</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Service location</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search regional requests..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="h-12 pl-11 rounded-[16px] border-black/5 bg-white/50 font-bold placeholder:text-slate-300 focus:ring-[#166534]/10"
                  />
                </div>
              </div>
              
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Priority status</label>
                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger className="h-12 rounded-[16px] border-black/5 bg-white/50 font-bold text-slate-700">
                    <SelectValue placeholder="All urgency levels" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[16px] border-black/5 shadow-xl">
                    <SelectItem value="all" className="font-bold">All urgency levels</SelectItem>
                    <SelectItem value="emergency" className="font-bold text-rose-600">Immediate emergency</SelectItem>
                    <SelectItem value="same_day" className="font-bold text-amber-600">Same day priority</SelectItem>
                    <SelectItem value="flexible" className="font-bold text-emerald-600">Flexible timeline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 items-end">
                <button
                  onClick={clearFilters}
                  className="flex-1 h-12 rounded-full border border-black/5 bg-white/50 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Reset
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="w-12 h-12 rounded-full border border-black/5 bg-[#166534] text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                >
                  <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Section */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">
              Available requests
            </h3>
            <div className="px-3 py-1 rounded-full bg-[#166534] text-white text-[10px] font-black shadow-lg shadow-emerald-900/10">
              {filteredRequests.length}
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Real-time pipeline</span>
          </div>
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-sm border-2 border-dashed border-black/5 rounded-[48px] p-24 text-center group hover:border-[#166534]/20 transition-colors duration-700">
            <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-700">
              <Inbox className="w-10 h-10 text-slate-300 group-hover:text-[#166534] transition-colors" />
            </div>
            <div className="max-w-xs mx-auto space-y-2">
              <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">No requests found</h4>
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                {locationFilter || urgencyFilter !== 'all' 
                  ? "Adjust your filters to see more available job opportunities in your region." 
                  : "We're currently syncing new requests. Your submitted quotes will appear in the active pipeline."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRequests.map((request) => (
              <QuoteRequestCard key={request.id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
