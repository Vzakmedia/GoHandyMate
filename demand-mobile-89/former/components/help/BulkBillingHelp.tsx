import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Calculator, CreditCard, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BulkBillingHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Bulk Billing Setup</h1>
        <p className="text-gray-600 mt-2">Streamline billing across multiple properties and units</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              What is Bulk Billing?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Bulk billing allows property managers to consolidate charges from multiple properties 
              or units into a single invoice, simplifying payment processing and financial management.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">Consolidated Invoicing</h4>
                <p className="text-sm text-gray-600">One invoice for all properties</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold">Single Payment</h4>
                <p className="text-sm text-gray-600">Pay all charges at once</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold">Automated Processing</h4>
                <p className="text-sm text-gray-600">Set up automatic payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setting Up Bulk Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-4">
              <li><strong>Enable Bulk Billing</strong>
                <ul className="list-disc list-inside ml-6 mt-2 text-sm space-y-1">
                  <li>Go to Account Settings → Billing Preferences</li>
                  <li>Select "Enable Bulk Billing"</li>
                  <li>Choose your preferred billing cycle (weekly, monthly, quarterly)</li>
                </ul>
              </li>
              
              <li><strong>Configure Property Groups</strong>
                <ul className="list-disc list-inside ml-6 mt-2 text-sm space-y-1">
                  <li>Group properties by location, type, or management needs</li>
                  <li>Set different billing preferences for each group</li>
                  <li>Assign cost centers or project codes if needed</li>
                </ul>
              </li>
              
              <li><strong>Set Payment Methods</strong>
                <ul className="list-disc list-inside ml-6 mt-2 text-sm space-y-1">
                  <li>Add primary and backup payment methods</li>
                  <li>Configure automatic payment dates</li>
                  <li>Set spending limits and approval workflows</li>
                </ul>
              </li>
              
              <li><strong>Customize Invoice Format</strong>
                <ul className="list-disc list-inside ml-6 mt-2 text-sm space-y-1">
                  <li>Choose detail level (summary vs. itemized)</li>
                  <li>Add your company information and branding</li>
                  <li>Set up email notifications and delivery preferences</li>
                </ul>
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Cycle Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-green-700 mb-2">Weekly Billing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Best for high-volume properties</li>
                  <li>• Better cash flow management</li>
                  <li>• Smaller individual invoices</li>
                  <li>• More frequent processing</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-blue-700 mb-2">Monthly Billing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Most common option</li>
                  <li>• Balanced processing load</li>
                  <li>• Easy budget planning</li>
                  <li>• Standard business practice</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold text-purple-700 mb-2">Quarterly Billing</h4>
                <ul className="text-sm space-y-1">
                  <li>• Minimal processing overhead</li>
                  <li>• Large invoice amounts</li>
                  <li>• Good for stable properties</li>
                  <li>• Seasonal budgeting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invoice Customization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Summary View</h4>
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Property A - Maintenance</span>
                      <span>$1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Property B - Repairs</span>
                      <span>$875</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Property C - Cleaning</span>
                      <span>$400</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>$2,525</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Detailed View</h4>
                <div className="bg-gray-50 p-4 rounded border">
                  <div className="text-sm space-y-2">
                    <div className="font-medium">Property A - Unit 101</div>
                    <div className="ml-4 space-y-1">
                      <div className="flex justify-between">
                        <span>Plumbing repair</span>
                        <span>$850</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parts & materials</span>
                        <span>$400</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">+ itemized breakdown for each property</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Allocation Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">By Property</h4>
                <p className="text-sm text-gray-600">Charges allocated to specific properties for clear cost tracking</p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">By Unit</h4>
                <p className="text-sm text-gray-600">Individual unit charges for detailed expense management</p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold">By Cost Center</h4>
                <p className="text-sm text-gray-600">Organize by department or budget category for enterprise management</p>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">By Project</h4>
                <p className="text-sm text-gray-600">Track costs for specific renovation or maintenance projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Automation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Auto-Pay Setup</h4>
                <ol className="list-decimal list-inside text-sm space-y-2">
                  <li>Link bank account or credit card</li>
                  <li>Set payment date (e.g., 5th of each month)</li>
                  <li>Configure spending limits</li>
                  <li>Set up notification preferences</li>
                  <li>Add backup payment method</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Approval Workflows</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Set spending thresholds for auto-approval</li>
                  <li>Configure manager approval for large amounts</li>
                  <li>Create department-specific approval chains</li>
                  <li>Set up emergency override procedures</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-blue-800 mb-2">Bulk Billing Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Reduced administrative overhead</li>
                <li>• Simplified expense tracking</li>
                <li>• Better cash flow management</li>
                <li>• Automated payment processing</li>
              </ul>
              <ul className="text-blue-700 text-sm space-y-2">
                <li>• Volume discounts eligibility</li>
                <li>• Consolidated reporting</li>
                <li>• Reduced processing fees</li>
                <li>• Enhanced financial control</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};