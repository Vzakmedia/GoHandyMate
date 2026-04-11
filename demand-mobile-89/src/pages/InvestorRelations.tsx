import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { TrendingUp, Download, Calendar, Users, DollarSign, BarChart, Sparkles, Target, Zap, Rocket, Shield, Globe, ArrowRight, Mail, Phone, Clock } from "lucide-react";

export const InvestorRelations = () => {
  const navigate = useNavigate();

  const metrics = [
    {
      icon: <TrendingUp className="w-5 h-5 text-[#166534]" />,
      value: "$2.4B",
      label: "Total GMV",
      trend: "+145% YoY",
      bgColor: "bg-green-50"
    },
    {
      icon: <Users className="w-5 h-5 text-[#fbbf24]" />,
      value: "150K+",
      label: "Pros on Platform",
      trend: "+82% YoY",
      bgColor: "bg-yellow-50"
    },
    {
      icon: <DollarSign className="w-5 h-5 text-[#166534]" />,
      value: "$210M",
      label: "Revenue ARR",
      trend: "+112% YoY",
      bgColor: "bg-green-50"
    },
    {
      icon: <BarChart className="w-5 h-5 text-[#fbbf24]" />,
      value: "4.2x",
      label: "LTV / CAC",
      trend: "Industry Lead",
      bgColor: "bg-yellow-50"
    }
  ];

  const pillars = [
    {
      title: "Market Leadership",
      desc: "Dominating the $500B fragmented home services market through proprietary matching tech.",
      icon: <Target className="w-6 h-6 text-white" />,
      color: "bg-[#166534]"
    },
    {
      title: "Scalable Economics",
      desc: "High-margin take-rates combined with low customer acquisition costs and extreme retention.",
      icon: <Zap className="w-6 h-6 text-white" />,
      color: "#fbbf24" // Will use style for custom colors
    },
    {
      title: "Global Expansion",
      desc: "Rapidly scaling from US coastal hubs to international metropolitan service centers.",
      icon: <Globe className="w-6 h-6 text-white" />,
      color: "bg-[#166534]"
    }
  ];

  const resources = [
    {
      title: "Q4 2024 Earnings",
      type: "QUARTERLY REPORT",
      date: "Jan 15, 2025",
      size: "2.4 MB"
    },
    {
      title: "2024 Annual Report",
      type: "ANNUAL FILING",
      date: "Dec 31, 2024",
      size: "8.1 MB"
    },
    {
      title: "Investor Deck",
      type: "PRESENTATION",
      date: "Nov 2024",
      size: "15.4 MB"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="BUILDING VALUE"
        title="Investor Relations"
        description="GoHandyMate is redefining the labor economy. Join us as we build the world's most trusted infrastructure for home services."
        buttonText="View Financials"
        backgroundImageUrl="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Performance Metrics - Feature Grid */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
              <TrendingUp className="w-3.5 h-3.5" /> AT A GLANCE
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              Growth that Defies Gravity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, idx) => (
              <div key={idx} className="bg-[#FAFAF5] p-10 rounded-[2.5rem] border border-black/5 hover:bg-white hover:shadow-3xl transition-all duration-500 group">
                <div className={`w-12 h-12 ${m.bgColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {m.icon}
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black text-[#0A0A0A] tracking-tighter">{m.value}</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{m.label}</div>
                  <div className="pt-2 text-[10px] font-black text-[#166534] uppercase tracking-widest">{m.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Pillars - Two Column */}
      <section className="py-24 bg-[#FAFAF5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-500 text-[10px] font-black tracking-[0.15em] uppercase border border-slate-200">
                  <Shield className="w-3.5 h-3.5" /> OUR STRATEGY
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                  The Core Pillars of <br />
                  <span className="text-[#166534]">Long-term Value.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                  We aren't just building an app. We are building the operating system for a half-trillion dollar industry.
                </p>
              </div>

              <div className="grid gap-4">
                {pillars.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-xl transition-all group">
                    <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform ${typeof p.color === 'string' && p.color.startsWith('bg') ? p.color : ''}`}
                      style={!p.color?.toString().startsWith('bg') ? { backgroundColor: p.color as string } : {}}>
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-[#0A0A0A]">{p.title}</h3>
                      <p className="text-sm text-slate-500 font-medium">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative rounded-[3rem] overflow-hidden shadow-3xl aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=2940" alt="Strategy" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-12 left-12 right-12">
                  <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20">
                    <div className="text-3xl font-black text-white mb-2">94%</div>
                    <div className="text-xs font-black text-white/60 uppercase tracking-widest">Customer Satisfaction Score</div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#fbbf24] rounded-full blur-3xl opacity-20 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Investor Resources - Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="text-[10px] font-black tracking-[0.2em] text-[#166534] uppercase">RESOURCES</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">Investor Toolkit</h2>
            </div>
            <button className="px-8 py-4 rounded-full border border-black/10 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">VIEW ALL FILINGS</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((res, idx) => (
              <div key={idx} className="group p-10 rounded-[3rem] border border-black/5 bg-[#FAFAF5] hover:bg-white hover:shadow-3xl transition-all duration-500">
                <div className="flex justify-between items-start mb-8">
                  <div className="px-4 py-1.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#166534]">
                    {res.type}
                  </div>
                  <div className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center group-hover:bg-[#166534] group-hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4 group-hover:text-[#166534] transition-colors">{res.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-auto">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {res.date}</span>
                  <span>{res.size}</span>
                </div>
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
            <Users className="w-4 h-4" /> CONNECT WITH US
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black leading-[1] tracking-tight">
            Invest in the <br />
            <span className="underline decoration-black decoration-8 underline-offset-8">Next Big Wave.</span>
          </h2>
          <p className="text-xl text-black/70 font-medium max-w-xl mx-auto leading-relaxed">
            Join a community of forward-thinking investors who believe in the power of professional connection.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-6">
            <div className="flex items-center gap-4 bg-white/10 border border-black/10 px-8 py-5 rounded-3xl backdrop-blur-sm">
              <Mail className="w-5 h-5 text-black" />
              <div className="text-left">
                <span className="block text-[8px] font-black text-black/40 uppercase tracking-widest">INVESTOR INQUIRIES</span>
                <span className="text-sm font-black text-black">investors@gohandymate.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
