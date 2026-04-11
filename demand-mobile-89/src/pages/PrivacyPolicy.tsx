import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="prose prose-gray max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy for GoHandyMate</h1>
          <p className="text-muted-foreground mb-8"><strong>Last Updated: July 7, 2025</strong></p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Introduction</h2>
            <p className="text-foreground leading-relaxed">
              GoHandyMate ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and related services (the "Service").
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Account Information:</strong> Name, email address, phone number, and password</li>
              <li><strong>Profile Information:</strong> Profile photos, bio, service preferences, and location</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address, and payment history (processed securely through third-party payment processors)</li>
              <li><strong>Identity Verification:</strong> For service providers, we may collect business licenses, insurance information, and identity documents</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Location Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Precise Location:</strong> GPS coordinates to match you with nearby service providers</li>
              <li><strong>Approximate Location:</strong> City, state, and ZIP code for service area matching</li>
              <li><strong>Location History:</strong> Previous service locations for improved recommendations</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Service Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Booking Information:</strong> Service requests, dates, descriptions, and special instructions</li>
              <li><strong>Communication:</strong> Messages between users and service providers</li>
              <li><strong>Reviews and Ratings:</strong> Feedback and ratings for completed services</li>
              <li><strong>Photos and Videos:</strong> Images uploaded for service requests or completion documentation</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Device and Usage Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Device Information:</strong> Device type, operating system, unique device identifiers</li>
              <li><strong>App Usage:</strong> Features used, time spent in app, interaction patterns</li>
              <li><strong>Log Data:</strong> IP address, access times, app crashes, and performance data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Primary Uses</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Service Delivery:</strong> Connect customers with service providers, facilitate bookings</li>
              <li><strong>Communication:</strong> Enable messaging between users, send service notifications</li>
              <li><strong>Payment Processing:</strong> Process payments and manage billing</li>
              <li><strong>Account Management:</strong> Create and maintain user accounts</li>
              <li><strong>Customer Support:</strong> Respond to inquiries and resolve issues</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Secondary Uses</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Personalization:</strong> Customize app experience and recommendations</li>
              <li><strong>Safety and Security:</strong> Verify user identity, prevent fraud, ensure platform safety</li>
              <li><strong>Analytics:</strong> Understand app usage patterns and improve our services</li>
              <li><strong>Marketing:</strong> Send promotional materials (with your consent)</li>
              <li><strong>Legal Compliance:</strong> Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Information Sharing and Disclosure</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Service Providers</h3>
            <p className="text-foreground mb-3">We share information with trusted third-party service providers who assist us in:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Payment processing (Stripe)</li>
              <li>Cloud hosting and storage (Supabase)</li>
              <li>Analytics and app performance monitoring</li>
              <li>Customer support services</li>
              <li>Marketing and advertising platforms</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Between Users</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Public Profiles:</strong> Service provider profiles, ratings, and reviews are visible to customers</li>
              <li><strong>Booking Details:</strong> Relevant information is shared between customers and service providers for completed bookings</li>
              <li><strong>Communication:</strong> Messages are shared between matched users for service coordination</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Legal Requirements</h3>
            <p className="text-foreground mb-3">We may disclose information when required by law, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Compliance with legal process or government requests</li>
              <li>Protection of our rights and property</li>
              <li>Investigation of potential violations of our terms</li>
              <li>Protection of personal safety of users or the public</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Business Transfers</h3>
            <p className="text-foreground">
              In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your information:
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">Technical Safeguards</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Encryption:</strong> Data transmission and storage encryption</li>
              <li><strong>Secure Servers:</strong> Industry-standard security protocols</li>
              <li><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis</li>
              <li><strong>Regular Updates:</strong> Security patches and system updates</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Organizational Safeguards</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Employee Training:</strong> Staff training on data protection practices</li>
              <li><strong>Privacy by Design:</strong> Privacy considerations built into our development process</li>
              <li><strong>Incident Response:</strong> Procedures for handling potential data breaches</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights and Choices</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Account Controls</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Access:</strong> View and download your personal information</li>
              <li><strong>Update:</strong> Modify your profile and account information</li>
              <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Privacy Controls</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Location Services:</strong> Control location sharing through device settings</li>
              <li><strong>Marketing Communications:</strong> Opt-out of promotional emails and notifications</li>
              <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Communication Preferences</h3>
            <p className="text-foreground mb-3">You can control:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Push notifications through app settings</li>
              <li>Email communications through unsubscribe links</li>
              <li>SMS notifications through account preferences</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Data Retention</h2>
            <p className="text-foreground mb-4">
              We retain your information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Improve our services and user experience</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Retention Periods</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Account Information:</strong> Until account deletion plus 30 days</li>
              <li><strong>Transaction Records:</strong> 7 years for tax and legal compliance</li>
              <li><strong>Communication Logs:</strong> 3 years for quality assurance</li>
              <li><strong>Analytics Data:</strong> Aggregated data may be retained indefinitely</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Children's Privacy</h2>
            <p className="text-foreground">
              Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we learn that we have collected information from a child under 13, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">International Data Transfers</h2>
            <p className="text-foreground">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Services</h2>
            <p className="text-foreground mb-4">
              Our app integrates with third-party services that have their own privacy policies:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Google Maps:</strong> Location services and mapping</li>
              <li><strong>Stripe:</strong> Payment processing</li>
              <li><strong>Apple Pay/Google Pay:</strong> Mobile payments</li>
              <li><strong>Social Media Platforms:</strong> Account creation and sharing features</li>
            </ul>
            <p className="text-foreground mt-4">
              We encourage you to review the privacy policies of these third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">California Privacy Rights</h2>
            <p className="text-foreground mb-4">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Right to Know:</strong> Request information about data collection and use</li>
              <li><strong>Right to Delete:</strong> Request deletion of personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information</li>
              <li><strong>Non-Discrimination:</strong> Equal treatment regardless of privacy choices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to This Privacy Policy</h2>
            <p className="text-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Posting the updated policy in the app</li>
              <li>Sending an email notification</li>
              <li>Providing a prominent notice on our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <p className="text-foreground mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">GoHandyMate Privacy Team</h3>
              <ul className="space-y-2 text-foreground">
                <li><strong>Email:</strong> privacy@gohandymate.com</li>
                <li><strong>Address:</strong> 4445 Southern Business Park Drive, White Plains, MD 20695</li>
                <li><strong>Phone:</strong> 240-444-7350</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                For EU residents, you may also contact our Data Protection Officer at: dpo@gohandymate.com
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Jurisdiction-Specific Information</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">European Union (GDPR)</h3>
            <p className="text-foreground mb-3">
              If you are in the EU, you have additional rights under the General Data Protection Regulation, including the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Object to processing of your personal data</li>
              <li>Request rectification of inaccurate data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Legal Basis for Processing</h3>
            <p className="text-foreground mb-3">We process your information based on:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Contractual Necessity:</strong> To provide our services</li>
              <li><strong>Legitimate Interests:</strong> To improve and secure our platform</li>
              <li><strong>Consent:</strong> For marketing and optional features</li>
              <li><strong>Legal Obligations:</strong> To comply with applicable laws</li>
            </ul>
          </section>

          <div className="border-t border-border pt-8 mt-12">
            <p className="text-center text-muted-foreground">
              <strong>This Privacy Policy is effective as of July 7, 2025 and governs the use of the GoHandyMate application and services.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};