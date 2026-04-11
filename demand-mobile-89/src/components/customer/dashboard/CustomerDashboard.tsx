import { useState } from "react";
import { useAuth } from '@/features/auth';
import { CustomerDashboardHeader } from "./CustomerDashboardHeader";
import { CustomerBookingWidget } from "./CustomerBookingWidget";
import { CustomerQuickActions } from "./CustomerQuickActions";
import { CustomerRecommendedPros } from "./CustomerRecommendedPros";
import { PropertyManagerUpgradePrompt } from "@/components/customer/PropertyManagerUpgradePrompt";
import { useCustomerUpgrade } from "@/hooks/useCustomerUpgrade";

interface MockTask {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  location: string;
  timeAgo: string;
  taskerCount: number;
  urgency: string;
}

interface CustomerDashboardProps {
  onTabChange: (tab: string) => void;
  mockTasks: MockTask[];
}

export const CustomerDashboard = ({ onTabChange, mockTasks }: CustomerDashboardProps) => {
  const { profile } = useAuth();
  const { isUpgraded } = useCustomerUpgrade();

  return (
    <div className="space-y-8 pb-20 lg:pb-6 animate-fade-in text-slate-900">
      <CustomerDashboardHeader profileName={profile?.full_name} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <CustomerQuickActions onTabChange={onTabChange} />
          
          <CustomerBookingWidget mockTasks={mockTasks} onTabChange={onTabChange} />
        </div>
        
        {/* Right Column - Sidebar Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
          <CustomerRecommendedPros />
          
          {!isUpgraded && (
            <div className="mt-4">
              <PropertyManagerUpgradePrompt compact />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
