import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContractorJobsTab } from './ContractorJobsTab';
import { ContractorQuotesTab } from './ContractorQuotesTab';
import { LiveMetricsDashboard } from './LiveMetricsDashboard';

export const ContractorDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contractor Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your jobs and track performance with live data</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Live Data</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="quotes">Quotes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <LiveMetricsDashboard />
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-6">
          <ContractorJobsTab />
        </TabsContent>
        
        <TabsContent value="quotes" className="space-y-6">
          <ContractorQuotesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};