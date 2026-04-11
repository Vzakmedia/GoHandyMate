import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const TechnicalSupportHelp = () => {
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
          <h1 className="text-3xl font-bold text-gray-900">Technical Support</h1>
          <p className="text-gray-600 mt-2">Get help with technical issues and platform functionality</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Technical Support</CardTitle>
            <CardDescription>Multiple ways to get technical assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Live Chat Support</h4>
                <p className="text-gray-600">Available 24/7 for immediate assistance</p>
                <Button className="w-full">Start Live Chat</Button>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Technical Hotline</h4>
                <p className="text-gray-600">Direct line for complex technical issues</p>
                <div className="font-mono text-lg text-blue-600">1-800-TECH-PM</div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Email Support</h4>
              <p className="text-gray-600">For detailed technical reports and screenshots</p>
              <div className="text-blue-600">technical@gohandymate.com</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Requirements</CardTitle>
            <CardDescription>Recommended browser and device specifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Supported Browsers</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Chrome 90+ (Recommended)</li>
                  <li>• Firefox 88+</li>
                  <li>• Safari 14+</li>
                  <li>• Edge 90+</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Device Requirements</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Minimum 4GB RAM</li>
                  <li>• Stable internet connection</li>
                  <li>• JavaScript enabled</li>
                  <li>• Cookies enabled</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Technical Issues</CardTitle>
            <CardDescription>Quick fixes for frequent technical problems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Platform Won't Load</h4>
              <p className="text-gray-600">Clear browser cache, disable extensions, or try incognito mode</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Features Not Working</h4>
              <p className="text-gray-600">Ensure JavaScript is enabled and browser is up to date</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Upload/Download Issues</h4>
              <p className="text-gray-600">Check file size limits and internet connection stability</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Mobile App Problems</h4>
              <p className="text-gray-600">Update to latest app version and restart device</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Optimization</CardTitle>
            <CardDescription>Tips to improve platform performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Browser Optimization</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Close unused tabs and windows</li>
                <li>• Clear cache and cookies regularly</li>
                <li>• Disable unnecessary browser extensions</li>
                <li>• Keep browser updated to latest version</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Network Optimization</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Use wired connection when possible</li>
                <li>• Ensure stable internet connection</li>
                <li>• Close bandwidth-heavy applications</li>
                <li>• Check firewall and security settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reporting Bugs & Issues</CardTitle>
            <CardDescription>Help us improve by reporting problems</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Information to Include</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Detailed description of the issue</li>
                <li>• Steps to reproduce the problem</li>
                <li>• Browser and device information</li>
                <li>• Screenshots or error messages</li>
                <li>• Time when the issue occurred</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Bug Report Portal</h4>
              <p className="text-gray-600">Submit detailed bug reports through our technical support portal</p>
              <Button variant="outline">Submit Bug Report</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Updates</CardTitle>
            <CardDescription>Stay informed about platform status and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">System Status</h4>
              <p className="text-gray-600">Check real-time platform status and scheduled maintenance</p>
              <Button variant="outline">View Status Page</Button>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Update Notifications</h4>
              <p className="text-gray-600">Subscribe to receive notifications about new features and fixes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-600">Our technical support team is ready to help with complex issues and provide personalized assistance.</p>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/help/common-issues')}>Common Issues</Button>
                <Button variant="outline" onClick={() => navigate('/help/account-problems')}>Account Problems</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};