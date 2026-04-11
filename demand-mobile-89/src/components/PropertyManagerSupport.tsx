import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Mail } from 'lucide-react';

export const PropertyManagerSupport = () => {
  const [activeChat, setActiveChat] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveChat(true)}>
          <CardContent className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Live Chat</h3>
            <p className="text-sm text-gray-600">Get instant help from our support team</p>
            <Badge className="mt-2 bg-green-100 text-green-700">Available 24/7</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Phone className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Priority Hotline</h3>
            <p className="text-sm text-gray-600">Direct line for property managers</p>
            <div className="mt-2 font-mono text-lg text-green-600">1-800-PM-HELP</div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Email Support</h3>
            <p className="text-sm text-gray-600">Send detailed requests</p>
            <div className="mt-2 text-sm text-purple-600">support@gohandymate.com</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Chat Interface */}
      {activeChat && (
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <CardTitle>Live Chat Support</CardTitle>
                <Badge className="bg-green-100 text-green-700">Online</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => setActiveChat(false)}>
                Minimize
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-64 p-4 space-y-3 overflow-y-auto bg-gray-50">
              <div className="flex">
                <div className="bg-blue-600 text-white p-2 rounded-lg max-w-xs">
                  <p className="text-sm">Hello! I'm Sarah from Property Manager support. How can I help you today?</p>
                  <span className="text-xs opacity-75">Just now</span>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && setMessage('')}
                />
                <Button onClick={() => setMessage('')}>Send</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Knowledge Base */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Help Resources</CardTitle>
          <CardDescription>Common solutions for property managers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Getting Started</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <a href="/help/setup-properties" className="hover:text-blue-600">Setting up your properties</a></li>
                <li>• <a href="/help/managing-units" className="hover:text-blue-600">Managing units and tenants</a></li>
                <li>• <a href="/help/requesting-services" className="hover:text-blue-600">Requesting services</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Billing & Payments</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <a href="/help/understanding-invoices" className="hover:text-blue-600">Understanding invoices</a></li>
                <li>• <a href="/help/bulk-billing" className="hover:text-blue-600">Bulk billing setup</a></li>
                <li>• <a href="/help/payment-methods" className="hover:text-blue-600">Payment methods</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Maintenance</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <a href="/help/emergency-procedures" className="hover:text-blue-600">Emergency procedures</a></li>
                <li>• <a href="/help/scheduling-recurring-services" className="hover:text-blue-600">Scheduling recurring services</a></li>
                <li>• <a href="/help/working-with-technicians" className="hover:text-blue-600">Working with technicians</a></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Troubleshooting</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• <a href="/help/common-issues" className="hover:text-blue-600">Common issues</a></li>
                <li>• <a href="/help/account-problems" className="hover:text-blue-600">Account problems</a></li>
                <li>• <a href="/help/technical-support" className="hover:text-blue-600">Technical support</a></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};