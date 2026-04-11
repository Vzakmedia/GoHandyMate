
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Settings, Video, Shield } from 'lucide-react';

interface AdminOverviewCardsProps {
  onTabChange: (tab: string) => void;
}

export const AdminOverviewCards = ({ onTabChange }: AdminOverviewCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card
        className="group cursor-pointer rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:scale-[1.02] transition-all duration-500 bg-white overflow-hidden"
        onClick={() => onTabChange('verification')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Verification</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
            <Users className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-black text-slate-900 mb-1">Pending Reviews</div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Approve handyman & contractor accounts
          </p>
        </CardContent>
      </Card>

      <Card
        className="group cursor-pointer rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl hover:shadow-[#166534]/5 hover:scale-[1.02] transition-all duration-500 bg-white overflow-hidden"
        onClick={() => onTabChange('automation')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Automation</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#166534] group-hover:scale-110 transition-transform duration-500">
            <Settings className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-black text-slate-900 mb-1">Jobs & Tasks</div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Manage automated processes
          </p>
        </CardContent>
      </Card>

      <Card
        className="group cursor-pointer rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:scale-[1.02] transition-all duration-500 bg-white overflow-hidden"
        onClick={() => onTabChange('videos')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Demo Videos</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform duration-500">
            <Video className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-black text-slate-900 mb-1">Video Manager</div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Upload & manage demo videos
          </p>
        </CardContent>
      </Card>

      <Card
        className="group cursor-pointer rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:scale-[1.02] transition-all duration-500 bg-white overflow-hidden"
        onClick={() => onTabChange('management')}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">User Management</CardTitle>
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-500">
            <Shield className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl font-black text-slate-900 mb-1">Full Control</div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Complete user administration
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
