import { BackButton } from "@/components/navigation/BackButton";
import { CheckCircle, AlertTriangle, FileText, Users } from "lucide-react";

export const JobDescriptionGuide = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <BackButton />
        
        <div className="mt-8">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">How to Write an Effective Job Description</h1>
            <p className="text-lg text-muted-foreground">Get better quotes and find the right professional with a clear, detailed job description.</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Why This Matters</h3>
                  <p className="text-blue-700">A well-written job description helps professionals understand exactly what you need, leading to more accurate quotes and better matches.</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Essential Elements</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Clear Title</h3>
                <p className="text-muted-foreground text-sm">Use specific service names like "Kitchen Faucet Repair" instead of just "Plumbing"</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Detailed Description</h3>
                <p className="text-muted-foreground text-sm">Explain the problem, what you've tried, and your desired outcome</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Specific Location</h3>
                <p className="text-muted-foreground text-sm">Include room, floor, and any access considerations</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <CheckCircle className="w-6 h-6 text-green-500 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Timeline</h3>
                <p className="text-muted-foreground text-sm">When you need it done - ASAP, this week, flexible, etc.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Example Templates</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-foreground mb-3">Plumbing Issue Example:</h3>
              <div className="bg-white p-4 rounded border-l-4 border-blue-400">
                <p className="text-sm text-muted-foreground">
                  <strong>Title:</strong> Kitchen Sink Faucet Dripping - Need Repair<br/>
                  <strong>Description:</strong> My kitchen faucet has been dripping constantly for 3 days. It's a single-handle faucet, about 5 years old. I've tried tightening the handle but it hasn't helped. The drip is coming from the spout. I'd like it repaired rather than replaced if possible.<br/>
                  <strong>Location:</strong> Main kitchen, easily accessible<br/>
                  <strong>Timeline:</strong> This week preferred, not urgent
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-semibold text-foreground mb-3">Home Improvement Example:</h3>
              <div className="bg-white p-4 rounded border-l-4 border-green-400">
                <p className="text-sm text-muted-foreground">
                  <strong>Title:</strong> Paint Master Bedroom - 12x14 Room<br/>
                  <strong>Description:</strong> Need to paint master bedroom walls and ceiling. Room is 12x14 feet with 9ft ceilings. Currently light blue, want to change to warm gray. Some minor wall prep needed - a few small nail holes to fill. I have the paint color picked out.<br/>
                  <strong>Location:</strong> Second floor master bedroom<br/>
                  <strong>Timeline:</strong> Next 2-3 weeks, flexible on dates
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">Pro Tips</h2>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Include photos when possible - they're worth a thousand words</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Mention any materials you already have</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Be honest about your budget range</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-muted-foreground">Note any special requirements (pets, working around schedules, etc.)</span>
              </li>
            </ul>

            <div className="bg-green-50 border-l-4 border-green-400 p-6">
              <div className="flex items-start">
                <Users className="w-6 h-6 text-green-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Ready to Post?</h3>
                  <p className="text-green-700 mb-4">Use these guidelines to create your job posting and start receiving quotes from qualified professionals.</p>
                  <a href="/post-job" className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Post Your Job Now
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