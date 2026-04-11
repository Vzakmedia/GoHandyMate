
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job, JobStatus } from "@/types/job";
import { JobActionButtons } from "./JobActionButtons";
import { MessageButton } from "@/components/messaging/MessageButton";
import { MapPin, Clock, DollarSign, User, Calendar, ChevronRight, Activity, ShieldCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onJobStatusUpdate?: (jobId: string, newStatus: string) => void;
}

export const JobCard = ({ job, onJobStatusUpdate }: JobCardProps) => {
  const getStatusConfig = (status: JobStatus) => {
    switch (status) {
      case 'pending': return { label: 'Pending Approval', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'assigned': return { label: 'Assigned', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'in_progress': return { label: 'In Progress', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'completed': return { label: 'Completed', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' };
      case 'cancelled': return { label: 'Cancelled', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
      default: return { label: status, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  const status = getStatusConfig(job.status);
  const canShowMessaging = ['assigned', 'in_progress', 'pending'].includes(job.status);

  return (
    <div className="group relative">
      {/* Decorative Background Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-[#166534]/0 rounded-[42px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="relative bg-white/90 backdrop-blur-xl border border-black/5 rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
            <div className="space-y-4 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm", status.bg, status.color, status.border)}>
                  <Activity className="w-3 h-3" />
                  {status.label}
                </div>
                {job.priority === 'urgent' && (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    Urgent Request
                  </div>
                )}
                {job.job_type && (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 border border-black/5 text-[10px] font-black uppercase tracking-widest">
                    {job.job_type.replace('_', ' ')}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-[#166534]">
                {job.title}
              </h3>
              
              <p className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-2 max-w-2xl">
                {job.description}
              </p>
            </div>

            {job.price > 0 && (
              <div className="flex flex-col items-start lg:items-end justify-center px-8 py-6 bg-slate-50/50 rounded-[32px] border border-black/5 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Estimated Budget</span>
                <span className="text-3xl font-black text-emerald-600 tracking-tight leading-none">
                  ${job.price}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-black/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
              <div className="flex items-center gap-3 group/item">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover/item:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-[#166534]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Location</p>
                  <p className="text-[12px] font-bold text-slate-700 truncate">{job.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group/item">
                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover/item:scale-110 transition-transform">
                  <Calendar className="w-4 h-4 text-[#166534]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Scheduled</p>
                  <p className="text-[12px] font-bold text-slate-700">{new Date(job.scheduledDate).toLocaleDateString()}</p>
                </div>
              </div>

              {job.customerName && (
                <div className="flex items-center gap-3 group/item">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover/item:scale-110 transition-transform">
                    <User className="w-4 h-4 text-[#166534]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Client</p>
                    <p className="text-[12px] font-bold text-slate-700 truncate">{job.customerName}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {canShowMessaging && job.customerName && (
                <MessageButton
                  jobId={job.id}
                  jobTitle={job.title}
                  jobStatus={job.status}
                  jobUpdatedAt={job.updated_at}
                  otherParticipantId={job.customer_id || ''}
                  otherParticipantName={job.customerName}
                />
              )}
              <JobActionButtons job={job} onJobStatusUpdate={onJobStatusUpdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
