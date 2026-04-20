
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

interface AdminQuickActionsProps {
  onTabChange: (tab: string) => void;
}

export const AdminQuickActions = ({ onTabChange }: AdminQuickActionsProps) => {
  return (
    <Card className="rounded-[2rem] border border-black/5 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">Quick Admin Actions</CardTitle>
        <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Common administrative tasks and system overviews
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-black/5 hover:bg-white hover:shadow-lg transition-all duration-300 group">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">Account Verification Queue</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Review and approve pending handyman applications to ensure platform quality.
            </p>
            <button
              onClick={() => onTabChange('verification')}
              className="inline-flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.15em] hover:gap-3 transition-all duration-300"
            >
              View Pending Applications
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-black/5 hover:bg-white hover:shadow-lg transition-all duration-300 group">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-2">Demo Video Management</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Upload and manage demo videos shown on the homepage to keep content fresh and engaging.
            </p>
            <button
              onClick={() => onTabChange('videos')}
              className="inline-flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-[0.15em] hover:gap-3 transition-all duration-300"
            >
              Manage Video Content
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
