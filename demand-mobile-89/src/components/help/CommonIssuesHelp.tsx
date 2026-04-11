import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const CommonIssuesHelp = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Common Issues & Solutions</h1>
          <p className="text-gray-600 mt-2">Quick fixes for frequently encountered problems</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Request Issues</CardTitle>
            <CardDescription>Problems with creating and managing service requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Can't create service request</h4>
              <p className="text-gray-600">Solution: Check if property information is complete and you have proper permissions</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Technician not responding</h4>
              <p className="text-gray-600">Solution: Use the platform's reminder feature or reassign to another technician</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Incorrect pricing estimates</h4>
              <p className="text-gray-600">Solution: Request detailed breakdown and compare with market rates</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Management Issues</CardTitle>
            <CardDescription>Common problems with property and unit management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Can't add new property</h4>
              <p className="text-gray-600">Solution: Ensure all required fields are filled and address is valid</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Unit information not updating</h4>
              <p className="text-gray-600">Solution: Clear browser cache and try again, or contact support</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Tenant notifications not working</h4>
              <p className="text-gray-600">Solution: Verify tenant contact information and notification preferences</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing & Payment Issues</CardTitle>
            <CardDescription>Resolving invoice and payment problems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Invoice discrepancies</h4>
              <p className="text-gray-600">Solution: Compare invoice with original service estimate and contact billing support</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Payment method declined</h4>
              <p className="text-gray-600">Solution: Update payment information and ensure sufficient funds/credit</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Missing invoice history</h4>
              <p className="text-gray-600">Solution: Check date filters and download from billing section</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Navigation Issues</CardTitle>
            <CardDescription>Getting around the platform effectively</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Can't find specific feature</h4>
              <p className="text-gray-600">Solution: Use the search function or check the main navigation menu</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Page loading slowly</h4>
              <p className="text-gray-600">Solution: Check internet connection and clear browser cache</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Data not syncing</h4>
              <p className="text-gray-600">Solution: Refresh the page and ensure stable internet connection</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">Before contacting support, try:</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Clear your browser cache and cookies</li>
                <li>2. Try using a different browser or incognito mode</li>
                <li>3. Check your internet connection</li>
                <li>4. Log out and log back in</li>
                <li>5. Disable browser extensions temporarily</li>
                <li>6. Try accessing from a different device</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600">If these solutions don't resolve your issue, our support team is here to help.</p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/help/account-problems')}>Account Problems</Button>
                <Button variant="outline" onClick={() => navigate('/help/technical-support')}>Technical Support</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};