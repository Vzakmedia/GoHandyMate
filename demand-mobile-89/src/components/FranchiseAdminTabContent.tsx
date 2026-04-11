
import { FranchiseOnboarding } from "@/components/FranchiseOnboarding";
import { TechnicianPerformance } from "@/components/TechnicianPerformance";
import { FinancialReporting } from "@/components/FinancialReporting";
import { MarketingTools } from "@/components/MarketingTools";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { TechnicianRecruiting } from "@/components/TechnicianRecruiting";
import { CRMIntegration } from "@/components/CRMIntegration";

interface FranchiseAdminTabContentProps {
  activeTab: string;
}

export const FranchiseAdminTabContent = ({ activeTab }: FranchiseAdminTabContentProps) => {
  switch (activeTab) {
    case 'overview':
      return (
        <div className="px-4 py-6">
          <AnalyticsDashboard />
        </div>
      );
    
    case 'territories':
      return (
        <div className="px-4 py-6">
          <FranchiseOnboarding />
        </div>
      );
    
    case 'analytics':
      return (
        <div className="px-4 py-6">
          <div className="space-y-8">
            <FinancialReporting />
            <TechnicianPerformance />
          </div>
        </div>
      );
    
    case 'settings':
      return (
        <div className="px-4 py-6">
          <div className="space-y-8">
            <MarketingTools />
            <TechnicianRecruiting />
            <CRMIntegration />
          </div>
        </div>
      );
    
    default:
      return (
        <div className="px-4 py-6 space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Franchise Command Center</h1>
            <p className="text-gray-600">Oversee territories, revenue, and operations across all franchise locations</p>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Total Revenue</h3>
              <p className="text-2xl font-bold text-blue-600 mb-1">$1.2M</p>
              <p className="text-sm text-blue-600">+14.2% vs last month</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">Active Franchises</h3>
              <p className="text-2xl font-bold text-green-600 mb-1">15</p>
              <p className="text-sm text-green-600">3 new this quarter</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">Total Jobs</h3>
              <p className="text-2xl font-bold text-purple-600 mb-1">2,847</p>
              <p className="text-sm text-purple-600">This month</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-800 mb-2">Avg Rating</h3>
              <p className="text-2xl font-bold text-orange-600 mb-1">4.8</p>
              <p className="text-sm text-orange-600">Across all territories</p>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Territory Management</h3>
              <p className="text-gray-600 mb-4">Manage franchise regions, onboard new territories, and oversee regional performance.</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>12 territories managed</span>
                <span>3 pending approval</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Financial Reporting</h3>
              <p className="text-gray-600 mb-4">Track royalties, revenue streams, and generate comprehensive financial reports.</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>$127K royalties collected</span>
                <span>10.2% commission rate</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Marketing Tools</h3>
              <p className="text-gray-600 mb-4">Create targeted campaigns, manage promotions, and track marketing performance.</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>5 active campaigns</span>
                <span>3.8x avg ROAS</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Technician Network</h3>
              <p className="text-gray-600 mb-4">Recruit, screen, and manage technicians across all franchise locations.</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>156 active technicians</span>
                <span>24 applications pending</span>
              </div>
            </div>
          </div>
        </div>
      );
  }
};
