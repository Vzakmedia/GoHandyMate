import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { Shield, Lock, Heart, Users, CheckCircle, AlertTriangle, Star, TrendingUp, Sparkles, Target, Zap, Phone, Mail, ArrowRight, ShieldCheck, Eye, BadgeCheck } from "lucide-react";

export const TrustAndSafety = () => {
  const navigate = useNavigate();

  const trustPillars = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "Verified Identities",
      description: "Thorough multi-step background checks and ID verification for every professional.",
      color: "bg-[#166534]"
    },
    {
      icon: <Lock className="w-6 h-6 text-white" />,
      title: "Secured Payments",
      description: "Industry-standard encryption and escrow protection until work is approved.",
      color: "bg-[#fbbf24]"
    },
    {
      icon: <Heart className="w-6 h-6 text-white" />,
      title: "Quality Integrity",
      description: "Strict community standards and transparent review systems ensure excellence.",
      color: "bg-[#166534]"
    }
  ];

  const stats = [
    { label: "Identity Verified", value: "100%", icon: <BadgeCheck className="w-4 h-4 text-[#166534]" /> },
    { label: "Background Checks", value: "50k+", icon: <Shield className="w-4 h-4 text-[#166534]" /> },
    { label: "Dispute Support", value: "24/7", icon: <Users className="w-4 h-4 text-[#166534]" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="YOUR SAFETY FIRST"
        title="Trust & Safety"
        description="We've built GHM on a foundation of security, transparency, and accountability. Your peace of mind is our mission."
        buttonText="Our Guarantee"
        backgroundImageUrl="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Verification Framework - Feature Grid */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
              <Shield className="w-3.5 h-3.5" /> THE GHM STANDARD
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              Infrastructure for Trust.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustPillars.map((p, idx) => (
              <div key={idx} className="p-10 rounded-[2.5rem] bg-[#FAFAF5] border border-black/5 hover:bg-white hover:shadow-3xl transition-all duration-500 group">
                <div className={`w-14 h-14 ${p.color} border border-black/5 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform`}>
                  {p.icon}
                </div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">{p.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">{p.description}</p>
                <div className="flex items-center gap-2 text-[#166534] font-black text-[10px] uppercase tracking-widest">
                  VERIFICATION PROCESS <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats & Verification Cards - Two Column */}
      <section className="py-24 bg-[#FAFAF5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-500 text-[10px] font-black tracking-[0.15em] uppercase border border-slate-200">
                  <Sparkles className="w-3.5 h-3.5" /> LIVE DATA
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                  Proven Security <br />
                  <span className="text-[#166534]">At Every Scale.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                  We provide the rigorous vetting protocols usually reserved for Fortune 500 companies, scaled for every home service request.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((s, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                    <div className="mb-4">{s.icon}</div>
                    <div className="text-2xl font-black text-[#0A0A0A]">{s.value}</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=2940" className="w-full h-full object-cover" alt="Safety" />
                  </div>
                  <div className="p-8 bg-[#166534] rounded-[2rem] text-white space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest opacity-60">GUARANTEE</div>
                    <div className="text-xl font-black">Zero-Cost Dispute.</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-8 bg-[#fbbf24] rounded-[2rem] space-y-2">
                    <div className="text-xs font-black uppercase tracking-widest opacity-60">INCIDENT REPORT</div>
                    <div className="text-xl font-black">Fast Resolution.</div>
                  </div>
                  <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2834" className="w-full h-full object-cover" alt="Vetting" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#166534] rounded-full blur-3xl opacity-10 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Reporting & Protocols */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-12 bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <AlertTriangle className="w-40 h-40 text-white" />
            </div>
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-5xl font-black text-white">Serious about Safety.</h2>
              <p className="text-white/60 font-medium text-lg max-w-xl mx-auto">
                Encountered something suspicious? Our dedicated Emergency Response Team is available 24/7 to intervene.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <button className="px-10 py-5 bg-[#fbbf24] text-black rounded-full font-black text-xs uppercase tracking-[0.1em] hover:scale-105 transition-transform">
                  REPORT AN ISSUE
                </button>
                <button className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-full font-black text-xs uppercase tracking-[0.1em] hover:bg-white/20 transition-all">
                  CONTACT SUPPORT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orbit CTA */}
      <section className="relative py-40 md:py-48 bg-[#166534] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[800px] h-[800px] border-[2px] border-white/30 rounded-full animate-[spin_100s_linear_infinite]" />
          <div className="absolute w-[600px] h-[600px] border-[2px] border-white/30 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12 text-white">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 text-white text-[10px] font-black tracking-widest uppercase border border-white/20">
            <Users className="w-4 h-4" /> OUR PROMISE
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1] tracking-tight">
            Safe. Reliable. <br />
            <span className="underline decoration-[#fbbf24] decoration-8 underline-offset-8 text-white">Guaranteed.</span>
          </h2>
          <p className="text-xl text-white/70 font-medium max-w-xl mx-auto leading-relaxed">
            Join the millions who trust GoHandyMate for their home needs. We've got your back.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-6 text-black">
            <div className="flex items-center gap-4 bg-white px-8 py-5 rounded-3xl shadow-2xl">
              <Shield className="w-5 h-5 text-[#166534]" />
              <div className="text-left">
                <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest">GHM PROTECTION</span>
                <span className="text-sm font-black text-[#0A0A0A]">Coverage up to $1,000,000</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
