
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job, JobStatus } from "@/types/job";
import { JobsList } from "./JobsList";
import { cn } from "@/lib/utils";

interface JobTabsProps {
  jobs: Job[];
  onJobUpdated?: () => void;
  onJobStatusUpdate?: (jobId: string, newStatus: string) => void;
}

export const JobTabs = ({ jobs, onJobUpdated, onJobStatusUpdate }: JobTabsProps) => {
  const getJobsByStatus = (status: JobStatus) => {
    return jobs.filter(job => job.status === status);
  };

  const statusTabs = [
    { id: 'all', label: 'All Jobs', count: jobs.length, color: 'slate' },
    { id: 'new_request', label: 'New', count: getJobsByStatus('new_request').length, color: 'blue' },
    { id: 'in_progress', label: 'Active', count: getJobsByStatus('in_progress').length, color: 'emerald' },
    { id: 'pending', label: 'Pending', count: getJobsByStatus('pending').length, color: 'amber' },
    { id: 'completed', label: 'Completed', count: getJobsByStatus('completed').length, color: 'indigo' },
    { id: 'cancelled', label: 'Cancelled', count: getJobsByStatus('cancelled').length, color: 'red' },
  ];

  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex items-center justify-between border-b border-black/5 pb-6 mb-8 overflow-x-auto scrollbar-hide">
        <TabsList className="inline-flex h-auto p-1 bg-slate-50 border border-black/5 rounded-full shadow-sm">
          {statusTabs.map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id} 
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-full transition-all duration-300",
                "text-[10px] font-black uppercase tracking-widest",
                "data-[state=active]:bg-white data-[state=active]:text-[#166534] data-[state=active]:shadow-sm data-[state=active]:border-black/5",
                "text-slate-400"
              )}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={cn(
                  "ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-black",
                  "bg-black/5 text-slate-500",
                  "group-data-[state=active]:bg-emerald-50 group-data-[state=active]:text-emerald-600"
                )}>
                  {tab.count}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <div className="animate-in fade-in duration-700">
        <TabsContent value="all" className="focus-visible:outline-none">
          <JobsList jobs={jobs} onJobStatusUpdate={onJobStatusUpdate} />
        </TabsContent>

        <TabsContent value="new_request" className="focus-visible:outline-none">
          <JobsList jobs={jobs} status="new_request" onJobStatusUpdate={onJobStatusUpdate} />
        </TabsContent>

        <TabsContent value="in_progress" className="focus-visible:outline-none">
          <JobsList jobs={jobs} status="in_progress" onJobStatusUpdate={onJobStatusUpdate} />
        </TabsContent>

        <TabsContent value="pending" className="focus-visible:outline-none">
          <JobsList jobs={jobs} status="pending" onJobStatusUpdate={onJobStatusUpdate} />
        </TabsContent>

        <TabsContent value="completed" className="focus-visible:outline-none">
          <JobsList jobs={jobs} status="completed" onJobStatusUpdate={onJobStatusUpdate} />
        </TabsContent>

        <TabsContent value="cancelled" className="focus-visible:outline-none">
          <JobsList jobs={jobs} status="cancelled" onJobStatusUpdate={onJobStatusUpdate} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
