import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, DollarSign, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UnderstandingInvoicesHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Understanding Invoices</h1>
        <p className="text-gray-600 mt-2">Complete guide to reading and managing your service invoices</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Invoice Components
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3">Every invoice contains:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-blue-700">Header Information</h5>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Invoice number and date</li>
                    <li>Service provider details</li>
                    <li>Property and unit information</li>
                    <li>Service date and time</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-green-700">Service Details</h5>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                    <li>Description of work performed</li>
                    <li>Materials used</li>
                    <li>Labor hours and rates</li>
                    <li>Total cost breakdown</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Cost Breakdown Explained
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Labor Costs</h4>
                <p className="text-sm text-gray-600 mb-2">Charges for technician time and expertise</p>
                <div className="bg-blue-50 p-3 rounded text-sm">
                  <strong>Example:</strong> 2 hours × $75/hour = $150
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Materials & Parts</h4>
                <p className="text-sm text-gray-600 mb-2">Cost of replacement parts and supplies</p>
                <div className="bg-green-50 p-3 rounded text-sm">
                  <strong>Example:</strong> Faucet cartridge ($25) + Sealant ($8) = $33
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Service Fees</h4>
                <p className="text-sm text-gray-600 mb-2">Trip charges, diagnostic fees, or emergency surcharges</p>
                <div className="bg-orange-50 p-3 rounded text-sm">
                  <strong>Example:</strong> Emergency call fee: $50
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Payment Terms & Due Dates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-700">Net 15</h4>
                <p className="text-sm text-gray-600">Payment due within 15 days</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-700">Net 30</h4>
                <p className="text-sm text-gray-600">Standard 30-day payment terms</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-700">Due on Receipt</h4>
                <p className="text-sm text-gray-600">Immediate payment required</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Late Payment Policy</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Invoices not paid within the specified terms may incur late fees. 
                    Contact us immediately if you're experiencing payment difficulties.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Invoice Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Why are there different rates for emergency work?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Emergency services outside normal business hours typically include surcharges 
                  due to immediate response requirements and after-hours availability.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">What's included in the trip charge?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Trip charges cover the technician's travel time, vehicle costs, and basic 
                  diagnostic time. This ensures fair compensation for service calls.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold">Can I get an estimate before work begins?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Yes! For non-emergency work, technicians can provide estimates. Emergency 
                  repairs may proceed immediately for safety reasons.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">What if I disagree with charges?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Contact our billing department within 10 days of receiving the invoice. 
                  We'll review the charges and work with you to resolve any discrepancies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Accepted Payment Options</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Credit/Debit Cards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">ACH Bank Transfer</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Online Portal</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Check by Mail</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Payment Features</h4>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Auto-pay Setup</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Payment Reminders</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Digital Receipts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Payment History</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-green-800 mb-2">Money-Saving Tips</h4>
            <ul className="text-green-700 text-sm space-y-2">
              <li>• Schedule non-emergency work during regular business hours</li>
              <li>• Bundle multiple small repairs into one service call</li>
              <li>• Keep up with regular maintenance to prevent costly emergency repairs</li>
              <li>• Take advantage of bulk service discounts for multiple properties</li>
              <li>• Review invoices promptly and pay early for any available discounts</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};