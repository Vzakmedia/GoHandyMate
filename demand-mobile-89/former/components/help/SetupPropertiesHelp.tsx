import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, MapPin, Users, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SetupPropertiesHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Setting Up Your Properties</h1>
        <p className="text-gray-600 mt-2">Complete guide to adding and configuring properties in your account</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Adding a New Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-3">
              <li>Navigate to the <strong>Properties</strong> section in your dashboard</li>
              <li>Click the <strong>"Add Property"</strong> button</li>
              <li>Fill in the basic property information:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>Property name</li>
                  <li>Complete address</li>
                  <li>Property type (apartment, house, commercial)</li>
                  <li>Year built</li>
                </ul>
              </li>
              <li>Upload property photos and documents</li>
              <li>Click <strong>"Save Property"</strong> to complete the setup</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Property Details & Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Essential Information to Include:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium">Basic Details</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Square footage</li>
                  <li>Number of floors</li>
                  <li>Parking availability</li>
                  <li>Amenities</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium">Utilities</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Water service provider</li>
                  <li>Electric company</li>
                  <li>Gas provider</li>
                  <li>Internet/Cable options</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Setting Up Units
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>After adding your property, you'll need to create individual units:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Go to your property details page</li>
              <li>Click <strong>"Manage Units"</strong></li>
              <li>Add each unit with:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Unit number/identifier</li>
                  <li>Bedrooms and bathrooms</li>
                  <li>Square footage</li>
                  <li>Monthly rent amount</li>
                  <li>Special features or notes</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="w-5 h-5 mr-2" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium text-green-700 mb-2">✓ Do</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Use clear, consistent naming</li>
                  <li>Upload high-quality photos</li>
                  <li>Keep property information updated</li>
                  <li>Set up emergency contacts</li>
                  <li>Document any special requirements</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-red-700 mb-2">✗ Don't</h5>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Skip required fields</li>
                  <li>Use abbreviations that aren't clear</li>
                  <li>Forget to verify address accuracy</li>
                  <li>Leave utility information blank</li>
                  <li>Upload blurry or outdated photos</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-800 mb-2">Need Help?</h4>
            <p className="text-blue-700 text-sm mb-4">
              Our team is here to help you get your properties set up correctly. Contact us if you need assistance with any step of the process.
            </p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => navigate('/help/requesting-services')}>
                Learn About Services →
              </Button>
              <Button variant="outline" onClick={() => navigate('/help/managing-units')}>
                Managing Units →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};