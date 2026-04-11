import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const WorkingWithTechniciansHelp = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Working with Technicians</h1>
          <p className="text-gray-600 mt-2">Best practices for managing service providers and contractors</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Finding & Vetting Technicians</CardTitle>
            <CardDescription>How to select qualified service providers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Screening Process</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Verify licenses and insurance</li>
                <li>• Check references and reviews</li>
                <li>• Confirm availability and response times</li>
                <li>• Review pricing and service agreements</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Platform Integration</h4>
              <p className="text-gray-600">Use our verified technician network for pre-screened professionals</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Communication Guidelines</CardTitle>
            <CardDescription>Effective communication with service providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Before Service</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Provide detailed job descriptions</li>
                  <li>• Share property access information</li>
                  <li>• Set clear expectations and timelines</li>
                  <li>• Confirm scheduling and contact details</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">During Service</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Monitor progress through the platform</li>
                  <li>• Respond to questions promptly</li>
                  <li>• Document any changes or issues</li>
                  <li>• Maintain professional communication</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managing Service Quality</CardTitle>
            <CardDescription>Ensuring high-quality work and tenant satisfaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Quality Control</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Request photos of completed work</li>
                <li>• Follow up with tenants for feedback</li>
                <li>• Review service reports and invoices</li>
                <li>• Rate technicians after job completion</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Issue Resolution</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Address concerns immediately</li>
                <li>• Document all communications</li>
                <li>• Use platform's dispute resolution</li>
                <li>• Maintain professional relationships</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Building Long-term Relationships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">Preferred Vendor Program</h4>
              <p className="text-gray-600">Create a network of trusted technicians for consistent service quality</p>
              <ul className="space-y-1 text-sm text-gray-600 mt-2">
                <li>• Negotiate volume discounts</li>
                <li>• Establish priority response times</li>
                <li>• Streamline approval processes</li>
                <li>• Regular performance reviews</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600">Get assistance with technician management and service quality issues.</p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/help/requesting-services')}>Requesting Services</Button>
                <Button variant="outline" onClick={() => navigate('/help/emergency-procedures')}>Emergency Procedures</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};