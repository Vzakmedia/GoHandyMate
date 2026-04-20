
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyRegistration } from "@/components/PropertyRegistration";
import { BulkServiceRequest } from "@/components/BulkServiceRequest";
import { TaskAssignment } from "@/components/TaskAssignment";
import { BulkBilling } from "@/components/BulkBilling";
import { MaintenanceScheduler } from "@/components/MaintenanceScheduler";
import { PropertyManagerSupport } from "@/components/PropertyManagerSupport";
import { Building, Calendar, Users, DollarSign } from "lucide-react";

export const DashboardTools = () => {
  return (
    <>
      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Management Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                Property Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PropertyRegistration />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BulkServiceRequest />
            </CardContent>
          </Card>
        </div>

        {/* Operations Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Task Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskAssignment />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-orange-600" />
                Financial Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BulkBilling />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Scheduler</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenanceScheduler />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <PropertyManagerSupport />
          </CardContent>
        </Card>
      </div>
    </>
  );
};
