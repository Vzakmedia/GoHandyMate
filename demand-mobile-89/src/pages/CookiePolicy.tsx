import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CookiePolicy = () => {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8"><strong>Last Updated: July 7, 2025</strong></p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
            <p className="text-foreground leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when you visit our website or use our mobile application. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
            </p>
            <p className="text-foreground leading-relaxed">
              This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Essential Cookies</h3>
            <p className="text-foreground mb-3">
              These cookies are necessary for the basic functionality of our service and cannot be disabled:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Authentication:</strong> Keep you logged in to your account</li>
              <li><strong>Security:</strong> Protect against fraudulent activity</li>
              <li><strong>Session Management:</strong> Maintain your session state</li>
              <li><strong>Load Balancing:</strong> Distribute server load effectively</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Performance Cookies</h3>
            <p className="text-foreground mb-3">
              These cookies help us understand how users interact with our service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Analytics:</strong> Track page views and user behavior</li>
              <li><strong>Error Tracking:</strong> Identify and fix technical issues</li>
              <li><strong>Performance Monitoring:</strong> Measure app speed and reliability</li>
              <li><strong>A/B Testing:</strong> Test new features and improvements</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Functional Cookies</h3>
            <p className="text-foreground mb-3">
              These cookies enhance your experience by remembering your preferences:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Language Preferences:</strong> Remember your language choice</li>
              <li><strong>Location Settings:</strong> Store your preferred service area</li>
              <li><strong>Theme Preferences:</strong> Remember dark/light mode settings</li>
              <li><strong>Form Data:</strong> Save partially completed forms</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Targeting Cookies</h3>
            <p className="text-foreground mb-3">
              These cookies are used to deliver relevant advertisements:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Advertising:</strong> Show relevant ads based on your interests</li>
              <li><strong>Retargeting:</strong> Display ads for services you've viewed</li>
              <li><strong>Social Media:</strong> Enable sharing and social features</li>
              <li><strong>Cross-Device Tracking:</strong> Recognize you across devices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
            <p className="text-foreground mb-4">
              We also use third-party services that may place cookies on your device:
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">Analytics Providers</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Google Analytics:</strong> Website and app usage analytics</li>
              <li><strong>Mixpanel:</strong> User behavior and conversion tracking</li>
              <li><strong>Hotjar:</strong> User session recordings and heatmaps</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Advertising Partners</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Google Ads:</strong> Display targeted advertisements</li>
              <li><strong>Facebook Pixel:</strong> Social media advertising and tracking</li>
              <li><strong>LinkedIn Insight:</strong> Professional network advertising</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Support Services</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Intercom:</strong> Customer support chat functionality</li>
              <li><strong>Zendesk:</strong> Help desk and ticketing system</li>
              <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Cookie Duration</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Session Cookies</h3>
            <p className="text-foreground mb-3">
              These temporary cookies are deleted when you close your browser or app:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Authentication state</li>
              <li>Shopping cart contents</li>
              <li>Form progress</li>
              <li>Security tokens</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Persistent Cookies</h3>
            <p className="text-foreground mb-3">
              These cookies remain on your device for a specified period:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Remember Me (30 days):</strong> Keep you logged in</li>
              <li><strong>Preferences (1 year):</strong> Language and theme settings</li>
              <li><strong>Analytics (2 years):</strong> Usage tracking and insights</li>
              <li><strong>Advertising (90 days):</strong> Ad personalization data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Your Cookie Preferences</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Browser Settings</h3>
            <p className="text-foreground mb-3">
              You can control cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
              <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
              <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Mobile App Settings</h3>
            <p className="text-foreground mb-3">
              In our mobile app, you can manage preferences through:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>App Settings → Privacy → Cookie Preferences</li>
              <li>Account Settings → Data & Privacy</li>
              <li>Device Settings → Privacy → Advertising</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Opt-Out Options</h3>
            <p className="text-foreground mb-3">
              You can opt out of certain tracking:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Browser Add-on</a></li>
              <li><strong>Digital Advertising Alliance:</strong> <a href="http://optout.aboutads.info/" className="text-primary hover:underline">Opt-out Tool</a></li>
              <li><strong>Network Advertising Initiative:</strong> <a href="http://optout.networkadvertising.org/" className="text-primary hover:underline">Consumer Opt-out</a></li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Impact of Disabling Cookies</h2>
            <p className="text-foreground mb-4">
              Disabling certain cookies may affect your experience:
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-amber-800 mb-3">Essential Cookies Disabled</h3>
              <ul className="list-disc pl-6 space-y-1 text-amber-700">
                <li>Unable to stay logged in</li>
                <li>Loss of shopping cart contents</li>
                <li>Security features may not work</li>
                <li>Some features may be unavailable</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-3">Non-Essential Cookies Disabled</h3>
              <ul className="list-disc pl-6 space-y-1 text-blue-700">
                <li>Less personalized experience</li>
                <li>Need to reset preferences frequently</li>
                <li>Ads may be less relevant</li>
                <li>Limited usage analytics</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Legal Basis for Cookie Use</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Consent</h3>
            <p className="text-foreground mb-3">
              For non-essential cookies, we obtain your consent through:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Cookie consent banners on first visit</li>
              <li>Opt-in settings for advertising cookies</li>
              <li>Granular preferences in account settings</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Legitimate Interest</h3>
            <p className="text-foreground mb-3">
              Some cookies are necessary for our legitimate business interests:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Security and fraud prevention</li>
              <li>Service improvement and optimization</li>
              <li>Technical functionality and performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
            <p className="text-foreground mb-4">
              We may update this Cookie Policy to reflect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Changes in technology or law</li>
              <li>New cookie types or purposes</li>
              <li>Updates to third-party services</li>
              <li>User feedback and requests</li>
            </ul>
            <p className="text-foreground mt-4">
              We will notify you of significant changes through our app, email, or website notices.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-foreground mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">GoHandyMate Privacy Team</h3>
              <ul className="space-y-2 text-foreground">
                <li><strong>Email:</strong> privacy@gohandymate.com</li>
                <li><strong>Address:</strong> 4445 Southern Business Park Drive, White Plains, MD 20695</li>
                <li><strong>Phone:</strong> 240-444-7350</li>
              </ul>
            </div>
          </section>

          <div className="border-t border-border pt-8 mt-12">
            <p className="text-center text-muted-foreground">
              <strong>This Cookie Policy is effective as of July 7, 2025 and applies to all users of the GoHandyMate platform.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};