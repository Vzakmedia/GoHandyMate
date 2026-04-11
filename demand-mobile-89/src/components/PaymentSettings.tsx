
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CreditCard, 
  Landmark, 
  Smartphone, 
  Settings, 
  Shield,
  CheckCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

export const PaymentSettings = () => {
  const [autoInvoicing, setAutoInvoicing] = useState(true);
  const [lateFeesEnabled, setLateFeesEnabled] = useState(true);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);

  // Mock payment methods
  const paymentMethods = [
    {
      id: 1,
      type: "bank_account",
      name: "Business Checking",
      details: "****1234",
      isDefault: true,
      fees: "0.5%",
      processingTime: "1-2 business days"
    },
    {
      id: 2,
      type: "credit_card",
      name: "Credit Card Processing",
      details: "Stripe Integration",
      isDefault: false,
      fees: "2.9% + $0.30",
      processingTime: "Instant"
    },
    {
      id: 3,
      type: "digital_wallet",
      name: "Digital Payments",
      details: "PayPal, Apple Pay, Google Pay",
      isDefault: false,
      fees: "3.5%",
      processingTime: "Instant"
    }
  ];

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'bank_account':
        return <Landmark className="w-5 h-5" />;
      case 'credit_card':
        return <CreditCard className="w-5 h-5" />;
      case 'digital_wallet':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Payment Settings</h2>
        <Button onClick={() => setShowAddPaymentMethod(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </Button>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  {getPaymentIcon(method.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold">{method.name}</h4>
                    {method.isDefault && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{method.details}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>Fees: {method.fees}</span>
                    <span>Processing: {method.processingTime}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="paymentTerms">Default Payment Terms</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="net15">Net 15 days</SelectItem>
                    <SelectItem value="net30">Net 30 days</SelectItem>
                    <SelectItem value="net45">Net 45 days</SelectItem>
                    <SelectItem value="due_on_receipt">Due on receipt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="depositPercentage">Default Deposit Percentage</Label>
                <Input id="depositPercentage" type="number" placeholder="25" />
              </div>
              
              <div>
                <Label htmlFor="lateFeePercentage">Late Fee Percentage</Label>
                <Input id="lateFeePercentage" type="number" placeholder="1.5" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoInvoicing">Automatic Invoicing</Label>
                  <p className="text-sm text-gray-600">Send invoices automatically on milestones</p>
                </div>
                <Switch
                  id="autoInvoicing"
                  checked={autoInvoicing}
                  onCheckedChange={setAutoInvoicing}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="lateFees">Late Fees</Label>
                  <p className="text-sm text-gray-600">Automatically apply late fees</p>
                </div>
                <Switch
                  id="lateFees"
                  checked={lateFeesEnabled}
                  onCheckedChange={setLateFeesEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminders">Payment Reminders</Label>
                  <p className="text-sm text-gray-600">Send automatic payment reminders</p>
                </div>
                <Switch id="reminders" defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Security & Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">PCI DSS Compliant</p>
                  <p className="text-sm text-green-600">Credit card data is securely processed</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Bank-Level Encryption</p>
                  <p className="text-sm text-green-600">All transactions are encrypted</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Two-Factor Authentication</p>
                  <p className="text-sm text-blue-600">Enabled for payment processing</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Fraud Protection</p>
                  <p className="text-sm text-blue-600">Advanced fraud detection enabled</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Method Form */}
      {showAddPaymentMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentType">Payment Method Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_account">Bank Account (ACH)</SelectItem>
                  <SelectItem value="credit_card">Credit Card Processing</SelectItem>
                  <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="methodName">Method Name</Label>
                <Input id="methodName" placeholder="e.g., Business Checking" />
              </div>
              <div>
                <Label htmlFor="accountDetails">Account Details</Label>
                <Input id="accountDetails" placeholder="Last 4 digits or identifier" />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button>Add Payment Method</Button>
              <Button variant="outline" onClick={() => setShowAddPaymentMethod(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
