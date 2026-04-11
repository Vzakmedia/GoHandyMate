import { BackButton } from "@/components/navigation/BackButton";
import { Calendar, MessageCircle, CreditCard, CheckCircle } from "lucide-react";

export const FirstBooking = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackButton />
        
        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">What to Expect During Your First Booking</h1>
            <p className="text-lg text-muted-foreground">A step-by-step guide to your first GoHandyMate experience.</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-foreground mb-6">Before the Professional Arrives</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <MessageCircle className="w-6 h-6 text-blue-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Confirmation Contact</h3>
                <p className="text-muted-foreground text-sm">The professional will contact you 24-48 hours before arrival to confirm timing and discuss any last-minute details.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Prepare the Area</h3>
                <p className="text-muted-foreground text-sm">Clear the work area of personal items and ensure easy access to the problem area.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">When They Arrive</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">1. Professional Introduction</h3>
                <p className="text-muted-foreground">They'll introduce themselves, show their ID, and verify the work to be done.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">2. Problem Assessment</h3>
                <p className="text-muted-foreground">They'll examine the issue, explain what they found, and confirm the solution approach.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">3. Final Quote Review</h3>
                <p className="text-muted-foreground">If any changes are needed from the original quote, they'll explain why and get your approval.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">4. Work Begins</h3>
                <p className="text-muted-foreground">Once everything is confirmed, they'll start working while keeping you informed of progress.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">During the Work</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-foreground mb-3">What's Normal</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• Regular updates on progress and timeline</li>
                <li>• Questions about preferences (paint colors, fixture styles, etc.)</li>
                <li>• Use of drop cloths and protective materials</li>
                <li>• Some noise and dust (depending on the job)</li>
                <li>• Requests to test water, electricity, or other systems</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-foreground mb-3">When to Speak Up</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>• If you have concerns about the approach being used</li>
                <li>• If the work seems to be taking much longer than expected</li>
                <li>• If additional problems are discovered</li>
                <li>• If you notice potential safety issues</li>
                <li>• If you need to adjust the timeline or scope</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">After Completion</h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">1. Work Review</h3>
                <p className="text-muted-foreground text-sm">Walk through the completed work together and ask any questions</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">2. Care Instructions</h3>
                <p className="text-muted-foreground text-sm">Receive any maintenance tips or warranty information</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">3. Payment Release</h3>
                <p className="text-muted-foreground text-sm">Approve the work in the app to release payment from escrow</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Follow-Up Process</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <ul className="space-y-3 text-muted-foreground">
                <li>• <strong>Same Day:</strong> You'll receive a follow-up message asking about your experience</li>
                <li>• <strong>24-48 Hours:</strong> Opportunity to rate and review the professional</li>
                <li>• <strong>1 Week:</strong> Check-in to ensure everything is still working properly</li>
                <li>• <strong>Ongoing:</strong> Access to warranty support and future booking discounts</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <div className="flex items-start">
                <Calendar className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Ready for Your First Booking?</h3>
                  <p className="text-green-700 mb-4">Now that you know what to expect, you can book with confidence knowing you're in good hands.</p>
                  <a href="/services" className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Book Your First Service
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