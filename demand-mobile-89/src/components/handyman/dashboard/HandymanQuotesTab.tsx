import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuoteRequestsSection } from '@/components/quotes/QuoteRequestsSection';
import { MyQuotesSection } from '@/components/quotes/MyQuotesSection';
import { FileText, Send, Inbox, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const HandymanQuotesTab = () => {
  return (
    <div className="space-y-10 animate-fade-in outline-none">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 group">
        <div className="w-14 h-14 rounded-2xl bg-[#166534] flex items-center justify-center transition-transform group-hover:scale-105 duration-500">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">
            Quote management
          </h2>
          <p className="text-[13px] font-medium text-slate-500">
            Manage your outgoing proposals and track client responses in real-time.
          </p>
        </div>
      </div>

      <Tabs defaultValue="available" className="w-full">
        <div className="flex justify-center sm:justify-start mb-8 overflow-x-auto scrollbar-hide py-2">
          <TabsList className="inline-flex h-auto p-1.5 bg-white/40 backdrop-blur-xl border border-black/5 rounded-full min-w-max">
            <TabsTrigger 
              value="available" 
              className={cn(
                "flex items-center gap-2.5 px-8 py-3 rounded-full transition-all duration-500",
                "text-[10px] font-black uppercase tracking-[0.15em]",
                "data-[state=active]:bg-[#166534] data-[state=active]:text-white",
                "text-slate-400 hover:text-slate-600"
              )}
            >
              <Inbox className="w-3.5 h-3.5" />
              Available Requests
            </TabsTrigger>
            <TabsTrigger 
              value="my-quotes" 
              className={cn(
                "flex items-center gap-2.5 px-8 py-3 rounded-full transition-all duration-500",
                "text-[10px] font-black uppercase tracking-[0.15em]",
                "data-[state=active]:bg-[#166534] data-[state=active]:text-white",
                "text-slate-400 hover:text-slate-600"
              )}
            >
              <Send className="w-3.5 h-3.5" />
              My Quotes
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="mt-8 transition-all duration-500 min-h-[400px]">
          <TabsContent value="available" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <QuoteRequestsSection />
          </TabsContent>
          
          <TabsContent value="my-quotes" className="focus-visible:outline-none animate-in fade-in slide-in-from-bottom-2 duration-500">
            <MyQuotesSection />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
