
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Crown } from "lucide-react";
import { SubscriptionAlert } from "@/components/contractor/SubscriptionAlert";
import { LeadLimitCard } from "@/components/contractor/LeadLimitCard";
import { ModernContractorOverview } from "@/components/contractor/ModernContractorOverview";
import { ContractorProjects } from "@/components/ContractorProjects";
import { QuoteManagerEnhanced } from "@/components/QuoteManagerEnhanced";
import { ContractorTools } from "@/components/ContractorTools";
import { SubscriptionStatus } from "@/components/SubscriptionStatus";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { ContractorProfile } from "@/components/ContractorProfile";
import { ContractorJobFeed } from "./ContractorJobFeed";

interface DashboardContentProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isSubscribed: boolean;
  subscriptionPlan?: string;
  jobsThisMonth: number;
  leadLimit: number;
  canAcceptJob: () => boolean;
}

export const DashboardContent = ({ 
  activeTab, 
  onTabChange, 
  isSubscribed, 
  subscriptionPlan, 
  jobsThisMonth, 
  leadLimit, 
  canAcceptJob 
}: DashboardContentProps) => {
  const handleNavigateToQuotes = () => onTabChange('quotes');
  const handleNavigateToProjects = () => onTabChange('projects');
  const handleNavigateToTools = () => onTabChange('tools');
  const handleNavigateToProfile = () => onTabChange('profile');

  return (
    <>
      <TabsContent value="dashboard" className="space-y-6 mt-6">
        <SubscriptionAlert isSubscribed={isSubscribed} onTabChange={onTabChange} />

        {isSubscribed && (
          <LeadLimitCard 
            jobsThisMonth={jobsThisMonth} 
            leadLimit={leadLimit} 
            canAcceptJob={canAcceptJob} 
          />
        )}

        <ModernContractorOverview 
          onNavigateToSection={(section: string) => {
            switch (section) {
              case 'quotes':
                handleNavigateToQuotes();
                break;
              case 'projects':
                handleNavigateToProjects();
                break;
              case 'tools':
                handleNavigateToTools();
                break;
              case 'profile':
                handleNavigateToProfile();
                break;
              default:
                onTabChange(section);
            }
          }} 
        />
      </TabsContent>

      <TabsContent value="jobs" className="space-y-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ContractorJobFeed />
        </div>
      </TabsContent>

      <TabsContent value="projects" className="space-y-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ContractorProjects />
        </div>
      </TabsContent>

      <TabsContent value="quotes" className="space-y-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <QuoteManagerEnhanced />
        </div>
      </TabsContent>

      <TabsContent value="tools" className="space-y-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Wrench className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold">Business Tools & Resources</h2>
            </div>
            <ContractorTools />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="subscription" className="space-y-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Subscription Management</h2>
              <p className="text-gray-600">Manage your contractor subscription plan</p>
            </div>
          </div>

          {isSubscribed ? (
            <div className="space-y-6">
              <SubscriptionStatus />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="h-5 w-5" />
                    <span>Upgrade Your Plan</span>
                  </CardTitle>
                  <CardDescription>
                    Get more leads and premium features with a higher tier plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SubscriptionPlans 
                    userRole="contractor"
                    currentPlan={subscriptionPlan}
                    onPlanSelect={() => {}}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Crown className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">
                      Choose Your Contractor Plan
                    </h3>
                    <p className="text-blue-700">
                      Subscribe to start accepting leads and unlock premium features
                    </p>
                  </div>
                </CardContent>
              </Card>
              <SubscriptionPlans 
                userRole="contractor"
                currentPlan={subscriptionPlan}
                onPlanSelect={() => {}}
              />
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="profile" className="space-y-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <ContractorProfile />
        </div>
      </TabsContent>
    </>
  );
};
