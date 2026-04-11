import { Shield, Clock, Star, Users, CheckCircle, FileCheck, UserCheck, Phone, Zap, Calendar, CreditCard, Award, Headphones, Globe, Heart } from "lucide-react";

export const AboutFeatures = () => {
  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose GoHandyMate?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're not just another service platform. We're your trusted partner in connecting with the best professionals.
          </p>
        </div>

        {/* Verified Professionals Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Verified Professionals</h3>
                <p className="text-muted-foreground">All professionals are background-checked, licensed, and insured for your peace of mind.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Background Checked</h4>
                  <p className="text-sm text-muted-foreground">Every professional undergoes comprehensive background verification including criminal history checks and identity verification to ensure your safety and security.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FileCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Licensed & Insured</h4>
                  <p className="text-sm text-muted-foreground">All professionals carry valid licenses for their trade and comprehensive insurance coverage, protecting both you and your property during service.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <UserCheck className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Identity Verified</h4>
                  <p className="text-sm text-muted-foreground">Multi-step identity verification process ensures you know exactly who is coming to your home, building trust and accountability.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Same-Day Service Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Same-Day Service</h3>
                <p className="text-muted-foreground">Need help fast? Many of our professionals offer same-day and emergency services.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">24/7 Availability</h4>
                  <p className="text-sm text-muted-foreground">Round-the-clock customer support and emergency services for urgent repairs. Our network includes professionals available for after-hours and weekend emergencies.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Zap className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Emergency Service</h4>
                  <p className="text-sm text-muted-foreground">Fast response for urgent situations like plumbing leaks, electrical issues, or security concerns. Priority booking for critical home repairs.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Quick Response</h4>
                  <p className="text-sm text-muted-foreground">Average response time of under 2 hours for same-day bookings. Real-time matching with available professionals in your area.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Guaranteed Section */}
        <div className="mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Quality Guaranteed</h3>
                <p className="text-muted-foreground">Every job comes with our satisfaction guarantee. Not happy? We'll make it right.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <CreditCard className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Money-Back Guarantee</h4>
                  <p className="text-sm text-muted-foreground">If you're not completely satisfied with the service, we offer a full refund or will send another professional to make it right at no extra cost.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Quality Assurance</h4>
                  <p className="text-sm text-muted-foreground">Regular quality checks and performance monitoring ensure consistent high standards. Professional rating system based on customer feedback and work quality.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Headphones className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Customer Support</h4>
                  <p className="text-sm text-muted-foreground">Dedicated customer support team available to resolve any issues quickly. Follow-up calls to ensure satisfaction and address any concerns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted Community Section */}
        <div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Trusted Community</h3>
                <p className="text-muted-foreground">Join thousands of satisfied customers who trust GoHandyMate for their service needs.</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Globe className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">50,000+ Customers</h4>
                  <p className="text-sm text-muted-foreground">Growing community of satisfied homeowners across multiple cities. Trusted by families, businesses, and property managers for reliable service delivery.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Star className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Verified Reviews</h4>
                  <p className="text-sm text-muted-foreground">Authentic customer reviews and ratings help you make informed decisions. Only verified customers can leave reviews, ensuring honest feedback.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Community Support</h4>
                  <p className="text-sm text-muted-foreground">Active community forums, referral programs, and local service recommendations. Building lasting relationships between customers and professionals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};