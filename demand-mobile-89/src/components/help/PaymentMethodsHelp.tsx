import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Smartphone, Building, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PaymentMethodsHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Support
        </Button>
        <h1 className="text-3xl font-bold">Payment Methods</h1>
        <p className="text-gray-600 mt-2">All available payment options and how to manage them</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Payment Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold">Credit/Debit Cards</h4>
                <p className="text-sm text-gray-600 mt-1">Visa, MasterCard, American Express</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Building className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-semibold">ACH Transfer</h4>
                <p className="text-sm text-gray-600 mt-1">Direct bank account transfer</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Smartphone className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold">Digital Wallets</h4>
                <p className="text-sm text-gray-600 mt-1">Apple Pay, Google Pay</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h4 className="font-semibold">Wire Transfer</h4>
                <p className="text-sm text-gray-600 mt-1">For large payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adding Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold flex items-center mb-3">
                  <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                  Credit/Debit Cards
                </h4>
                <ol className="list-decimal list-inside text-sm space-y-2">
                  <li>Go to Account Settings → Payment Methods</li>
                  <li>Click "Add Credit Card"</li>
                  <li>Enter card details securely</li>
                  <li>Verify with billing address</li>
                  <li>Set as primary or backup method</li>
                </ol>
                <div className="mt-3 p-3 bg-green-50 rounded text-sm">
                  <strong>Supported:</strong> Visa, MasterCard, American Express, Discover
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold flex items-center mb-3">
                  <Building className="w-5 h-5 mr-2 text-green-600" />
                  ACH Bank Transfer
                </h4>
                <ol className="list-decimal list-inside text-sm space-y-2">
                  <li>Select "Add Bank Account"</li>
                  <li>Enter routing and account numbers</li>
                  <li>Verify account ownership (micro-deposits)</li>
                  <li>Confirm verification amounts</li>
                  <li>Account ready for use in 1-2 business days</li>
                </ol>
                <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                  <strong>Benefits:</strong> Lower fees, direct transfer, higher limits
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Processing Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Payment Method</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Processing Fee</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Processing Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">ACH Bank Transfer</td>
                      <td className="border border-gray-300 px-4 py-2 text-green-600">Free</td>
                      <td className="border border-gray-300 px-4 py-2">1-3 business days</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Debit Card</td>
                      <td className="border border-gray-300 px-4 py-2">2.9% + $0.30</td>
                      <td className="border border-gray-300 px-4 py-2">Instant</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Credit Card</td>
                      <td className="border border-gray-300 px-4 py-2">2.9% + $0.30</td>
                      <td className="border border-gray-300 px-4 py-2">Instant</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Wire Transfer</td>
                      <td className="border border-gray-300 px-4 py-2">$25 flat fee</td>
                      <td className="border border-gray-300 px-4 py-2">Same day</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-gray-600">
                *Fees may vary based on payment amount and account type. Volume discounts available for enterprise accounts.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auto-Pay Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Set up automatic payments to ensure invoices are paid on time without manual intervention.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Configuration Steps</h4>
                <ol className="list-decimal list-inside text-sm space-y-2">
                  <li>Choose primary payment method</li>
                  <li>Set payment schedule (due date - X days)</li>
                  <li>Configure spending limits</li>
                  <li>Add backup payment method</li>
                  <li>Set notification preferences</li>
                  <li>Review and activate</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Safety Features</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Daily/monthly spending limits</li>
                  <li>Automatic retry with backup method</li>
                  <li>Email notifications for all transactions</li>
                  <li>Easy pause/resume functionality</li>
                  <li>Detailed transaction history</li>
                  <li>Instant alerts for failed payments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Security Measures</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>PCI DSS Level 1 compliance</li>
                  <li>256-bit SSL encryption</li>
                  <li>Tokenized payment data</li>
                  <li>Two-factor authentication</li>
                  <li>Regular security audits</li>
                  <li>Fraud monitoring systems</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Your Data Protection</h4>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>No storage of full card numbers</li>
                  <li>Encrypted database storage</li>
                  <li>Access logging and monitoring</li>
                  <li>SOC 2 Type II certified</li>
                  <li>GDPR and CCPA compliant</li>
                  <li>Regular backup and recovery testing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Payment Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold">Payment Declined</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Check card limits, expiration date, billing address match. Contact your bank if issues persist.
                </p>
              </div>
              
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold">Insufficient Funds</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Ensure adequate account balance. Consider switching to a backup payment method or adding funds.
                </p>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Processing Delays</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Bank transfers may take 1-3 business days. Check your payment history for status updates.
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Need Help?</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Contact our billing support team for assistance with payment issues or account setup.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-green-800 mb-2">Payment Best Practices</h4>
            <ul className="text-green-700 text-sm space-y-2">
              <li>• Use ACH transfers for lower fees on regular payments</li>
              <li>• Set up auto-pay to avoid late fees and ensure timely payment</li>
              <li>• Keep multiple payment methods on file as backups</li>
              <li>• Monitor payment notifications and account statements regularly</li>
              <li>• Update payment information before cards expire</li>
              <li>• Take advantage of early payment discounts when available</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};