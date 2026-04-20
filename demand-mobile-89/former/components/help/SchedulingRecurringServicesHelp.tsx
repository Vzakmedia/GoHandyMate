import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const SchedulingRecurringServicesHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Scheduling Recurring Services</h1>
          <p className="text-gray-600 mt-2">Set up automated maintenance schedules for your properties</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Setting Up Recurring Services</CardTitle>
            <CardDescription>How to create automated service schedules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Step 1: Access Service Management</h4>
              <p className="text-gray-600">Navigate to Properties → Select Property → Service Management</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Step 2: Create Recurring Schedule</h4>
              <p className="text-gray-600">Click "Add Recurring Service" and select service type</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Step 3: Set Frequency</h4>
              <p className="text-gray-600">Choose monthly, quarterly, or annual schedules</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Step 4: Assign Technicians</h4>
              <p className="text-gray-600">Select preferred service providers for each service type</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Recurring Services</CardTitle>
            <CardDescription>Recommended maintenance schedules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Monthly Services</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• HVAC filter changes</li>
                  <li>• Common area cleaning</li>
                  <li>• Landscape maintenance</li>
                  <li>• Pool maintenance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Quarterly Services</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• HVAC system inspection</li>
                  <li>• Gutter cleaning</li>
                  <li>• Pest control</li>
                  <li>• Fire safety inspections</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">Do</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✓ Set up seasonal schedules</li>
                  <li>✓ Include buffer time for scheduling</li>
                  <li>✓ Notify tenants in advance</li>
                  <li>✓ Track service completion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">Don't</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>✗ Schedule services too frequently</li>
                  <li>✗ Forget to update contact information</li>
                  <li>✗ Skip service confirmations</li>
                  <li>✗ Ignore seasonal adjustments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600">Contact our support team for personalized assistance with service scheduling.</p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/help/emergency-procedures')}>Emergency Procedures</Button>
                <Button variant="outline" onClick={() => navigate('/help/managing-units')}>Managing Units</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};