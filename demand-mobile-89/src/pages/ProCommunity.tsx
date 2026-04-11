import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { MessageSquare, Calendar, Award, Globe, Handshake, Users, Sparkles, ArrowRight, MessageCircle, Heart, Share2, PlusCircle } from "lucide-react";

export const ProCommunity = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Discussion Forums",
      description: "Share knowledge, ask questions, and get advice from experienced professionals in your field.",
      image: "/features/document.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Events & Meetups",
      description: "Join local meetups, webinars, and training events to network and learn new skills.",
      image: "/features/profile.png",
      bgColor: "bg-[#fbbf24]",
    },
    {
      title: "Expert Recognition",
      description: "Get recognized for your contributions and achievements within the community.",
      image: "/features/verify.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Direct Networking",
      description: "Connect directly with pros in your area for collaboration and local project sharing.",
      image: "/features/support.png",
      bgColor: "bg-[#fbbf24]",
    }
  ];

  const categories = [
    {
      icon: "💬",
      name: "General Discussion",
      description: "Share experiences and general professional topics with the whole community.",
      stats: "5.6k members • 1.2k posts",
      color: "bg-blue-50"
    },
    {
      icon: "🔧",
      name: "Technical Help",
      description: "Get help with technical challenges and niche installation solutions.",
      stats: "3.4k members • 892 posts",
      color: "bg-green-50"
    },
    {
      icon: "📈",
      name: "Business Tips",
      description: "Share business growth strategies, pricing advice, and client management.",
      stats: "2.8k members • 634 posts",
      color: "bg-yellow-50"
    }
  ];

  const discussions = [
    {
      title: "Best practices for pricing electrical work in 2025",
      author: "Mike Thompson",
      category: "Business Tips",
      replies: 23,
      time: "2h ago",
      featured: true
    },
    {
      title: "New safety regulations for high-rise maintenance",
      author: "Sarah Jenkins",
      category: "Technical Help",
      replies: 15,
      time: "4h ago",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="Connect, learn, and grow"
        title="The Professional Hub"
        description="Join thousands of skilled professionals. Share experiences, get advice, and build lasting relationships in the industry's most active community."
        buttonText="Enter Community"
        onButtonClick={() => console.log("Entering Community...")}
        backgroundImageUrl="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Feature Grid Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="lg:w-8/12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-green-100 shadow-sm">
                <Users className="w-3.5 h-3.5 text-green-600" />
                COMMUNITY PERKS
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                Built for <br />
                <span className="text-green-800">Connection & Success.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((v, idx) => (
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

      {/* Categories Section - Role Cards Style */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-500 text-[11px] font-black tracking-[0.15em] uppercase border border-slate-200 shadow-sm">
              <MessageSquare className="w-3.5 h-3.5" />
              FORUM SPACES
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              Explore specialized discussions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, idx) => (
              <div key={idx} className={`${cat.color} p-10 rounded-[3rem] border border-black/5 flex flex-col h-full hover:shadow-2xl transition-all duration-500`}>
                <div className="flex-1 space-y-6">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight">{cat.name}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{cat.description}</p>
                </div>

                <div className="mt-10 p-6 bg-white rounded-3xl shadow-sm space-y-4">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">{cat.stats}</div>
                  <button className="flex items-center gap-2 text-sm font-black text-[#166534] hover:gap-3 transition-all">
                    Join Discussion <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discussions Section - High Fidelity List */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="text-[10px] font-black tracking-widest text-[#166534] uppercase">RECENT ACTIVITY</div>
              <h3 className="text-3xl md:text-4xl font-black text-[#0A0A0A]">Trending Conversations</h3>
            </div>
            <button className="text-sm font-black underline underline-offset-8 decoration-2 decoration-[#fbbf24] hover:text-[#166534] transition-colors">VIEW ALL</button>
          </div>

          <div className="space-y-6">
            {discussions.map((d, idx) => (
              <div key={idx} className="group p-8 rounded-[2rem] border border-black/5 bg-[#FAFAF5] hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {d.featured && (
                        <span className="px-3 py-1 bg-[#fbbf24] text-black text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm">Featured</span>
                      )}
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.category}</span>
                    </div>
                    <h4 className="text-xl font-black text-[#0A0A0A] group-hover:text-[#166534] transition-colors">
                      {d.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                      <span>by <b>{d.author}</b></span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>{d.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-black text-[#0A0A0A]">{d.replies}</span>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Replies</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-black/5 flex items-center justify-center bg-white group-hover:bg-[#166534] group-hover:text-white transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Circular Orbit layout */}
      <section className="relative py-40 md:py-48 bg-[#DFF3EA] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-[#166534]/10 rounded-full animate-[spin_60s_linear_infinite]" />
          <div className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] border border-[#166534]/5 rounded-full animate-[spin_80s_linear_infinite_reverse]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-[#166534] text-[10px] font-black tracking-widest uppercase border border-[#166534]/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#fbbf24]" /> JOIN THE CIRCLE
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#166534] leading-[1.05] tracking-tight">
              Better Together. <br />
              <span className="text-green-700 block">Stronger as Professionals.</span>
            </h2>
            <p className="text-lg text-[#166534]/70 font-medium max-w-xl mx-auto leading-relaxed">
              Connect with 15,000+ handymen worldwide. Share problems, find solutions, and grow your local network today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="bg-[#166534] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-xl hover:bg-[#14532d] transition-all hover:scale-105">
                Join Now — Free
              </button>
              <button className="bg-white text-[#166534] px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-all border border-green-100">
                View Guidelines
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

