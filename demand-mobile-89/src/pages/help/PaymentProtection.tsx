import { BackButton } from "@/components/navigation/BackButton";
import { Shield, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";

export const PaymentProtection = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackButton />
        
        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Payment Protection Policy</h1>
            <p className="text-lg text-muted-foreground">Your money is safe with our comprehensive payment protection system.</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-green-50 border-l-4 border-green-400 p-6 mb-8">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">100% Protected</h3>
                  <p className="text-green-700">Every payment on GoHandyMate is protected by our escrow system and satisfaction guarantee.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">1. Secure Payment</h3>
                <p className="text-muted-foreground text-sm">Your payment is held safely in escrow when you book a service</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">2. Work Completed</h3>
                <p className="text-muted-foreground text-sm">Professional completes the work to your satisfaction</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">3. Payment Released</h3>
                <p className="text-muted-foreground text-sm">Funds are released to the professional only after approval</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">What's Protected</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Incomplete Work</h3>
                  <p className="text-muted-foreground">If work isn't completed as agreed, you get a full refund</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Poor Quality Work</h3>
                  <p className="text-muted-foreground">We'll send another professional or issue a refund if quality doesn't meet standards</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">No-Show Professionals</h3>
                  <p className="text-muted-foreground">Full refund if a professional doesn't show up as scheduled</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Property Damage</h3>
                  <p className="text-muted-foreground">Coverage up to $1M for accidental damage during service</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Dispute Resolution</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-foreground mb-3">Step 1: Direct Communication</h3>
              <p className="text-muted-foreground mb-4">First, try to resolve the issue directly with the professional through our messaging system.</p>
              
              <h3 className="font-semibold text-foreground mb-3">Step 2: Contact Support</h3>
              <p className="text-muted-foreground mb-4">If you can't reach an agreement, contact our support team within 48 hours of service completion.</p>
              
              <h3 className="font-semibold text-foreground mb-3">Step 3: Investigation</h3>
              <p className="text-muted-foreground mb-4">We'll investigate the issue, reviewing messages, photos, and both parties' accounts.</p>
              
              <h3 className="font-semibold text-foreground mb-3">Step 4: Resolution</h3>
              <p className="text-muted-foreground">Based on our findings, we'll issue a refund, arrange corrective work, or find another solution.</p>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Timelines</h3>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Report issues within 48 hours of service completion</li>
                    <li>• Refund requests processed within 3-5 business days</li>
                    <li>• Emergency issues resolved within 24 hours</li>
                  </ul>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Excluded Items</h2>
            
            <div className="bg-red-50 p-6 rounded-lg mb-8">
              <p className="text-red-700 mb-4">Our protection doesn't cover:</p>
              <ul className="text-red-700 space-y-2">
                <li>• Pre-existing damage to your property</li>
                <li>• Changes to project scope after work begins</li>
                <li>• Cosmetic preferences (color, style choices)</li>
                <li>• Normal wear and tear on materials</li>
                <li>• Delays due to weather or circumstances beyond our control</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Questions About Payment Protection?</h3>
                  <p className="text-green-700 mb-4">Our support team is available 24/7 to help with any payment or protection questions.</p>
                  <div className="space-x-4">
                    <a href="/help-center" className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                      Contact Support
                    </a>
                    <a href="/help" className="inline-block text-green-600 hover:text-green-700 transition-colors">
                      View All Help Articles
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};