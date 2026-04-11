
import { PropertyRegistration } from "@/components/PropertyRegistration";
import { BulkServiceRequest } from "@/components/BulkServiceRequest";
import { TaskAssignment } from "@/components/TaskAssignment";
import { PropertyJobTracking } from "@/components/PropertyJobTracking";
import { BulkBilling } from "@/components/BulkBilling";
import { MaintenanceScheduler } from "@/components/MaintenanceScheduler";
import { PropertyManagerSupport } from "@/components/PropertyManagerSupport";
import { PropertyManagerProfile } from "@/components/property/PropertyManagerProfile";
import { PropertyManagerJobsPage } from "@/components/property/PropertyManagerJobsPage";
import { PropertyManagerDashboard } from "@/components/property/dashboard/PropertyManagerDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, AlertTriangle, DollarSign } from "lucide-react";

interface PropertyManagerTabContentProps {
  activeTab: string;
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

export const PropertyManagerTabContent = ({ 
  activeTab, 
  mockTasks 
}: PropertyManagerTabContentProps) => {
  switch (activeTab) {
    case 'properties':
      return <PropertyManagerDashboard />;
    
    case 'jobs':
      return <PropertyManagerJobsPage />;
    
    case 'analytics':
      return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <PropertyJobTracking />
        </div>
      );
    
    case 'profile':
      return <PropertyManagerProfile />;
    
    default:
      return (
        <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">Property Manager Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and service requests efficiently</p>
          </div>
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Properties</h3>
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-sm text-primary/70">Total Properties</p>
                  </div>
                  <Building className="w-8 h-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-700 mb-1">Units</h3>
                    <p className="text-2xl font-bold text-green-700">156</p>
                    <p className="text-sm text-green-600">Total Units</p>
                  </div>
                  <Home className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-orange-700 mb-1">Active Jobs</h3>
                    <p className="text-2xl font-bold text-orange-700">8</p>
                    <p className="text-sm text-orange-600">In Progress</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-purple-700 mb-1">Monthly Cost</h3>
                    <p className="text-2xl font-bold text-purple-700">$12.4K</p>
                    <p className="text-sm text-purple-600">This Month</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Sections */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bulk Service Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <BulkServiceRequest />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Task Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskAssignment />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <BulkBilling />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Scheduler</CardTitle>
                </CardHeader>
                <CardContent>
                  <MaintenanceScheduler />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Support Section */}
          <Card>
            <CardHeader>
              <CardTitle>Support & Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyManagerSupport />
            </CardContent>
          </Card>
        </div>
      );
  }
};
