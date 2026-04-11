import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, BarChart3, ListTree, RefreshCcw } from 'lucide-react';
import { ServiceCategoryPricing } from '../profile/ServiceCategoryPricing';
import { SkillOverview } from '../profile/SkillOverview';
import { StatsOverview } from '../profile/skills-pricing/StatsOverview';
import { useSkillsAndPricingData } from './hooks/useSkillsAndPricingData';
import { cn } from '@/lib/utils';

interface BaseSkillsAndPricingTabProps {
  variant?: 'standard' | 'enhanced';
  showSyncStatus?: boolean;
  headerComponent?: React.ComponentType<any>;
  additionalTabs?: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }>;
}

export const BaseSkillsAndPricingTab = ({ 
  variant = 'standard',
  showSyncStatus = false,
  headerComponent: HeaderComponent,
  additionalTabs = []
}: BaseSkillsAndPricingTabProps) => {
  const {
    loading,
    processedData,
    activeTab,
    setActiveTab,
    syncError,
    isEditing,
    setIsEditing,
    handleRefresh
  } = useSkillsAndPricingData();

  // Loading state
  if (loading) {
    return (
      <div className="space-y-10 animate-fade-in">
        <div className="h-10 bg-slate-50 border border-black/5 rounded-full w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 bg-slate-50 border border-black/5 rounded-[32px]" />
          ))}
        </div>
        <div className="h-80 bg-slate-50 border border-black/5 rounded-[48px]" />
      </div>
    );
  }

  // Base tabs configuration
  const baseTabs = [
    { id: 'overview', label: 'Summary Overview', icon: BarChart3 },
    { id: variant === 'enhanced' ? 'categories' : 'pricing', label: variant === 'enhanced' ? 'Service Catalog' : 'Service Pricing', icon: ListTree }
  ];

  // Add sync status tab for enhanced variant
  if (variant === 'enhanced' && showSyncStatus) {
    baseTabs.push({ id: 'sync-status', label: 'Live Sync Status', icon: RefreshCcw });
  }

  // Combine with additional tabs
  const allTabs = [...baseTabs, ...additionalTabs];

  return (
    <div className="space-y-10">
      {/* Header Component */}
      {HeaderComponent && (
        <HeaderComponent
          isEditing={isEditing}
          loading={loading}
          onRefresh={handleRefresh}
          onEditToggle={() => setIsEditing(true)}
        />
      )}

      {/* Error Alert */}
      {syncError && (
        <Alert className="border-red-100 bg-red-50/50 rounded-2xl animate-fade-in">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700 text-xs font-bold uppercase tracking-widest">
            <strong>Sync Protocol Error:</strong> {syncError}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Overview */}
      <StatsOverview
        activeSkillsCount={0}
        expertSkillsCount={0}
        activeServicesCount={processedData.allActiveServices.length}
      />

      {/* Content Area with Tabs */}
      <div className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <TabsList className="h-auto p-1 bg-slate-50/50 backdrop-blur-sm border border-black/5 rounded-full">
              {allTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className={cn(
                    "flex items-center gap-2.5 px-6 py-2.5 rounded-full transition-all duration-300",
                    "text-[10px] font-black uppercase tracking-widest",
                    "data-[state=active]:bg-white data-[state=active]:text-[#166534] data-[state=active]:border-black/5",
                    "text-slate-400"
                  )}
                >
                  {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="pt-8">
            {/* Overview Tab */}
            <TabsContent value="overview" className="focus-visible:outline-none focus-visible:ring-0">
              <SkillOverview
                selectedSkills={processedData.activeSkills}
                servicePricing={processedData.allActiveServices}
                onEdit={() => setIsEditing(true)}
              />
            </TabsContent>

            {/* Service Pricing/Categories Tab */}
            <TabsContent value={variant === 'enhanced' ? 'categories' : 'pricing'} className="focus-visible:outline-none focus-visible:ring-0">
              <ServiceCategoryPricing isEditing={isEditing} />
            </TabsContent>

            {/* Additional Tabs */}
            {additionalTabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="focus-visible:outline-none focus-visible:ring-0">
                {tab.content}
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
};