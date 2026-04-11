import { BackButton } from "@/components/navigation/BackButton";
import { Settings, AlertTriangle, MessageCircle } from "lucide-react";

export const ProjectChanges = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackButton />
        
        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Handling Project Changes and Additional Work</h1>
            <p className="text-lg text-muted-foreground">Learn how to manage scope changes and additional work requests during your project.</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Communication is Key</h3>
                  <p className="text-yellow-700">Always discuss changes through the GoHandyMate messaging system to maintain records and payment protection.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">When Changes Occur</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">1. Stop and Communicate</h3>
                <p className="text-muted-foreground">As soon as you or the professional identifies a change, pause work and discuss options.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">2. Document Everything</h3>
                <p className="text-muted-foreground">Use the in-app messaging to record what changed, why, and the new scope/cost.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">3. Get Written Approval</h3>
                <p className="text-muted-foreground">Both parties must agree to changes before work continues.</p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <div className="flex items-start">
                <MessageCircle className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Need Help Managing Changes?</h3>
                  <p className="text-green-700 mb-4">Our support team can help mediate scope changes and ensure fair pricing.</p>
                  <a href="/help-center" className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Contact Support
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