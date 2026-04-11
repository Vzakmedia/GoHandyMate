import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { Search, UserCheck, Calendar, Star, Shield, Clock, DollarSign, CheckCircle, Award, Users, ArrowRight } from "lucide-react";

export const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      title: "Describe Your Task",
      description: "Tell us what you need done. Be as specific as possible to get the best matches.",
    },
    {
      number: "02",
      title: "Browse Verified Pros",
      description: "Review profiles, verified skills, and customer ratings to find your perfect professional.",
    },
    {
      number: "03",
      title: "Get Instant Quotes",
      description: "Receive transparent pricing and digital quotes directly through our platform.",
    },
    {
      number: "04",
      title: "Schedule & Complete",
      description: "Choose your professional, schedule the work, and pay securely once satisfied.",
    }
  ];

  const benefits = [
    {
      title: "Verified Talent",
      description: "Every professional undergoes comprehensive background and identity verification.",
      image: "/features/profile.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Fair Pricing",
      description: "Transparent quotes and competitive rates with no hidden platform fees.",
      image: "/features/secure.png",
      bgColor: "bg-[#fbbf24]",
    },
    {
      title: "Secure Payments",
      description: "Your money is held securely and only released when you confirm the job is done.",
      image: "/features/document.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Dedicated Support",
      description: "Our team is here to help you at every step of your home service journey.",
      image: "/features/support.png",
      bgColor: "bg-[#fbbf24]",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="Simple 4-step process"
        title="How GoHandyMate Works"
        description="Getting your home projects done has never been easier. Here's how our platform connects you with skilled professionals."
        backgroundImageUrl="https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2940&auto=format&fit=crop"
        buttonText="Start My Project"
        onButtonClick={() => navigate('/services')}
      />

      {/* Process Section - Vertical Timeline & Image Stack */}
      <section className="py-24 lg:px-16 md:px-10 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Image Stack Side */}
            <div className="relative h-[500px] md:h-[600px] order-2 lg:order-1">
              <div className="absolute left-0 top-[10%] w-[70%] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform -rotate-6 z-0 grayscale-[0.2] opacity-70">
                <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop" alt="Step 1" className="w-full h-full object-cover" />
              </div>
              <div className="absolute left-[15%] top-[5%] w-[70%] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-3 z-10">
                <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2670&auto=format&fit=crop" alt="Step 2" className="w-full h-full object-cover" />
              </div>
              <div className="absolute left-[30%] top-0 w-[70%] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border-[12px] border-white z-20 transform -rotate-1 transition-transform duration-500 hover:rotate-0">
                <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop" alt="Step 3" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Timeline Side */}
            <div className="space-y-12 order-1 lg:order-2">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-[#EBEBE0] shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-green-600" />
                  How it works
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                  Seamless steps <br />
                  to a <span className="text-green-800">Perfect Home.</span>
                </h2>
              </div>

              <div className="relative space-y-10">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />
                {steps.map((step, idx) => (
                  <div key={idx} className="relative flex gap-10 group">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:border-green-600 group-hover:text-green-600 transition-colors bg-white">
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
          </div>
        </div>
      </section>

      {/* Benefits Section - High Fidelity Grid */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="lg:w-7/12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-500 text-[10px] font-black tracking-[0.15em] uppercase border border-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                CORE ADVANTAGES
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                Designed for <br />
                <span className="text-green-800">Your Peace of Mind.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((v, idx) => (
              <div key={idx} className="flex flex-col h-full rounded-[2rem] overflow-hidden border border-black shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:-translate-y-1">
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

      {/* Final CTA - Orbit Layout Style */}
      <section className="relative py-40 md:py-48 bg-[#DFF3EA] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-[#166534]/10 rounded-full" />
          <div className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] border border-[#166534]/5 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-3xl space-y-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#166534] leading-[1.1] tracking-tight">
                Experience the <br />
                <span className="text-green-700 mt-2 block">Difference Today.</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/services')}
                  className="bg-[#166534] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-xl hover:bg-[#14532d] transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/about-us')}
                  className="bg-white text-[#166534] px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-colors border border-green-100"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

import { Sparkles } from "lucide-react";

