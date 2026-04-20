import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wrench, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RequestingServicesHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Requesting Services</h1>
        <p className="text-gray-600 mt-2">How to request maintenance and repair services for your properties</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="w-5 h-5 mr-2" />
              Types of Service Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <h4 className="font-semibold text-red-700">Emergency</h4>
                <p className="text-sm text-gray-600">24/7 urgent repairs</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-semibold text-orange-700">Urgent</h4>
                <p className="text-sm text-gray-600">Same/next day service</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Wrench className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-700">Standard</h4>
                <p className="text-sm text-gray-600">Regular maintenance</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-green-700">Scheduled</h4>
                <p className="text-sm text-gray-600">Planned maintenance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Submit a Service Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li><strong>Navigate to Service Requests</strong>
                <p className="text-sm text-gray-600 ml-6">Go to your property dashboard and select "Service Requests" or "Maintenance"</p>
              </li>
              <li><strong>Choose Request Type</strong>
                <p className="text-sm text-gray-600 ml-6">Select the appropriate category (plumbing, electrical, HVAC, etc.)</p>
              </li>
              <li><strong>Fill Out Request Details</strong>
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-sm">
                  <li>Property and unit information</li>
                  <li>Detailed problem description</li>
                  <li>Urgency level</li>
                  <li>Preferred appointment time</li>
                  <li>Special access instructions</li>
                </ul>
              </li>
              <li><strong>Attach Photos or Documents</strong>
                <p className="text-sm text-gray-600 ml-6">Upload photos of the issue to help technicians prepare</p>
              </li>
              <li><strong>Submit and Track</strong>
                <p className="text-sm text-gray-600 ml-6">Submit your request and track progress in real-time</p>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Common Services</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium">Plumbing</h5>
                    <p className="text-sm text-gray-600">Leaks, clogs, fixtures, water heaters</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Electrical</h5>
                    <p className="text-sm text-gray-600">Outlets, lighting, circuit issues</p>
                  </div>
                  <div>
                    <h5 className="font-medium">HVAC</h5>
                    <p className="text-sm text-gray-600">Heating, cooling, ventilation</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Appliances</h5>
                    <p className="text-sm text-gray-600">Repair and replacement</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Specialized Services</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium">Cleaning</h5>
                    <p className="text-sm text-gray-600">Deep cleaning, carpet cleaning</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Landscaping</h5>
                    <p className="text-sm text-gray-600">Lawn care, tree service</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Security</h5>
                    <p className="text-sm text-gray-600">Lock changes, security systems</p>
                  </div>
                  <div>
                    <h5 className="font-medium">General Maintenance</h5>
                    <p className="text-sm text-gray-600">Painting, repairs, installations</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency vs. Non-Emergency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold text-red-700 mb-2">Emergency Situations</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Water leaks causing damage</li>
                  <li>No heat in winter (below 32°F)</li>
                  <li>No air conditioning (above 85°F)</li>
                  <li>Electrical hazards or outages</li>
                  <li>Gas leaks</li>
                  <li>Security issues (broken locks)</li>
                  <li>Sewage backups</li>
                </ul>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-700 mb-2">Non-Emergency Issues</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Minor plumbing issues</li>
                  <li>Cosmetic repairs</li>
                  <li>Appliance maintenance</li>
                  <li>Routine cleaning</li>
                  <li>Landscaping needs</li>
                  <li>Non-essential lighting</li>
                  <li>Scheduled maintenance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tracking Your Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h5 className="font-medium">Submitted</h5>
                  <p className="text-sm text-gray-600">Request received and being reviewed</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium">Assigned</h5>
                  <p className="text-sm text-gray-600">Technician assigned and contacted</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h5 className="font-medium">Completed</h5>
                  <p className="text-sm text-gray-600">Work finished and ready for review</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-800 mb-2">Best Practices</h4>
            <ul className="text-blue-700 text-sm space-y-2">
              <li>• Provide detailed descriptions and photos when possible</li>
              <li>• Respond promptly to technician communications</li>
              <li>• Ensure easy property access for service providers</li>
              <li>• Keep records of all maintenance for warranty purposes</li>
              <li>• Schedule non-emergency work during business hours when possible</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};