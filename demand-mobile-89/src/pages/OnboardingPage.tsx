import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users, Wrench, MapPin, Star, Shield, Building, Hammer,
  CheckCircle, Clock, DollarSign, Award, Zap, Heart,
  Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Youtube,
  ArrowRight, Play, Users2, TrendingUp
} from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';
import { VideoModal } from '@/components/hero/VideoModal';
import { AuthModal } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { HeroSection } from '@/components/HeroSection';
import { ModernFeaturesSection } from '@/components/ModernFeaturesSection';
import { Footer } from '@/components/Footer';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { handleRoleSelect, isAuthenticated } = useAppState();
  const [activeSection, setActiveSection] = useState('home');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRole, setPendingRole] = useState<'customer' | 'handyman' | 'contractor' | 'property_manager' | null>(null);
  const currentYear = new Date().getFullYear();

  // Load demo video
  useEffect(() => {
    loadDemoVideo();
  }, []);

  const loadDemoVideo = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('demo-videos')
        .list('videos', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (!error && data && data.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from('demo-videos')
          .getPublicUrl(`videos/${data[0].name}`);

        setDemoVideoUrl(publicUrl);
      }
    } catch (error) {
      console.error('Error loading demo video:', error);
    }
  };

  const handleRoleSelection = (role: 'customer' | 'handyman' | 'contractor' | 'property_manager') => {
    if (isAuthenticated) {
      // User is authenticated, navigate directly to app
      handleRoleSelect(role);
      switch (role) {
        case 'customer':
          navigate('/app?tab=home');
          break;
        case 'handyman':
        case 'contractor':
          navigate('/app?tab=search');
          break;
        case 'property_manager':
          navigate('/app?tab=profile');
          break;
        default:
          navigate('/app');
      }
    } else {
      // User is not authenticated, show auth modal
      setPendingRole(role);
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingRole) {
      // After successful auth, proceed with role selection
      handleRoleSelect(pendingRole);
      switch (pendingRole) {
        case 'customer':
          navigate('/app?tab=home');
          break;
        case 'handyman':
        case 'contractor':
          navigate('/app?tab=search');
          break;
        case 'property_manager':
          navigate('/app?tab=profile');
          break;
        default:
          navigate('/app');
      }
      setPendingRole(null);
    }
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
    setPendingRole(null);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content Area starting below fixed header */}
      <div className="pt-20">
        {/* Customer App Hero Section - Margins internally handled in HeroSection */}
        <HeroSection />

        {/* About Section - Redesigned to match high-fidelity layout */}
        <section id="about" className="py-16 md:py-24 lg:px-16 md:px-10 px-4 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text Side */}
              <div className="space-y-6 md:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] sm:text-xs font-black tracking-[0.15em] uppercase border border-[#EBEBE0] shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  Our Mission
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.05] tracking-tight">
                  Redefining <br className="hidden sm:block" />
                  Reliability at <br className="hidden sm:block" />
                  Home.
                </h2>

                <p className="text-lg text-slate-600 leading-[1.6] max-w-lg font-medium opacity-90">
                  At GoHandyMate, we believe everyone deserves access to reliable, affordable home services. Our platform eliminates the hassle of finding trusted professionals by providing a comprehensive network of verified experts ready to help with any home service need.
                </p>
              </div>

              {/* Image Side with Decorative Shapes */}
              <div className="relative pt-10 lg:pt-0">
                {/* Decorative Yellow Shapes */}
                {/* Bottom Left Pill */}
                <div className="absolute bottom-[5%] -left-[10%] w-20 h-40 bg-[#FCD303] rounded-full rotate-[15deg] z-0 shadow-lg" />

                {/* Top Right Circle/Arc */}
                <div className="absolute -top-[15%] -right-[15%] w-80 h-80 bg-yellow-100/40 rounded-full blur-3xl -z-0" />
                <div className="absolute top-[5%] -right-[5%] w-48 h-48 border-[25px] border-[#FCD303]/10 rounded-full z-0 translate-x-1/2 -translate-y-1/2" />

                {/* Main Image Container */}
                <div className="relative z-10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border-8 md:border-[14px] border-white max-w-[280px] sm:max-w-md mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="/about-handyman.png"
                    alt="Professional Handyman"
                    className="w-full object-cover aspect-[4/5]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section - Redesigned to match vertical timeline layout */}
        <section id="how-it-works" className="py-16 md:py-24 lg:px-16 md:px-10 px-4 bg-[#FAFAF5] overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

              {/* Left Column: Image Stack */}
              <div className="relative h-[350px] sm:h-[450px] md:h-[600px] flex items-center justify-center lg:justify-start order-2 lg:order-1 mt-8 lg:mt-0">
                {/* Background Image 3 (Back) */}
                <div className="absolute left-[5%] top-[15%] w-[65%] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white transform -rotate-6 z-0 grayscale-[0.3] opacity-60">
                  <img src="/how-it-works-3.png" alt="Carpentry" className="w-full h-full object-cover" />
                </div>
                {/* Background Image 2 (Middle) */}
                <div className="absolute left-[15%] top-[10%] w-[65%] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 z-10 scale-105">
                  <img src="/how-it-works-2.png" alt="Electrical" className="w-full h-full object-cover shadow-blue-500/20 shadow-2xl" />
                </div>
                {/* Front Image 1 (Front) */}
                <div className="absolute left-[25%] sm:left-[25%] top-[5%] w-[65%] aspect-[4/5] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border-8 md:border-[12px] border-white z-20 transform rotate-1 transition-transform duration-500 hover:rotate-0">
                  <img src="/how-it-works-1.png" alt="Plumbing" className="w-full h-full object-cover" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl -z-10" />
              </div>

              {/* Right Column: Vertical Timeline */}
              <div className="space-y-10 order-1 lg:order-2">
                <div className="space-y-4 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-green-800 text-[10px] sm:text-xs font-black tracking-[0.15em] uppercase border border-[#EBEBE0] shadow-sm">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    How It Works
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                    Your Trusted Path to <br className="hidden sm:block" />
                    <span className="text-green-800">Perfect Home Care.</span>
                  </h2>
                  <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
                    We make the entire experience simple, predictable, and supportive.
                  </p>
                </div>

                {/* Timeline Steps */}
                <div className="relative space-y-8 pl-4">
                  {/* Vertical Line */}
                  <div className="absolute left-[21px] top-4 bottom-4 w-0.5 bg-slate-200" />

                  {[
                    {
                      num: "01",
                      title: "Describe Your Task",
                      desc: "Tell us what you need done. Be as specific as possible to get the best matches."
                    },
                    {
                      num: "02",
                      title: "Browse Verified Pros",
                      desc: "Review profiles, verified skills, and customer ratings to find your perfect professional."
                    },
                    {
                      num: "03",
                      title: "Get Instant Quotes",
                      desc: "Receive transparent pricing and digital quotes directly through our platform."
                    },
                    {
                      num: "04",
                      title: "Confirm & Schedule",
                      desc: "Choose your professional, agree on the timeline, and schedule the work with confidence."
                    },
                    {
                      num: "05",
                      title: "Secure Payment & Completion",
                      desc: "Pay securely through our escrow system only when the job is completed to your satisfaction."
                    }
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex gap-8 group">
                      {/* Number Circle bubble */}
                      <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 group-hover:border-green-600 group-hover:text-green-600 transition-colors duration-300">
                        {step.num}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-1.5 overflow-hidden">
                        <h3 className="text-xl font-black text-[#0A0A0A] mb-2 group-hover:text-green-800 transition-colors">
                          {step.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed font-medium">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Why Choose GoHandyMate Section */}
        <ModernFeaturesSection />

        {/* Get Started / Role Selection Section - Redesigned */}
        <section id="get-started" className="py-16 md:py-24 lg:px-16 md:px-10 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-12 md:mb-16 space-y-4 md:space-y-6 text-center lg:text-left">
              <div className="text-[10px] sm:text-xs font-black tracking-[0.2em] text-slate-400 uppercase">
                Get Started
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight max-w-xl mx-auto lg:mx-0">
                Choose how you want to use GoHandyMate
              </h2>
              <p className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Pick the path that fits you best whether you need help at home or want to offer your skills as a professional.
              </p>
            </div>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Customers Card */}
              <div
                className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-[#F0FDF4] border border-transparent hover:border-green-200 transition-all duration-500 cursor-pointer overflow-hidden min-h-[420px]"
                onClick={() => handleRoleSelect('customer')}
              >
                <div className="space-y-6">
                  <div className="text-[10px] font-black tracking-[0.15em] text-green-800/60 uppercase">
                    Customers
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight group-hover:text-green-900 transition-colors">
                    I need help with home projects
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Find trusted, local professionals for repairs, installations, cleaning, and more all in a few taps.
                  </p>
                </div>

                {/* Inner White Pill */}
                <div className="mt-12 bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="text-[9px] font-black tracking-wider text-slate-400 uppercase">What you get</div>
                    <div className="text-[11px] font-bold text-[#0A0A0A] leading-tight max-w-[120px]">
                      Verified local pros, reviews & secure payment
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Users2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Handymen Card */}
              <div
                className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-[#ECFDF5] border border-transparent hover:border-emerald-200 transition-all duration-500 cursor-pointer overflow-hidden min-h-[420px]"
                onClick={() => handleRoleSelect('handyman')}
              >
                <div className="space-y-6">
                  <div className="text-[10px] font-black tracking-[0.15em] text-emerald-800/60 uppercase">
                    Handymen
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight group-hover:text-emerald-900 transition-colors">
                    Offer your skills and grow your income
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Get matched with nearby jobs, build your reputation, and get paid fast for every completed task.
                  </p>
                </div>

                {/* Inner White Pill */}
                <div className="mt-12 bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Best for</div>
                    <div className="text-[11px] font-bold text-[#0A0A0A] leading-tight max-w-[120px]">
                      Independent handymen & on-call pros
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Hammer className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Contractors Card (Commented out) */}
              {/* 
              <div
                className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-[#F1F5F9] border border-transparent hover:border-slate-300 transition-all duration-500 cursor-pointer overflow-hidden min-h-[420px]"
                onClick={() => handleRoleSelect('contractor')}
              >
                <div className="space-y-6">
                  <div className="text-[10px] font-black tracking-[0.15em] text-slate-500 uppercase">
                    Contractors
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight group-hover:text-slate-900 transition-colors">
                    Coordinate larger projects with ease
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Manage crews, subcontractors, and timelines in one place while keeping clients in the loop.
                  </p>
                </div>

                <div className="mt-12 bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Includes</div>
                    <div className="text-[11px] font-bold text-[#0A0A0A] leading-tight max-w-[120px]">
                      Job scheduling, crew assignment & progress tracking
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                    <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              */}

              {/* Property Managers Card (Commented out) */}
              {/* 
              <div
                className="group relative flex flex-col justify-between p-8 rounded-[2.5rem] bg-[#F8FAFC] border border-transparent hover:border-slate-300 transition-all duration-500 cursor-pointer overflow-hidden min-h-[420px]"
                onClick={() => handleRoleSelect('property_manager')}
              >
                <div className="space-y-6">
                  <div className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
                    Property Managers
                  </div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight group-hover:text-slate-900 transition-colors">
                    Stay ahead of maintenance across units
                  </h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    Track work orders, prioritize urgent issues, and keep tenants happy with fast, reliable service.
                  </p>
                </div>

                <div className="mt-12 bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-100 group-hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="text-[9px] font-black tracking-wider text-slate-400 uppercase">Perfect for</div>
                    <div className="text-[11px] font-bold text-[#0A0A0A] leading-tight max-w-[120px]">
                      Multi-unit buildings, portfolios & HOAs
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                    <Building className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
              */}
            </div>
          </div>
        </section>

        {/* Subscription / CTA Section - Redesigned with Orbit Layout */}
        <section id="subscribe" className="relative py-24 sm:py-32 md:py-40 lg:py-48 bg-[#DFF3EA] overflow-hidden">
          {/* Background Decorative Orbits */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-[#166534]/10 rounded-full" />
            <div className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] border border-[#166534]/5 rounded-full" />
            <div className="absolute w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] border border-[#166534]/[0.02] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center text-center">

              {/* Floating Images Container - Formed into wide curves */}
              <div className="absolute inset-x-0 inset-y-10 pointer-events-none hidden lg:block z-0">

                {/* LEFT CURVE */}
                {/* Top Left (Inner) */}
                <div className="absolute left-[8%] top-[15%] w-[100px] h-[140px] rounded-[1.5rem] bg-white/40 backdrop-blur-md p-2 shadow-xl border border-white/50 transform -rotate-[15deg] transition-transform duration-500">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img src="/avatars/avatar-1.png" alt="Professional" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#166534]/5" />
                  </div>
                </div>
                {/* Mid Left (Outer Peak) */}
                <div className="absolute left-[2%] top-[45%] w-[110px] h-[150px] rounded-[1.5rem] bg-white/40 backdrop-blur-md p-2 shadow-xl border border-white/50 transform rotate-[8deg] transition-transform duration-500">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img src="/avatars/avatar-2.png" alt="Customer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#166534]/5" />
                  </div>
                </div>
                {/* Bottom Left (Inner) */}
                <div className="absolute left-[12%] bottom-[15%] w-[90px] h-[130px] rounded-[1.5rem] bg-white/40 backdrop-blur-md p-2 shadow-xl border border-white/50 transform -rotate-[5deg] transition-transform duration-500">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img src="/avatars/avatar-3.png" alt="Professional" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#166534]/5" />
                  </div>
                </div>

                {/* RIGHT CURVE */}
                {/* Top Right (Inner) */}
                <div className="absolute right-[10%] top-[20%] w-[90px] h-[130px] rounded-[1.5rem] bg-white/40 backdrop-blur-md p-2 shadow-xl border border-white/50 transform rotate-[12deg] transition-transform duration-500">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img src="/avatars/avatar-4.png" alt="Customer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#166534]/5" />
                  </div>
                </div>
                {/* Mid Right (Outer Peak) */}
                <div className="absolute right-[3%] top-[50%] w-[100px] h-[140px] rounded-[1.5rem] bg-white/40 backdrop-blur-md p-2 shadow-xl border border-white/50 transform -rotate-[10deg] transition-transform duration-500">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img src="/avatars/avatar-5.png" alt="Contractor" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#166534]/5" />
                  </div>
                </div>
                {/* Bottom Right (Inner) */}
                <div className="absolute right-[15%] bottom-[18%] w-[110px] h-[150px] rounded-[1.5rem] bg-white/40 backdrop-blur-md p-2 shadow-xl border border-white/50 transform rotate-[5deg] transition-transform duration-500">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <img src="/avatars/avatar-6.png" alt="Customer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#166534]/5" />
                  </div>
                </div>

              </div>

              {/* Central Content */}
              <div className="max-w-3xl space-y-8 md:space-y-10 relative z-10 px-4 md:px-0">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#166534] leading-[1.1] tracking-tight">
                  Join thousands and build your <br className="hidden sm:block" />
                  <span className="text-green-700 mt-2 block">home on GoHandyMate today</span>
                </h2>

                {/* Subscription Form */}
                <div className="relative max-w-lg mx-auto w-full">
                  <div className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl border border-green-100">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-[#0A0A0A] placeholder-slate-400 focus:outline-none font-medium bg-transparent text-sm sm:text-base w-full"
                    />
                    <button className="bg-[#166534] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-md transition-colors border border-[#166534] w-full sm:w-auto">
                      Start for free
                    </button>
                  </div>
                  <p className="mt-4 sm:mt-6 text-[#166534]/70 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-center">
                    No credit card required • Join 50,000+ users
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Video Modal */}
        <VideoModal
          isOpen={isVideoPlaying}
          onClose={handleCloseVideo}
          videoUrl={demoVideoUrl || undefined}
        />

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleAuthClose}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </div>
  );
};