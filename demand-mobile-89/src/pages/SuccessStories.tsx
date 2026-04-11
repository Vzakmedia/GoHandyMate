import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { Trophy, Star, TrendingUp, Users, DollarSign, Clock, Quote, ArrowRight, CheckCircle2, Sparkles, Play } from "lucide-react";

export const SuccessStories = () => {
  const navigate = useNavigate();

  const stats = [
    { value: "$2.8M+", label: "TOTAL EARNINGS" },
    { value: "15,000+", label: "JOBS COMPLETED" },
    { value: "4.8", label: "AVG. RATING" },
    { value: "127%", label: "INCOME GROWTH" }
  ];

  const stories = [
    {
      name: "Maria Santos",
      profession: "Master Electrician",
      location: "Baltimore, MD",
      earnings: "$14,500/mo",
      growth: "+115%",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop",
      quote: "I was struggling once. GoHandyMate changed everything. Within 3 months, I had a steady stream of customers and doubled my income.",
      color: "bg-blue-50"
    },
    {
      name: "David Kim",
      profession: "General Handyman",
      location: "Annapolis, MD",
      earnings: "$8,200/mo",
      growth: "+85%",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
      quote: "Flexibility was my priority. Now I choose my jobs, set my schedule, and build real relationships with recurring clients.",
      color: "bg-green-50"
    },
    {
      name: "Jennifer Walsh",
      profession: "Interior Painter",
      location: "Frederick, MD",
      earnings: "$11,300/mo",
      growth: "+170%",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
      quote: "GoHandyMate's review system let my work speak for itself. Now I'm booked weeks in advance with a loyal customer base.",
      color: "bg-yellow-50"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="Real success. Real people."
        title="Your journey to the top starts here"
        description="See how thousands of skilled professionals have transformed their independent careers and reached new financial heights with GoHandyMate."
        buttonText="Join the Success"
        onButtonClick={() => console.log("Joining...")}
        backgroundImageUrl="https://images.unsplash.com/photo-1556761175-5973e8ac5817?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Featured Story - Stacked Image Layout */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 relative">
              {/* Stacked Images Pattern */}
              <div className="relative w-full max-w-[500px] aspect-[4/5] mx-auto">
                <div className="absolute -top-6 -right-6 w-full h-full bg-[#fbbf24] rounded-[2.5rem] rotate-3" />
                <div className="absolute inset-0 bg-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl z-10 transition-transform hover:scale-[1.02] duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2000&auto=format&fit=crop"
                    alt="Featured Pro"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-10">
                    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 w-full group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#fbbf24] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-[#166534] fill-current" />
                        </div>
                        <div className="text-white">
                          <div className="text-sm font-black uppercase tracking-widest">WATCH STORY</div>
                          <div className="text-xs opacity-70">2:45 min • High Fidelity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
                <Trophy className="w-3.5 h-3.5" /> MONTHLY FEATURE
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.05] tracking-tight">
                From struggling <br />
                to <span className="text-green-800">Scaling High.</span>
              </h2>
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
                "The day I joined GoHandyMate was the day my business became real. No more chasing leads or worrying about payment trust. I just work and win."
              </p>
              <div className="pt-4 flex items-center gap-4">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop" className="w-14 h-14 rounded-2xl object-cover shadow-lg" alt="Pro" />
                <div>
                  <div className="font-black text-[#0A0A0A]">Marcus Rodriguez</div>
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">HVAC MASTER • TEXAS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-2">
                <div className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] tracking-tighter">
                  {s.value}
                </div>
                <div className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 text-[10px] font-black tracking-[0.15em] uppercase border border-slate-200">
              <Quote className="w-3.5 h-3.5" /> PRO VOICES
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              Meet the professionals <br />
              <span className="text-green-800 leading-normal">driving the future.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story, idx) => (
              <div key={idx} className={`p-10 rounded-[3rem] ${story.color} flex flex-col h-full hover:shadow-2xl transition-all duration-500 group border border-black/5`}>
                <div className="flex-1 space-y-8">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-[#fbbf24] rounded-full rotate-6 group-hover:rotate-12 transition-transform" />
                    <img src={story.image} className="absolute inset-0 w-full h-full rounded-full object-cover border-2 border-white z-10" alt={story.name} />
                  </div>
                  <div className="space-y-4">
                    <div className="text-xl font-medium text-[#0A0A0A]/80 italic leading-relaxed">
                      "{story.quote}"
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-[#0A0A0A] mb-1">{story.name}</h3>
                      <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{story.profession}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-8 bg-white rounded-[2rem] shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AVG. EARNINGS</div>
                      <div className="text-xl font-black text-[#0A0A0A]">{story.earnings}</div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-[#166534] text-[10px] font-black rounded-full">
                      {story.growth}
                    </div>
                  </div>
                  <button className="w-full py-4 border-2 border-black rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                    Full Case Study
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Orbit CTA */}
      <section className="relative py-40 md:py-48 bg-[#166534] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-white rounded-full animate-[ping_4s_ease-in-out_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[1px] border-white rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[10px] font-black tracking-widest uppercase border border-white/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#fbbf24]" /> YOUR STORY STARTS NOW
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1] tracking-tight">
            Ready to join <br />
            <span className="text-[#fbbf24]">the elite?</span>
          </h2>
          <p className="text-xl text-white/70 font-medium max-w-xl mx-auto leading-relaxed">
            Don't just watch from the sidelines. Become our next success story and transform your professional life.
          </p>
          <div className="pt-6">
            <button className="bg-white text-[#166534] px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(0,0,0,0.2)] hover:scale-105 transition-all">
              Apply to Join — Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

