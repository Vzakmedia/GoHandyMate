import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { Download, Calendar, ExternalLink, Sparkles, Newspaper, FileText, Image as ImageIcon, Video, Mic, Share2, Mail, Phone, Users, ArrowRight } from "lucide-react";

export const Press = () => {
  const navigate = useNavigate();

  const mediaFeatures = [
    {
      logo: "TechCrunch",
      title: "GoHandyMate is the 'Uber for Home Services' the industry needs.",
      date: "Oct 2024",
      bgColor: "bg-[#166534]",
    },
    {
      logo: "Forbes",
      title: "How GHM is empowering thousands of local professionals to digitize.",
      date: "Nov 2024",
      bgColor: "bg-[#fbbf24]",
    },
    {
      logo: "Business Insider",
      title: "The $50M bet on the future of professional home maintenance.",
      date: "Dec 2024",
      bgColor: "bg-[#166534]",
    }
  ];

  const pressReleases = [
    {
      date: "Dec 15, 2024",
      category: "FINANCIAL",
      title: "GoHandyMate Announces $50M Series B Funding led by Global Ventures",
      excerpt: "The new capital will accelerate GHM's expansion into 10 new metropolitan areas and drive AI innovation."
    },
    {
      date: "Nov 28, 2024",
      category: "PRODUCT",
      title: "Launching GHM Pro Elite: A New Standard for Home Service Excellence",
      excerpt: "New certification program ensures highest level of trust and quality for premium homeowners."
    },
    {
      date: "Oct 10, 2024",
      category: "PARTNERSHIP",
      title: "GoHandyMate Partners with National Real Estate Association",
      excerpt: "Providing seamless maintenance solutions to over 500,000 property managers nationwide."
    }
  ];

  const mediaKit = [
    {
      icon: <ImageIcon className="w-6 h-6 text-[#166534]" />,
      title: "Logos & Assets",
      desc: "SVG and PNG logo marks, wordmarks, and color palette.",
      size: "4.2 MB"
    },
    {
      icon: <FileText className="w-6 h-6 text-[#166534]" />,
      title: "Brand Book",
      desc: "Guidelines for typography, voice, and visual identity.",
      size: "8.1 MB"
    },
    {
      icon: <Users className="w-6 h-6 text-[#166534]" />,
      title: "Executive Bios",
      desc: "Professional headshots and bios for the GHM leadership team.",
      size: "12.4 MB"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="THE GHM STORY"
        title="Press & Media"
        description="Everything you need to know about GoHandyMate—our mission, our milestones, and the people behind the revolution."
        buttonText="Download Media Kit"
        backgroundImageUrl="https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Featured Media - Hero Grid */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
              <Newspaper className="w-3.5 h-3.5" /> IN THE NEWS
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              Making Headlines Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mediaFeatures.map((item, idx) => (
              <div key={idx} className="flex flex-col h-full rounded-[2.5rem] overflow-hidden border border-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] bg-[#FAFAF5]">
                <div className={`${item.bgColor} h-32 flex items-center justify-center p-8 relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-white/10 opacity-20" />
                  <span className="text-white font-black text-2xl tracking-tighter relative z-10">{item.logo}</span>
                </div>
                <div className="flex-1 p-10 space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                  <h3 className="text-xl font-black text-[#0A0A0A] leading-tight group-hover:text-[#166534] transition-colors cursor-pointer capitalize italic">
                    "{item.title}"
                  </h3>
                  <div className="pt-4 flex items-center gap-2 text-[#166534] font-black text-[10px] uppercase tracking-widest">
                    READ ARTICLE <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-[#0A0A0A] mb-12 tracking-tight">Latest Press Releases</h2>
          <div className="space-y-6">
            {pressReleases.map((news, idx) => (
              <div key={idx} className="group bg-white p-10 rounded-[2.5rem] border border-black/5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-[#FAFAF5] border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#166534]">{news.category}</span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar className="w-3 h-3" /> {news.date}
                    </span>
                  </div>
                  <Share2 className="w-5 h-5 text-slate-300 group-hover:text-[#166534] transition-colors" />
                </div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4 leading-tight group-hover:text-[#166534] transition-colors">{news.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-3xl">{news.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Resources */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="md:w-7/12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
                <Sparkles className="w-3.5 h-3.5" /> PRESS TOOLKIT
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-tight tracking-tight">
                Visuals & <br />
                <span className="text-[#fbbf24]">Brand Assets</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mediaKit.map((item, idx) => (
              <div key={idx} className="bg-[#FAFAF5] p-10 rounded-[3rem] border border-black/5 flex flex-col items-center text-center group hover:bg-white hover:shadow-3xl transition-all duration-500">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">{item.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{item.desc}</p>
                <button className="mt-auto w-full py-4 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#166534] transition-colors flex items-center justify-center gap-2 group/btn">
                  DOWNLOAD {item.size} <Download className="w-3.5 h-3.5 group-hover/btn:animate-bounce" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-40 md:py-48 bg-[#166534] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <div className="w-[1000px] h-[1000px] border-[2px] border-white rounded-full animate-[spin_120s_linear_infinite]" />
          <div className="absolute w-[700px] h-[700px] border-[2px] border-white rounded-full animate-[spin_80s_linear_infinite_reverse]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 text-white/80 text-[10px] font-black tracking-widest uppercase border border-white/10">
            <Mail className="w-4 h-4" /> PRESS INQUIRIES
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1] tracking-tight">
            Let's tell <br />
            <span className="text-[#fbbf24] underline decoration-white decoration-8 underline-offset-8">a story together.</span>
          </h2>
          <p className="text-xl text-white/70 font-medium max-w-xl mx-auto leading-relaxed">
            Need an interview, data insights, or custom visual assets? Our communications team is here to help.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-6">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-5 rounded-3xl backdrop-blur-sm">
              <Mail className="w-5 h-5 text-[#fbbf24]" />
              <div className="text-left">
                <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest">EMAIL US</span>
                <span className="text-sm font-black text-white">press@gohandymate.com</span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-5 rounded-3xl backdrop-blur-sm">
              <Phone className="w-5 h-5 text-[#fbbf24]" />
              <div className="text-left">
                <span className="block text-[8px] font-black text-white/40 uppercase tracking-widest">CALL US</span>
                <span className="text-sm font-black text-white">+1 (240) 444-7350</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
