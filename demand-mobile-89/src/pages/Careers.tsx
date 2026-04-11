import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { Briefcase, MapPin, Clock, DollarSign, Users, Award, Sparkles, Heart, Rocket, Target, Zap, ArrowRight, Play } from "lucide-react";

export const Careers = () => {
  const navigate = useNavigate();

  const perks = [
    {
      title: "Competitive Salary",
      description: "Market-leading compensation with equity upside and performance bonuses.",
      image: "/features/profile.png",
      bgColor: "bg-[#fbbf24]",
    },
    {
      title: "Remote First",
      description: "Work from anywhere in the world. We value output over seat time.",
      image: "/features/support.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Health & Wellness",
      description: "Comprehensive dental, medical, and vision. Plus a monthly wellness stipend.",
      image: "/features/verify.png",
      bgColor: "bg-[#fbbf24]",
    },
    {
      title: "Growth Path",
      description: "Dedicated budget for courses, conferences, and career coaching.",
      image: "/features/document.png",
      bgColor: "bg-[#166534]",
    }
  ];

  const values = [
    {
      icon: <Heart className="w-6 h-6 text-red-600" />,
      title: "Humans First",
      description: "We build for humans, by humans. Empathy is our core operating system.",
      color: "bg-red-50"
    },
    {
      icon: <Rocket className="w-6 h-6 text-blue-600" />,
      title: "Velocity",
      description: "We move fast, learn faster, and iterate until we achieve excellence.",
      color: "bg-blue-50"
    },
    {
      icon: <Target className="w-6 h-6 text-green-600" />,
      title: "Radical Focus",
      description: "We say no to a thousand things so we can say yes to the right one.",
      color: "bg-green-50"
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: "Innovation",
      description: "We don't follow trends. We create the future of home services.",
      color: "bg-yellow-50"
    }
  ];

  const jobs = [
    {
      title: "Senior Product Designer",
      category: "Design",
      location: "Remote",
      type: "Full-time",
      experience: "5+ Years",
      salary: "$120k - $160k"
    },
    {
      title: "Fullstack Engineer (React/Node)",
      category: "Engineering",
      location: "Baltimore / Remote",
      type: "Full-time",
      experience: "4+ Years",
      salary: "$130k - $180k"
    },
    {
      title: "Growth Marketing Manager",
      category: "Marketing",
      location: "Remote",
      type: "Full-time",
      experience: "3+ Years",
      salary: "$100k - $140k"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="WE ARE GROWING FAST"
        title="Build the future of connection"
        description="Join a world-class team of designers, engineers, and dreamers dedicated to revolutionizing how legacy industries operate in a digital world."
        buttonText="See All Openings"
        onButtonClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
        backgroundImageUrl="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Life at GHM - Feature Grid */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
            <div className="lg:w-8/12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
                <Sparkles className="w-3.5 h-3.5" /> LIFE AT GHM
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                Work with the <br />
                <span className="text-green-800">Best in the World.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {perks.map((v, idx) => (
              <div key={idx} className="flex flex-col h-full rounded-[2.5rem] overflow-hidden border border-black/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] bg-[#FAFAF5]">
                <div className="flex-1 p-8 space-y-4">
                  <h3 className="text-xl font-black text-[#0A0A0A] leading-tight">{v.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{v.description}</p>
                </div>
                <div className={`${v.bgColor} h-40 flex items-center justify-center p-8 relative overflow-hidden group`}>
                  <div className="absolute inset-0 bg-white/10 opacity-20" />
                  <img src={v.image} alt={v.title} className="w-20 h-20 object-contain relative z-10 transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-500 text-[11px] font-black tracking-[0.15em] uppercase border border-slate-200">
              <Target className="w-3.5 h-3.5" /> OUR NORTH STAR
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              The Values that Drive Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[3rem] border border-black/5 hover:shadow-2xl transition-all duration-500 group">
                <div className={`w-14 h-14 ${val.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                  {val.icon}
                </div>
                <h3 className="text-2xl font-black text-[#0A0A0A] mb-4">{val.title}</h3>
                <p className="text-slate-600 font-medium leading-relaxed">{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section id="open-positions" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="space-y-4">
              <div className="text-[10px] font-black tracking-[0.2em] text-[#166534] uppercase">CURRENT OPENINGS</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">Ready to Apply?</h2>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 rounded-full border border-black/10 text-xs font-black uppercase tracking-widest bg-slate-50">ALL JOBS</button>
              <button className="px-6 py-2 rounded-full border border-black/10 text-xs font-black uppercase tracking-widest">REMOTE</button>
            </div>
          </div>

          <div className="space-y-6">
            {jobs.map((job, idx) => (
              <div key={idx} className="group p-10 rounded-[2.5rem] border border-black/5 bg-[#FAFAF5] hover:bg-white hover:shadow-3xl hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-1.5 bg-white border border-black/5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#166534]">{job.category}</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0A0A0A] group-hover:text-[#166534] transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {job.type}</span>
                      <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                    </div>
                  </div>
                  <button className="bg-black text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#166534] transition-colors shadow-xl group-hover:scale-105">
                    Apply Now
                  </button>
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
            <Users className="w-4 h-4" /> OUR CULTURE
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black leading-[1] tracking-tight">
            Don't just watch. <br />
            <span className="underline decoration-black decoration-8 underline-offset-8">Be the Spark.</span>
          </h2>
          <p className="text-xl text-black/70 font-medium max-w-xl mx-auto leading-relaxed">
            We are looking for the misfits, the rebels, and the geniuses who want to build something that outlasts them.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-[#166534] text-white px-12 py-6 rounded-full font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
              Send Open Application
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
