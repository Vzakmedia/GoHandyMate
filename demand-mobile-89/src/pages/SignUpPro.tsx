import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LandingHero } from "@/components/shared/LandingHero";
import { AuthModal } from "@/features/auth";
import { DollarSign, Clock, MapPin, CheckCircle, Shield, Star, Award, Zap, Users, Briefcase } from "lucide-react";

export const SignUpPro = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const benefits = [
    {
      title: "Highest Earnings",
      description: "Set your own rates and keep 85% of what you earn. No hidden fees or surprise deductions.",
      image: "/features/profile.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Total Flexibility",
      description: "Work when you want, where you want. Accept jobs that fit your schedule and availability.",
      image: "/features/secure.png",
      bgColor: "bg-[#fbbf24]",
    },
    {
      title: "Ready Customers",
      description: "Connect with thousands of customers in your area who are ready to hire your skills.",
      image: "/features/document.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Business Growth",
      description: "Access pro tools, training resources, and community support to scale your business.",
      image: "/features/support.png",
      bgColor: "bg-[#fbbf24]",
    }
  ];

  const categories = [
    {
      label: "TRADIES",
      title: "Handyman & General Repairs",
      description: "Perfect for independent pros specializing in plumbing, electrical, carpentry, and general home maintenance.",
      color: "bg-blue-50",
      icon: <Briefcase className="w-5 h-5" />,
      highlights: ["Instant job alerts", "Weekly payouts", "Vetting support"]
    },
    {
      label: "SPECIALISTS",
      title: "Licensed Contractors",
      description: "For established businesses and licensed specialists in HVAC, roofing, and major remodeling.",
      color: "bg-green-50",
      icon: <Award className="w-5 h-5" />,
      highlights: ["High-value project leads", "Team management tools", "Priority support"]
    },
    {
      label: "CREATIVE",
      title: "Interior & Finishing",
      description: "Dedicated to painters, tilers, and interior design specialists looking for aesthetic projects.",
      color: "bg-yellow-50",
      icon: <Star className="w-5 h-5" />,
      highlights: ["Portfolio showcasing", "Direct messaging", "Client management"]
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Quick Registration",
      description: "Create your pro profile and describe your skills and services."
    },
    {
      number: "02",
      title: "Verification",
      description: "Upload your ID and licenses. Well verify your details within 48 hours."
    },
    {
      number: "03",
      title: "Receive Leads",
      description: "Start getting notifications for jobs that match your expertise and area."
    },
    {
      number: "04",
      title: "Earn & Grow",
      description: "Complete jobs, get reviewed, and build your professional reputation."
    }
  ];

  const handleSignUp = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="Grow Your Business"
        title="Join Our Professional Network"
        description="Connect with customers in your area and grow your business. Join thousands of professionals already earning on GoHandyMate."
        buttonText="Start Your Application"
        onButtonClick={handleSignUp}
        backgroundImageUrl="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2938&auto=format&fit=crop"
      />

      {/* Benefits Section - High Fidelity Grid */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="lg:w-8/12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f8fafc] text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-green-100 shadow-sm">
                <DollarSign className="w-3.5 h-3.5 text-green-600" />
                PRO BENEFITS
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                Maximize your <br />
                <span className="text-green-800">Earnings & Impact.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((v, idx) => (
              <div key={idx} className="flex flex-col h-full rounded-[2rem] overflow-hidden border border-black shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:-translate-y-2">
                <div className="flex-1 p-8 bg-white space-y-4">
                  <h3 className="text-xl font-black text-[#0A0A0A] leading-tight">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{v.description}</p>
                </div>
                <div className={`${v.bgColor} h-40 flex items-center justify-center p-8 relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-white/10 opacity-20" />
                  <img src={v.image} alt={v.title} className="w-24 h-24 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Categories - Role Cards Style */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-500 text-[11px] font-black tracking-[0.15em] uppercase border border-slate-200 shadow-sm">
              <Users className="w-3.5 h-3.5" />
              JOIN YOUR TRIBE
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              A place for every professional
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className={`${cat.color} p-10 rounded-[3rem] border border-black/5 flex flex-col h-full hover:shadow-2xl transition-all duration-500`}>
                <div className="flex-1 space-y-6">
                  <div className="text-[11px] font-black tracking-widest text-[#0A0A0A]/40 uppercase">{cat.label}</div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight">{cat.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{cat.description}</p>
                </div>

                <div className="mt-10 p-6 bg-white rounded-3xl shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#166534] flex items-center justify-center text-white">
                      {cat.icon}
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider text-[#166534]">Includes</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.highlights.map((h, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-600 border border-slate-100">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process - Timeline style from How It Works */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-[#EBEBE0] shadow-sm">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  ONBOARDING
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                  Your path to <br />
                  <span className="text-green-800">Professional Success.</span>
                </h2>
              </div>

              <div className="relative space-y-10">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />
                {steps.map((step, idx) => (
                  <div key={idx} className="relative flex gap-10 group">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:border-green-600 group-hover:text-green-600 transition-colors">
                      {step.number}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <h3 className="text-xl font-black text-[#0A0A0A] mb-2">{step.title}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed max-w-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative pt-10 lg:pt-0">
              <div className="absolute -top-[10%] -left-[10%] w-32 h-32 bg-[#fbbf24]/20 rounded-full blur-2xl -z-10" />
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2670&auto=format&fit=crop" alt="Pro at work" className="w-full aspect-square object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-10">
                  <div className="flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-[#166534] rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-black">Join 10k+ Certified Pros</div>
                      <div className="text-sm opacity-80 underline cursor-pointer">View success stories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Orbit layout */}
      <section className="relative py-40 md:py-48 bg-[#DFF3EA] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-[#166534]/10 rounded-full" />
          <div className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] border border-[#166534]/5 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-3xl space-y-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#166534] leading-[1.1] tracking-tight">
                Don't just work hard. <br />
                <span className="text-green-700 mt-2 block">Work better with GoHandyMate.</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleSignUp}
                  className="bg-[#166534] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-xl hover:bg-[#14532d] transition-colors"
                >
                  Start My Application
                </button>
                <button
                  onClick={() => navigate('/pro-resources')}
                  className="bg-white text-[#166534] px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-colors border border-green-100"
                >
                  View Pro Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          navigate('/');
        }}
        defaultIsSignUp={true}
      />
    </div>
  );
};

