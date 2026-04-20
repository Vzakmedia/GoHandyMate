import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContractorQuoteRequestsSection } from './ContractorQuoteRequestsSection';
import { ContractorQuoteSubmissionsSection } from './ContractorQuoteSubmissionsSection';
import { ReceivedQuoteSubmissionsSection } from './ReceivedQuoteSubmissionsSection';
import { SentQuoteRequestsSection } from './SentQuoteRequestsSection';
import { InvoiceManagementSection } from './InvoiceManagementSection';
import { QuoteTemplateSection } from './QuoteTemplateSection';
import { InvoiceTemplateSection } from './InvoiceTemplateSection';

export const ContractorQuotesTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Quote Management</h2>
        <p className="text-gray-600">Send quote requests to customers and manage received quotes</p>
      </div>

      <Tabs defaultValue="send-requests" className="w-full">
        {/* Mobile: Scrollable horizontal tabs */}
        <div className="sm:hidden mb-4">
          <div className="flex overflow-x-auto pb-2 space-x-1 scrollbar-hide">
            <TabsList className="flex h-auto p-0.5 bg-muted rounded-lg min-w-max">
              <TabsTrigger value="send-requests" className="text-xs px-2 py-1.5 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Send
              </TabsTrigger>
              <TabsTrigger value="sent-requests" className="text-xs px-2 py-1.5 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Sent
              </TabsTrigger>
              <TabsTrigger value="received-quotes" className="text-xs px-2 py-1.5 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Received
              </TabsTrigger>
              <TabsTrigger value="quote-responses" className="text-xs px-2 py-1.5 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Responses
              </TabsTrigger>
              <TabsTrigger value="invoices" className="text-xs px-2 py-1.5 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Invoices
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-xs px-2 py-1.5 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Templates
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:block">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="send-requests">Send Requests</TabsTrigger>
            <TabsTrigger value="sent-requests">Sent Requests</TabsTrigger>
            <TabsTrigger value="received-quotes">Received Quotes</TabsTrigger>
            <TabsTrigger value="quote-responses">Quote Responses</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="send-requests" className="space-y-6">
          <ContractorQuoteRequestsSection />
        </TabsContent>
        
        <TabsContent value="sent-requests" className="space-y-6">
          <SentQuoteRequestsSection />
        </TabsContent>
        
        <TabsContent value="received-quotes" className="space-y-6">
          <ContractorQuoteSubmissionsSection />
        </TabsContent>
        
        <TabsContent value="quote-responses" className="space-y-6">
          <ReceivedQuoteSubmissionsSection />
        </TabsContent>
        
        <TabsContent value="invoices" className="space-y-6">
          <InvoiceManagementSection />
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-6">
          <Tabs defaultValue="quotes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quotes">Quote Templates</TabsTrigger>
              <TabsTrigger value="invoices">Invoice Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quotes" className="space-y-6">
              <QuoteTemplateSection />
            </TabsContent>
            
            <TabsContent value="invoices" className="space-y-6">
              <InvoiceTemplateSection />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};