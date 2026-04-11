import { BackButton } from "@/components/navigation/BackButton";
import { Shield, AlertCircle, Phone } from "lucide-react";

export const DisputesRefunds = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackButton />
        
        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Resolving Disputes and Getting Refunds</h1>
            <p className="text-lg text-muted-foreground">Step-by-step guide to resolving issues and requesting refunds when needed.</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Act Quickly</h3>
                  <p className="text-red-700">Report issues within 48 hours of service completion for full protection coverage.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Resolution Process</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Step 1: Direct Communication (0-24 hours)</h3>
                <p className="text-muted-foreground">Contact the professional directly through our messaging system to discuss the issue.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Step 2: Escalate to Support (24-48 hours)</h3>
                <p className="text-muted-foreground">If unresolved, contact our support team with details and documentation.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Step 3: Investigation & Resolution (2-5 days)</h3>
                <p className="text-muted-foreground">We review evidence and work toward a fair resolution for both parties.</p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Need Immediate Help?</h3>
                  <p className="text-green-700 mb-4">For urgent disputes or safety concerns, contact us immediately.</p>
                  <a href="/help-center" className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Contact Support Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};