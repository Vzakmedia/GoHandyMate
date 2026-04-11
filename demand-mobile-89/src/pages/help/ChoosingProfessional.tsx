import { BackButton } from "@/components/navigation/BackButton";
import { Star, CheckCircle, Shield, Users } from "lucide-react";

export const ChoosingProfessional = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackButton />
        
        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">Tips for Choosing the Right Professional</h1>
            <p className="text-lg text-muted-foreground">Make informed decisions when selecting professionals for your home projects.</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <div className="flex items-start">
                <Star className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Key Success Factors</h3>
                  <p className="text-blue-700">The right professional can make all the difference in your project's success, timeline, and satisfaction.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-6">What to Look For</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">High Ratings & Reviews</h3>
                <p className="text-muted-foreground text-sm">Look for professionals with 4.5+ stars and multiple recent reviews. Read the details, not just the ratings.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Shield className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Verified & Licensed</h3>
                <p className="text-muted-foreground text-sm">Ensure they have proper licensing, insurance, and verification badges on their profile.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <Users className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Relevant Experience</h3>
                <p className="text-muted-foreground text-sm">Check their portfolio and experience with similar projects to yours.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Clear Communication</h3>
                <p className="text-muted-foreground text-sm">They should respond promptly and provide detailed, easy-to-understand quotes.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Red Flags to Avoid</h2>
            
            <div className="bg-red-50 p-6 rounded-lg mb-8">
              <ul className="space-y-3 text-red-700">
                <li>• Quotes that are significantly lower than others (could indicate corner-cutting)</li>
                <li>• Professionals who ask for full payment upfront</li>
                <li>• Lack of proper licensing or insurance verification</li>
                <li>• Poor communication or delayed responses</li>
                <li>• No portfolio or examples of previous work</li>
                <li>• Pressure to sign immediately without time to consider</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Questions to Ask</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">About the Project</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• How would you approach this specific project?</li>
                  <li>• What materials do you recommend and why?</li>
                  <li>• How long will the project take?</li>
                  <li>• What's included in your quote?</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">About Their Experience</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• How many similar projects have you completed?</li>
                  <li>• Can you provide references from recent customers?</li>
                  <li>• Do you have examples of similar work?</li>
                  <li>• What's your experience with this type of problem?</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">About Logistics</h3>
                <ul className="text-muted-foreground space-y-1 text-sm">
                  <li>• When can you start?</li>
                  <li>• Do you clean up after the work?</li>
                  <li>• What happens if issues arise during the project?</li>
                  <li>• Do you provide a warranty on your work?</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Comparing Quotes</h2>
            
            <div className="bg-yellow-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-foreground mb-3">Don't Just Look at Price</h3>
              <p className="text-muted-foreground mb-4">The cheapest quote isn't always the best value. Consider:</p>
              <ul className="text-muted-foreground space-y-2">
                <li>• Quality of materials included</li>
                <li>• Scope of work covered</li>
                <li>• Timeline and availability</li>
                <li>• Professional's experience and reputation</li>
                <li>• Warranty or guarantee offered</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Ready to Choose?</h3>
                  <p className="text-green-700 mb-4">Take your time to review profiles, ask questions, and trust your instincts when selecting a professional.</p>
                  <a href="/services" className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Browse Professionals
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