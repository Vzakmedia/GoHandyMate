
import { QuickStatsGrid } from "./QuickStatsGrid";
import { RecentServiceRequests } from "./RecentServiceRequests";
import { DashboardTools } from "./DashboardTools";

export const PropertyManagerDashboard = () => {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Dashboard Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Property Manager Dashboard</h1>
        <p className="text-gray-600">Comprehensive property management at your fingertips</p>
      </div>
      
      {/* Quick Stats Grid */}
      <QuickStatsGrid />

      {/* Dashboard Tools */}
      <DashboardTools />

      {/* Recent Service Requests */}
      <RecentServiceRequests />
    </div>
  );
};
