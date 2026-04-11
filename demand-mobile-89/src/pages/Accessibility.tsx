import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Accessibility = () => {
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
          <h1 className="text-4xl font-bold text-foreground mb-2">Accessibility Statement</h1>
          <p className="text-muted-foreground mb-8"><strong>Last Updated: July 7, 2025</strong></p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment to Accessibility</h2>
            <p className="text-foreground leading-relaxed mb-4">
              GoHandyMate is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying relevant accessibility standards to ensure our platform is usable by all individuals.
            </p>
            <p className="text-foreground leading-relaxed">
              We believe that everyone should have equal access to home services and our platform, regardless of their abilities or disabilities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Accessibility Standards</h2>
            <p className="text-foreground mb-4">
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.
            </p>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Key Standards We Follow</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Perceivable:</strong> Information must be presentable in ways users can perceive</li>
              <li><strong>Operable:</strong> Interface components must be operable by all users</li>
              <li><strong>Understandable:</strong> Information and UI operation must be understandable</li>
              <li><strong>Robust:</strong> Content must be robust enough for various assistive technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Accessibility Features</h2>
            
            <h3 className="text-xl font-medium text-foreground mb-3">Visual Accessibility</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>High Contrast Mode:</strong> Enhanced contrast for better visibility</li>
              <li><strong>Scalable Text:</strong> Text can be resized up to 200% without loss of functionality</li>
              <li><strong>Color Independence:</strong> Information is not conveyed by color alone</li>
              <li><strong>Focus Indicators:</strong> Clear visual focus indicators for keyboard navigation</li>
              <li><strong>Alt Text:</strong> Descriptive alternative text for all images</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Keyboard Accessibility</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Full Keyboard Navigation:</strong> All features accessible via keyboard</li>
              <li><strong>Tab Order:</strong> Logical tab sequence throughout the application</li>
              <li><strong>Skip Links:</strong> Quick navigation to main content areas</li>
              <li><strong>Keyboard Shortcuts:</strong> Efficient shortcuts for common actions</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Screen Reader Support</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>ARIA Labels:</strong> Proper labeling for screen reader users</li>
              <li><strong>Semantic HTML:</strong> Structured markup for better navigation</li>
              <li><strong>Descriptive Headings:</strong> Clear heading structure for content organization</li>
              <li><strong>Form Labels:</strong> All form controls properly labeled</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Motor Accessibility</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Large Click Targets:</strong> Buttons and links meet minimum size requirements</li>
              <li><strong>Timeout Extensions:</strong> Ability to extend or disable time limits</li>
              <li><strong>Drag and Drop Alternatives:</strong> Alternative methods for drag-based interactions</li>
              <li><strong>Voice Control Support:</strong> Compatible with voice navigation software</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Assistive Technology Compatibility</h2>
            <p className="text-foreground mb-4">
              Our platform is designed to work with a variety of assistive technologies:
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">Screen Readers</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>JAWS (Job Access With Speech)</li>
              <li>NVDA (NonVisual Desktop Access)</li>
              <li>VoiceOver (macOS and iOS)</li>
              <li>TalkBack (Android)</li>
              <li>Dragon NaturallySpeaking</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Browser Compatibility</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Chrome (latest version)</li>
              <li>Firefox (latest version)</li>
              <li>Safari (latest version)</li>
              <li>Edge (latest version)</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Mobile Accessibility</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>iOS accessibility features</li>
              <li>Android accessibility services</li>
              <li>Voice commands and gestures</li>
              <li>Switch control support</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Accessibility Testing</h2>
            <p className="text-foreground mb-4">
              We regularly test our platform for accessibility using:
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">Automated Testing</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>axe-core accessibility testing engine</li>
              <li>WAVE (Web Accessibility Evaluation Tool)</li>
              <li>Lighthouse accessibility audits</li>
              <li>Continuous integration accessibility checks</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Manual Testing</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Keyboard-only navigation testing</li>
              <li>Screen reader testing across multiple platforms</li>
              <li>Color contrast verification</li>
              <li>User testing with individuals with disabilities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Known Limitations</h2>
            <p className="text-foreground mb-4">
              We are actively working to address the following known accessibility issues:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Some third-party payment forms may have limited accessibility features</li>
              <li>Video content may not always include captions or transcripts</li>
              <li>Some interactive maps may have limited screen reader support</li>
              <li>File upload interfaces may need enhancement for better accessibility</li>
            </ul>
            <p className="text-foreground mt-4">
              We are committed to resolving these issues in future updates.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Alternative Access Options</h2>
            <p className="text-foreground mb-4">
              If you encounter accessibility barriers, we offer alternative ways to access our services:
            </p>

            <h3 className="text-xl font-medium text-foreground mb-3">Phone Support</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Call our accessibility hotline: 240-444-7350</li>
              <li>Speak with trained customer service representatives</li>
              <li>Get assistance with booking services</li>
              <li>Receive help navigating our platform</li>
            </ul>

            <h3 className="text-xl font-medium text-foreground mb-3 mt-6">Email Support</h3>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Email accessibility@gohandymate.com</li>
              <li>Request information in alternative formats</li>
              <li>Get assistance with account management</li>
              <li>Report accessibility issues</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Feedback and Reporting</h2>
            <p className="text-foreground mb-4">
              We welcome feedback about the accessibility of our platform. If you encounter accessibility barriers or have suggestions for improvement, please let us know:
            </p>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">Accessibility Team Contact</h3>
              <ul className="space-y-2 text-foreground">
                <li><strong>Email:</strong> accessibility@gohandymate.com</li>
                <li><strong>Phone:</strong> 240-444-7350</li>
                <li><strong>Mail:</strong> 4445 Southern Business Park Drive, White Plains, MD 20695</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                We aim to respond to accessibility feedback within 2 business days.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Ongoing Improvements</h2>
            <p className="text-foreground mb-4">
              Accessibility is an ongoing effort. Our commitment includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Regular accessibility audits and testing</li>
              <li>Staff training on accessibility best practices</li>
              <li>Incorporating accessibility into our design process</li>
              <li>Staying current with accessibility standards and guidelines</li>
              <li>Engaging with the disability community for feedback</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Legal Information</h2>
            <p className="text-foreground mb-4">
              This accessibility statement applies to the GoHandyMate website and mobile applications. We are committed to compliance with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li>Americans with Disabilities Act (ADA)</li>
              <li>Section 508 of the Rehabilitation Act</li>
              <li>Web Content Accessibility Guidelines (WCAG) 2.1</li>
              <li>European Accessibility Act</li>
            </ul>
          </section>

          <div className="border-t border-border pt-8 mt-12">
            <p className="text-center text-muted-foreground">
              <strong>This Accessibility Statement was last updated on July 7, 2025 and reflects our ongoing commitment to digital accessibility.</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};