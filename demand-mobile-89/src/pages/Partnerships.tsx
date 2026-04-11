import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { Handshake, Building, Users, Zap, CheckCircle, ArrowRight, Sparkles, Globe, Shield, Rocket, Target, Mail, Phone, ExternalLink } from "lucide-react";

export const Partnerships = () => {
  const navigate = useNavigate();

  const partnershipTypes = [
    {
      title: "Retail Partners",
      description: "Embed our services into your point-of-sale or e-commerce checkout flow.",
      icon: <Building className="w-6 h-6 text-white" />,
      bgColor: "bg-[#166534]"
    },
    {
      title: "Enterprise Solutions",
      description: "Scalable maintenance for property managers, real estate firms, and hospitality.",
      icon: <Globe className="w-6 h-6 text-white" />,
      bgColor: "bg-[#fbbf24]"
    },
    {
      title: "Tech Integrations",
      description: "Power your smart home devices or software with on-demand professional labor.",
      icon: <Zap className="w-6 h-6 text-white" />,
      bgColor: "bg-[#166534]"
    }
  ];

  const featuredAlliances = [
    {
      name: "Home Depot",
      category: "Retail Partnership",
      description: "Providing 2M+ customers with professional installation services directly at checkout.",
      stats: ["2,000+ Stores", "4.8/5 Rating"],
      image: "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?q=80&w=2788"
    },
    {
      name: "Google Nest",
      category: "IoT Integration",
      description: "Predictive maintenance alerts that connect users with pros before a breakdown occurs.",
      stats: ["500K+ Devices", "92% Up-time"],
      image: "https://images.unsplash.com/photo-1558002038-1055907df8d7?q=80&w=2940"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="BETTER TOGETHER"
        title="Strategic Partnerships"
        description="Join an ecosystem of leading brands and technology providers dedicated to creating a more connected and efficient home services industry."
        buttonText="Pitch a Partnership"
        backgroundImageUrl="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Partnership Ecosystem - Hero Grid */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
              <Handshake className="w-3.5 h-3.5" /> THE ECOSYSTEM
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              Ways We Can Collaborate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnershipTypes.map((type, idx) => (
              <div key={idx} className="flex flex-col h-full rounded-[2.5rem] overflow-hidden border border-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] bg-[#FAFAF5] group">
                <div className={`${type.bgColor} h-32 flex items-center justify-center p-8 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-white/10 opacity-20" />
                  <div className="relative z-10 p-4 bg-white/10 backdrop-blur-md rounded-2xl group-hover:scale-110 transition-transform">
                    {type.icon}
                  </div>
                </div>
                <div className="flex-1 p-10 space-y-4">
                  <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight">{type.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{type.description}</p>
                  <div className="pt-4 flex items-center gap-2 text-[#166534] font-black text-[10px] uppercase tracking-widest cursor-pointer">
                    LEARN MORE <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Alliances - High Fidelity Cards */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-500 text-[10px] font-black tracking-[0.15em] uppercase border border-slate-200">
                <Sparkles className="w-3.5 h-3.5" /> SUCCESS STORIES
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                Powering the <br />
                <span className="text-[#166534]">World's Best Brands.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {featuredAlliances.map((ally, idx) => (
              <div key={idx} className="group relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px]">
                <img src={ally.image} alt={ally.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-12 left-12 right-12 space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-2">
                      <span className="px-4 py-1.5 bg-[#fbbf24] text-black text-[10px] font-black uppercase tracking-widest rounded-full">{ally.category}</span>
                      <h3 className="text-4xl font-black text-white">{ally.name}</h3>
                    </div>
                  </div>
                  <p className="text-white/70 font-medium leading-relaxed max-w-sm">{ally.description}</p>
                  <div className="flex gap-4 pt-4">
                    {ally.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
                        {stat}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Brand Equity",
                desc: "Align with a premium, trusted platform known for excellence."
              },
              {
                title: "Deep Integration",
                desc: "Custom APIs and white-label solutions that feel like your own."
              },
              {
                title: "Verified Network",
                desc: "Access 150K+ background-checked and highly rated professionals."
              },
              {
                title: "Data Insights",
                desc: "Rich analytics into user behavior and maintenance trends."
              }
            ].map((b, idx) => (
              <div key={idx} className="p-10 rounded-[2.5rem] bg-[#FAFAF5] border border-black/5 hover:border-[#166534]/30 transition-colors group">
                <CheckCircle className="w-8 h-8 text-[#166534] mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black text-[#0A0A0A] mb-4">{b.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Orbit CTA */}
      <section className="relative py-40 md:py-48 bg-[#fbbf24] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[800px] h-[800px] border-[2px] border-black rounded-full animate-[spin_100s_linear_infinite]" />
          <div className="absolute w-[600px] h-[600px] border-[2px] border-black rounded-full animate-[spin_60s_linear_infinite_reverse]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-black/5 text-black text-[10px] font-black tracking-widest uppercase border border-black/10">
            <Users className="w-4 h-4" /> PARTNERSHIPS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black leading-[1] tracking-tight">
            Scale <br />
            <span className="underline decoration-black decoration-8 underline-offset-8">Without Limits.</span>
          </h2>
          <p className="text-xl text-black/70 font-medium max-w-xl mx-auto leading-relaxed">
            Ready to join the GHM partner network? Let's build something that changes the game.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-6">
            <div className="flex items-center gap-4 bg-white/10 border border-black/10 px-8 py-5 rounded-3xl backdrop-blur-sm">
              <Mail className="w-5 h-5 text-black" />
              <div className="text-left">
                <span className="block text-[8px] font-black text-black/40 uppercase tracking-widest">PARTNERSHIP TEAM</span>
                <span className="text-sm font-black text-black">partnerships@gohandymate.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
