
import { useHandymanJobs } from "@/hooks/useHandymanJobs";
import { JobTabs } from "./jobs/JobTabs";
import { JobsHeader } from "./handyman/JobsHeader";
import { EmptyJobsState } from "./handyman/EmptyJobsState";
import { JobsLoadingState } from "./handyman/JobsLoadingState";
import { JobsErrorState } from "./handyman/JobsErrorState";
import { MaintenanceJobsManager } from "./handyman/MaintenanceJobsManager";
import { HandymanQuotesTab } from "./handyman/dashboard/HandymanQuotesTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, ClipboardList, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export const HandymanJobsSection = () => {
  const {
    jobs,
    loading,
    error,
    lastRefresh,
    fetchJobs,
    handleJobStatusUpdate,
    getJobsByStatus,
    handleJobUpdated
  } = useHandymanJobs();

  if (loading) {
    return <JobsLoadingState />;
  }

  if (error) {
    return <JobsErrorState error={error} onRetry={fetchJobs} />;
  }

  const activeJobsCount = getJobsByStatus('in_progress').length + getJobsByStatus('pending').length;

  return (
    <div className="space-y-10 animate-fade-in outline-none">
      <JobsHeader
        lastRefresh={lastRefresh}
        activeJobsCount={activeJobsCount}
        onRefresh={fetchJobs}
        loading={loading}
      />

      <Tabs defaultValue="jobs" className="w-full">
        <div className="flex justify-center sm:justify-start mb-8 overflow-x-auto scrollbar-hide py-2">
          <TabsList className="inline-flex h-auto p-1.5 bg-white/40 backdrop-blur-xl border border-black/5 rounded-full min-w-max">
            {[
              { value: 'jobs', label: 'Regular Jobs', icon: Wrench },
              { value: 'maintenance', label: 'Maintenance Tasks', icon: ClipboardList },
              { value: 'quotes', label: 'Quotes', icon: Quote }
            ].map((tab) => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value} 
                className={cn(
                  "flex items-center gap-2.5 px-8 py-3 rounded-full transition-all duration-500",
                  "text-[10px] font-black uppercase tracking-[0.15em]",
                  "data-[state=active]:bg-[#166534] data-[state=active]:text-white",
                  "text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="mt-8 transition-all duration-500 min-h-[400px]">
          <TabsContent value="jobs" className="space-y-6 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {jobs.length === 0 ? (
              <EmptyJobsState onRefresh={fetchJobs} />
            ) : (
              <JobTabs jobs={jobs} onJobUpdated={handleJobUpdated} onJobStatusUpdate={handleJobStatusUpdate} />
            )}
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <MaintenanceJobsManager />
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6 focus-visible:outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <HandymanQuotesTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
