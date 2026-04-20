
import { JobBoard } from "@/components/JobBoard";
import { HomeTabContent } from "@/components/HomeTabContent";
import { ProviderDashboard } from "@/components/ProviderDashboard";
import { ProviderEarnings } from "@/components/ProviderEarnings";
import { SubscriptionPage } from "@/components/SubscriptionPage";
import { ProviderProfileEditor } from "@/components/ProviderProfileEditor";

interface ProviderTabContentProps {
  activeTab: string;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  mockTasks: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    location: string;
    timeAgo: string;
    taskerCount: number;
    urgency: string;
  }>;
}

export const ProviderTabContent = ({ 
  activeTab, 
  selectedCategory, 
  setSelectedCategory, 
  mockTasks 
}: ProviderTabContentProps) => {
  switch (activeTab) {
    case 'dashboard':
      return (
        <div className="px-4 py-6">
          <ProviderDashboard />
        </div>
      );

    case 'jobs':
      return (
        <div className="px-4 py-6">
          <JobBoard mockTasks={mockTasks} />
        </div>
      );
    
    case 'earnings':
      return (
        <div className="px-4 py-6">
          <ProviderEarnings />
        </div>
      );
    
    case 'subscription':
      return (
        <div className="px-4 py-6">
          <SubscriptionPage />
        </div>
      );
    
    case 'profile':
      return (
        <div className="px-4 py-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
          <ProviderProfileEditor />
        </div>
      );
    
    default:
      return (
        <HomeTabContent 
          userRole="handyman"
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          mockTasks={mockTasks}
        />
      );
  }
};
