import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AccountProblemsHelp = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Account Problems</h1>
          <p className="text-gray-600 mt-2">Resolve login, access, and account management issues</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login & Access Issues</CardTitle>
            <CardDescription>Solutions for common authentication problems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Forgot Password</h4>
              <p className="text-gray-600">Click "Forgot Password" on login page and check your email for reset instructions</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Account Locked</h4>
              <p className="text-gray-600">Wait 15 minutes after multiple failed attempts or contact support for immediate unlock</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Email Not Verified</h4>
              <p className="text-gray-600">Check spam folder for verification email or request a new verification link</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Two-Factor Authentication Issues</h4>
              <p className="text-gray-600">Use backup codes or contact support to reset 2FA settings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile & Settings</CardTitle>
            <CardDescription>Managing your account information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Update Contact Information</h4>
              <p className="text-gray-600">Go to Profile Settings → Contact Info → Update fields → Save changes</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Change Email Address</h4>
              <p className="text-gray-600">Email changes require verification. Check both old and new email addresses</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Notification Preferences</h4>
              <p className="text-gray-600">Customize email, SMS, and push notification settings in Account Preferences</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission & Access Control</CardTitle>
            <CardDescription>Managing user roles and property access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Missing Property Access</h4>
              <p className="text-gray-600">Contact the property owner or admin to grant you access permissions</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Can't Add Team Members</h4>
              <p className="text-gray-600">Ensure you have admin privileges and the invitee has a valid email address</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Role Changes Not Applied</h4>
              <p className="text-gray-600">Log out and log back in to refresh permissions, or clear browser cache</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing Account Issues</CardTitle>
            <CardDescription>Problems related to billing and subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Payment Method Updates</h4>
              <p className="text-gray-600">Go to Billing → Payment Methods → Add/Update card information</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Subscription Changes</h4>
              <p className="text-gray-600">Upgrade/downgrade available in Account Settings → Subscription Management</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Invoice Questions</h4>
              <p className="text-gray-600">Download detailed invoices from Billing History or contact billing support</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
            <CardDescription>Managing your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Data Export</h4>
              <p className="text-gray-600">Request data export from Privacy Settings → Data Management</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Account Deletion</h4>
              <p className="text-gray-600">Contact support for account deletion - this action cannot be undone</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Privacy Settings</h4>
              <p className="text-gray-600">Control data sharing and communication preferences in Privacy Settings</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">Keep your account secure:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use a strong, unique password</li>
                <li>• Enable two-factor authentication</li>
                <li>• Review login activity regularly</li>
                <li>• Don't share account credentials</li>
                <li>• Log out from shared devices</li>
                <li>• Keep contact information updated</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600">For account-specific issues that require personal assistance, contact our support team.</p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/help/technical-support')}>Technical Support</Button>
                <Button variant="outline" onClick={() => navigate('/help/common-issues')}>Common Issues</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};