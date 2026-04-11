import { Card, CardContent } from "@/components/ui/card";
import { Building, DollarSign, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DashboardStatsProps {
  stats: {
    activeProjects: number;
    totalRevenue: number;
    pendingQuotes: number;
    clientSatisfaction: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="w-1 h-6 bg-[#fbbf24] rounded-full" />
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Business Analytics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Projects */}
        <Card className="relative overflow-hidden border border-black/5 bg-white rounded-[2rem] transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group">
          <CardContent className="p-7">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 transition-all duration-500 group-hover:scale-110 shadow-sm border border-blue-100">
                <Building className="w-6 h-6" />
              </div>
              <Badge className="bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border-none px-3 py-1 shadow-sm">
                Active
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Projects</h3>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.activeProjects}</div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">+2 escalation from last period</p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-blue-500 opacity-20" />
        </Card>

        {/* Total Revenue */}
        <Card className="relative overflow-hidden border border-black/5 bg-white rounded-[2rem] transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group">
          <CardContent className="p-7">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-all duration-500 group-hover:scale-110 shadow-sm border border-emerald-100">
                <DollarSign className="w-6 h-6" />
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border-none px-3 py-1 shadow-sm">
                Growing
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gross Revenue</h3>
              <div className="text-3xl font-black text-slate-900 tracking-tight">${stats.totalRevenue.toLocaleString()}</div>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">+18% performance spike</p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-500 opacity-20" />
        </Card>

        {/* Pending Quotes */}
        <Card className="relative overflow-hidden border border-black/5 bg-white rounded-[2rem] transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group">
          <CardContent className="p-7">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 transition-all duration-500 group-hover:scale-110 shadow-sm border border-amber-100">
                <Clock className="w-6 h-6" />
              </div>
              <Badge className="bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border-none px-3 py-1 shadow-sm">
                Pending
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimates Outbound</h3>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.pendingQuotes}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting system responses</p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-amber-500 opacity-20" />
        </Card>

        {/* Client Rating */}
        <Card className="relative overflow-hidden border border-black/5 bg-white rounded-[2rem] transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group">
          <CardContent className="p-7">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <Badge className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full border-none px-3 py-1 shadow-sm">
                Verified
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Reputation</h3>
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.clientSatisfaction}%</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aggregate satisfaction score</p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-900 opacity-20" />
        </Card>
      </div>
    </div>
  );
};
