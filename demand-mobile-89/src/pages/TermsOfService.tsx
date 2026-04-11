import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8"><strong>Last Updated: July 7, 2025</strong></p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
            <p className="text-foreground leading-relaxed">
              By accessing and using GoHandyMate ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Service Description</h2>
            <p className="text-foreground leading-relaxed mb-4">
              GoHandyMate is a platform that connects customers with qualified service providers for home maintenance, repairs, and improvement services. Our platform facilitates:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Matching customers with appropriate service providers</li>
              <li>Scheduling and booking services</li>
              <li>Payment processing and escrow services</li>
              <li>Communication tools between users</li>
              <li>Review and rating systems</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">User Accounts</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Account Creation</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You must be at least 18 years old to create an account</li>
              <li>One person may not maintain more than one account</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Account Responsibilities</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>You are responsible for all activities that occur under your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>You agree to provide accurate and up-to-date information</li>
              <li>You may not transfer your account to another person</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">User Conduct</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Permitted Uses</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Book legitimate home service requests</li>
              <li>Provide professional services as advertised</li>
              <li>Communicate respectfully with other users</li>
              <li>Leave honest reviews and ratings</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Prohibited Activities</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Fraudulent or deceptive practices</li>
              <li>Harassment or discrimination of any kind</li>
              <li>Circumventing our payment system</li>
              <li>Creating fake reviews or ratings</li>
              <li>Using the platform for illegal activities</li>
              <li>Spamming or unwanted solicitation</li>
              <li>Attempting to hack or disrupt the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Service Provider Terms</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Qualifications</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Must possess necessary licenses and certifications</li>
              <li>Must maintain appropriate insurance coverage</li>
              <li>Must pass our verification process</li>
              <li>Must comply with all applicable laws and regulations</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Service Standards</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Provide services in a professional and timely manner</li>
              <li>Maintain clear communication with customers</li>
              <li>Honor quoted prices and timeframes</li>
              <li>Follow safety protocols and best practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Payment Terms</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Payment Processing</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>All payments are processed through secure third-party processors</li>
              <li>Customers pay upfront, with funds held in escrow</li>
              <li>Payments are released to service providers upon job completion</li>
              <li>Platform fees are automatically deducted from payments</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Refunds and Disputes</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Refunds may be issued for services not rendered as agreed</li>
              <li>Disputes must be reported within 48 hours of service completion</li>
              <li>We reserve the right to mediate payment disputes</li>
              <li>Resolution decisions are final and binding</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Intellectual Property</h2>
            <p className="text-foreground mb-4">
              The GoHandyMate platform, including its design, features, and content, is protected by intellectual property laws. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Copy, modify, or distribute our proprietary content</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use our trademarks or branding without permission</li>
              <li>Create derivative works based on our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Privacy and Data</h2>
            <p className="text-foreground">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information. By using our service, you consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Disclaimers and Limitations</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Service Availability</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>We do not guarantee uninterrupted service availability</li>
              <li>Maintenance and updates may temporarily affect access</li>
              <li>We reserve the right to modify or discontinue features</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Limitation of Liability</h3>
            <p className="text-foreground mb-3">
              GoHandyMate acts as a platform connecting users and is not responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Quality of work performed by service providers</li>
              <li>Damages resulting from services rendered</li>
              <li>Disputes between customers and service providers</li>
              <li>Loss of data or service interruptions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Indemnification</h2>
            <p className="text-foreground">
              You agree to indemnify and hold harmless GoHandyMate from any claims, damages, or expenses arising from your use of the platform, violation of these terms, or infringement of third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">By You</h3>
            <p className="text-foreground mb-3">
              You may terminate your account at any time by contacting customer support or using account deletion features in the app.
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">By Us</h3>
            <p className="text-foreground mb-3">
              We may suspend or terminate your account for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Violation of these terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Repeated customer complaints</li>
              <li>Extended inactivity</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Governing Law</h2>
            <p className="text-foreground">
              These terms are governed by the laws of Maryland, United States. Any disputes will be resolved in the courts of Maryland, and you consent to the jurisdiction of such courts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Changes to Terms</h2>
            <p className="text-foreground mb-4">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the service constitutes acceptance of modified terms.
            </p>
            <p className="text-foreground">
              We will notify users of significant changes through:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground mt-3">
              <li>In-app notifications</li>
              <li>Email announcements</li>
              <li>Website notices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
            <p className="text-foreground mb-4">
              For questions about these Terms of Service, please contact us:
            </p>
            
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">GoHandyMate Legal Team</h3>
              <ul className="space-y-2 text-foreground">
                <li><strong>Email:</strong> legal@gohandymate.com</li>
                <li><strong>Address:</strong> 4445 Southern Business Park Drive, White Plains, MD 20695</li>
                <li><strong>Phone:</strong> 240-444-7350</li>
              </ul>
            </div>
          </section>

          <div className="border-t border-border pt-8 mt-12">
            <p className="text-center text-muted-foreground">
              <strong>These Terms of Service are effective as of July 7, 2025 and govern the use of the GoHandyMate application and services.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};