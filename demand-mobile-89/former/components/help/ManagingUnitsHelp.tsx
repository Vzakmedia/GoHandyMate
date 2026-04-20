import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Users, Settings, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ManagingUnitsHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Managing Units and Tenants</h1>
        <p className="text-gray-600 mt-2">Everything you need to know about unit and tenant management</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="w-5 h-5 mr-2" />
              Unit Management Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Effective unit management is crucial for maintaining your properties and ensuring tenant satisfaction.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Unit Information</h4>
                <ul className="text-sm space-y-1">
                  <li>• Unit details and features</li>
                  <li>• Rent amounts and terms</li>
                  <li>• Maintenance history</li>
                  <li>• Photos and documents</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Tenant Records</h4>
                <ul className="text-sm space-y-1">
                  <li>• Contact information</li>
                  <li>• Lease agreements</li>
                  <li>• Payment history</li>
                  <li>• Communication logs</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Maintenance</h4>
                <ul className="text-sm space-y-1">
                  <li>• Service requests</li>
                  <li>• Scheduled maintenance</li>
                  <li>• Vendor coordination</li>
                  <li>• Cost tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Adding and Managing Tenants
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Adding a New Tenant</h4>
            <ol className="list-decimal list-inside space-y-2">
              <li>Navigate to the specific unit</li>
              <li>Click <strong>"Add Tenant"</strong></li>
              <li>Enter tenant information:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Full name and contact details</li>
                  <li>Emergency contact information</li>
                  <li>Lease start and end dates</li>
                  <li>Monthly rent amount</li>
                  <li>Security deposit details</li>
                </ul>
              </li>
              <li>Upload lease agreement and required documents</li>
              <li>Set up automatic rent reminders (optional)</li>
            </ol>

            <h4 className="font-semibold mt-6">Managing Existing Tenants</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium">Communication</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Send messages and notices</li>
                  <li>Track communication history</li>
                  <li>Set up automated reminders</li>
                  <li>Handle service requests</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium">Lease Management</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Lease renewal notifications</li>
                  <li>Rent increase documentation</li>
                  <li>Move-out procedures</li>
                  <li>Security deposit handling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Unit Maintenance & Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Regular Maintenance Tasks</h4>
            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h5 className="font-medium">Monthly</h5>
                <p className="text-sm text-gray-600">HVAC filter checks, common area cleaning, safety equipment inspection</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h5 className="font-medium">Quarterly</h5>
                <p className="text-sm text-gray-600">Deep cleaning, appliance maintenance, exterior inspection</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h5 className="font-medium">Annually</h5>
                <p className="text-sm text-gray-600">Full property inspection, safety system testing, major repairs planning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Unit Turnover Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">When a Tenant Moves Out</h4>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Pre-Move Out</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Schedule move-out inspection</li>
                  <li>Provide move-out checklist to tenant</li>
                  <li>Coordinate key return</li>
                </ul>
              </li>
              <li><strong>Move-Out Day</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Conduct final walkthrough</li>
                  <li>Document any damages</li>
                  <li>Calculate security deposit return</li>
                </ul>
              </li>
              <li><strong>Post-Move Out</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Clean and repair unit</li>
                  <li>Update unit listing</li>
                  <li>Begin marketing for new tenant</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-green-800 mb-2">Pro Tips</h4>
            <ul className="text-green-700 text-sm space-y-2">
              <li>• Keep detailed records of all tenant communications</li>
              <li>• Set up automated rent reminders to reduce late payments</li>
              <li>• Conduct regular property inspections to catch issues early</li>
              <li>• Maintain a list of trusted contractors for quick repairs</li>
              <li>• Use digital lease agreements for faster processing</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};