import { Shield, Twitter, Facebook, Linkedin, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#166534] text-white pt-20 pb-10 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Left Column (Brand & Socials) */}
          <div className="lg:col-span-4 space-y-8 pr-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <img
                  src="/gohandymate-logo.png"
                  alt="GoHandyMate Logo"
                  className="h-8 w-auto brightness-0 invert"
                />
                GoHandyMate
              </h3>
              <p className="text-green-100/70 text-sm leading-relaxed font-medium">
                Connecting customers with skilled professionals for all your home service needs. Fast, reliable, and affordable solutions.
              </p>
            </div>

            <div className="flex items-center space-x-5">
              <a href="#" className="text-green-100/60 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-100/60 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-100/60 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-green-100/60 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-xs font-semibold text-green-100/80">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                All systems operational
              </div>
            </div>
          </div>

          {/* Links Columns Container */}
          <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Column 1 */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Services</h4>
                <ul className="space-y-3 text-sm font-medium text-green-100/70">
                  <li><a href="/services" className="hover:text-white transition-colors">Plumbing <span className="ml-2 text-[9px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full uppercase tracking-wider">New</span></a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">Electrical</a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">Cleaning</a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">Carpentry</a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">Painting</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Explore</h4>
                <ul className="space-y-3 text-sm font-medium text-green-100/70">
                  <li><a href="/how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                  <li><a href="/services" className="hover:text-white transition-colors">Service Areas</a></li>
                  <li><a href="/success-stories" className="hover:text-white transition-colors">Success Stories</a></li>
                </ul>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Customers</h4>
                <ul className="space-y-3 text-sm font-medium text-green-100/70">
                  <li><a href="/post-job" className="hover:text-white transition-colors">Post a Job</a></li>
                  <li><a href="/professionals" className="hover:text-white transition-colors">Browse Pros</a></li>
                  <li><a href="/payment-protection" className="hover:text-white transition-colors">Payment Protection</a></li>
                  <li><a href="/customer-reviews" className="hover:text-white transition-colors">Customer Reviews</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Professionals</h4>
                <ul className="space-y-3 text-sm font-medium text-green-100/70">
                  <li><a href="/sign-up-pro" className="hover:text-white transition-colors">Sign Up as Pro</a></li>
                  <li><a href="/pro-resources" className="hover:text-white transition-colors">Pro Resources</a></li>
                  <li><a href="/pro-community" className="hover:text-white transition-colors">Pro Community</a></li>
                </ul>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Company</h4>
                <ul className="space-y-3 text-sm font-medium text-green-100/70">
                  <li><a href="/about-us" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="/press" className="hover:text-white transition-colors">Press & Media</a></li>
                  <li><a href="/help-center" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Blogs</h4>
                <ul className="space-y-3 text-sm font-medium text-green-100/70">
                  <li><a href="/blog" className="hover:text-white transition-colors">Official Blog</a></li>
                  <li><a href="/blog" className="hover:text-white transition-colors">Pro Insights</a></li>
                </ul>
              </div>
            </div>

            {/* Column 4 */}
            <div className="space-y-10">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Support</h4>
                <ul className="space-y-3 text-sm font-medium text-green-100/70">
                  <li><a href="/help-center" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="/trust-safety" className="hover:text-white transition-colors">Trust & Safety</a></li>
                  <li><a href="/help-center" className="hover:text-white transition-colors">Report an Issue</a></li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
          <p className="text-green-100/40 text-sm font-medium">
            &copy; {new Date().getFullYear()} GoHandyMate &mdash; LinearBytes Inc.
          </p>
          <div className="flex space-x-6 text-sm font-medium text-green-100/40">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/cookie-policy" className="hover:text-white transition-colors">Code of conduct</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
