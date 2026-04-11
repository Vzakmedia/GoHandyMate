import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle, Phone, Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmergencyProceduresHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Emergency Procedures</h1>
        <p className="text-gray-600 mt-2">Critical emergency response procedures for property managers</p>
      </div>

      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Life-Threatening Emergencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-red-100 rounded-lg">
              <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-red-800 mb-2">CALL 911 FIRST</h3>
              <p className="text-red-700">
                For fires, medical emergencies, gas leaks, electrical hazards, or any immediate threat to life and safety
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Emergency Response Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                <div>
                  <h4 className="font-semibold text-red-800">Life Safety (Call 911)</h4>
                  <p className="text-sm text-red-700">Fire, medical emergency, gas leak, electrical hazard</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                <div>
                  <h4 className="font-semibold text-orange-800">Property Protection</h4>
                  <p className="text-sm text-orange-700">Major water leaks, structural damage, security breaches</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                <div>
                  <h4 className="font-semibold text-yellow-800">Tenant Safety & Comfort</h4>
                  <p className="text-sm text-yellow-700">No heat/AC in extreme weather, major plumbing issues</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Emergency Situations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold flex items-center text-red-700 mb-2">
                    <Flame className="w-5 h-5 mr-2" />
                    Fire Emergency
                  </h4>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li className="font-medium">Call 911 immediately</li>
                    <li>Evacuate building if safe to do so</li>
                    <li>Account for all residents</li>
                    <li>Do not re-enter until cleared by fire department</li>
                    <li>Contact insurance company</li>
                    <li>Arrange temporary housing for displaced tenants</li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-blue-700 mb-2">Major Water Leak</h4>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Shut off main water supply if accessible</li>
                    <li>Call emergency plumber: <strong>1-800-PLUMBER</strong></li>
                    <li>Move valuables away from water</li>
                    <li>Document damage with photos</li>
                    <li>Contact insurance within 24 hours</li>
                    <li>Arrange water extraction services</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-700 mb-2">Power Outage</h4>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Check if outage is building-wide or local</li>
                    <li>Contact utility company to report</li>
                    <li>Ensure emergency lighting is working</li>
                    <li>Check on elderly or vulnerable tenants</li>
                    <li>If extended, arrange generator or temporary power</li>
                    <li>Update tenants on estimated restoration</li>
                  </ol>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-green-700 mb-2">Security Breach</h4>
                  <ol className="list-decimal list-inside text-sm space-y-1">
                    <li>Assess immediate safety threats</li>
                    <li>Call police if criminal activity suspected</li>
                    <li>Secure compromised entry points</li>
                    <li>Review security camera footage</li>
                    <li>Change locks if keys were compromised</li>
                    <li>File incident report with authorities</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Life Safety</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Emergency Services:</span>
                    <span className="font-bold text-red-600">911</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Poison Control:</span>
                    <span className="font-mono">1-800-222-1222</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gas Emergency:</span>
                    <span className="font-mono">1-800-GAS-LEAK</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">24/7 Service Providers</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Emergency Plumber:</span>
                    <span className="font-mono">1-800-PLUMBER</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency Electrician:</span>
                    <span className="font-mono">1-800-ELECTRIC</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Locksmith:</span>
                    <span className="font-mono">1-800-LOCKOUT</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Preparedness Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Property Preparation</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Maintain updated emergency contact lists</li>
                  <li>Post emergency procedures in common areas</li>
                  <li>Test smoke and carbon monoxide detectors monthly</li>
                  <li>Inspect fire extinguishers quarterly</li>
                  <li>Keep master keys and utility shutoffs accessible</li>
                  <li>Maintain emergency lighting systems</li>
                  <li>Document all safety equipment locations</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Communication Plan</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Establish tenant emergency notification system</li>
                  <li>Create emergency contact tree</li>
                  <li>Set up automated emergency messaging</li>
                  <li>Maintain updated tenant contact information</li>
                  <li>Coordinate with local emergency services</li>
                  <li>Plan for multi-language communication</li>
                  <li>Prepare templates for common emergencies</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>After Emergency Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <h4 className="font-semibold">Recovery Steps</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li><strong>Document Everything</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Take photos and videos of all damage</li>
                  <li>Keep detailed records of response actions</li>
                  <li>Save all receipts for emergency services</li>
                </ul>
              </li>
              <li><strong>Insurance Claims</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Contact insurance company within 24-48 hours</li>
                  <li>Provide thorough documentation</li>
                  <li>Coordinate with adjusters and contractors</li>
                </ul>
              </li>
              <li><strong>Tenant Communication</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Keep tenants informed of recovery timeline</li>
                  <li>Arrange temporary accommodations if needed</li>
                  <li>Address concerns about ongoing safety</li>
                </ul>
              </li>
              <li><strong>Prevention Review</strong>
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>Analyze what caused the emergency</li>
                  <li>Implement measures to prevent recurrence</li>
                  <li>Update emergency procedures as needed</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-red-800 mb-2">Remember</h4>
            <ul className="text-red-700 text-sm space-y-2">
              <li>• Life safety always comes first - when in doubt, call 911</li>
              <li>• Never attempt repairs on gas, electrical, or structural issues during emergencies</li>
              <li>• Keep emergency contact information easily accessible at all times</li>
              <li>• Document everything for insurance and liability protection</li>
              <li>• Regular training and preparation can save lives and property</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};