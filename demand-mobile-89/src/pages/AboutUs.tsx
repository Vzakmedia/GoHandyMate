import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { CheckCircle, Star, Award, Users, Shield, Heart, ArrowRight } from "lucide-react";

export const AboutUs = () => {
  const navigate = useNavigate();

  const values = [
    {
      title: "Quality First",
      description: "We set the highest standards for every service. Our pros are vetted and verified to ensure exceptional results every time.",
      image: "/features/verify.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Trust & Safety",
      description: "Your peace of mind is our priority. We provide secure payments, comprehensive insurance, and verified reviews.",
      image: "/features/secure.png",
      bgColor: "bg-[#fbbf24]",
    },
    {
      title: "Local Excellence",
      description: "We empower local professionals to grow their businesses while providing homeowners with the best local talent.",
      image: "/features/document.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Community Growth",
      description: "Building lasting relationships between customers and professionals to create a stronger, more reliable home service ecosystem.",
      image: "/features/support.png",
      bgColor: "bg-[#fbbf24]",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="Why GoHandyMate?"
        title="About GoHandyMate"
        description="We're revolutionizing home services by connecting skilled professionals with customers who need reliable, affordable solutions. Join our platform and discover the future of home service management."
        buttonText="Our Services"
        onButtonClick={() => navigate('/services')}
        backgroundImageUrl="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=2938&auto=format&fit=crop"
      />

      {/* Mission Section - High Fidelity Two-Column */}
      <section className="py-24 lg:px-16 md:px-10 px-4 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Side */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-[#EBEBE0] shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                Our Mission
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.05] tracking-tight">
                Redefining <br />
                Accessibility <br />
                at Home.
              </h2>

              <p className="text-lg text-slate-600 leading-[1.6] max-w-lg font-medium opacity-90">
                To make home maintenance and repairs accessible, transparent, and stress-free for everyone. We believe every home deserves quality care, and every skilled professional deserves fair opportunities to grow their business.
              </p>
            </div>

            {/* Image Side with Decorative Shapes */}
            <div className="relative pt-10 lg:pt-0">
              <div className="absolute bottom-[5%] -left-[10%] w-20 h-40 bg-[#FCD303] rounded-full rotate-[15deg] z-0 shadow-lg" />
              <div className="absolute -top-[15%] -right-[15%] w-80 h-80 bg-yellow-100/40 rounded-full blur-3xl -z-0" />
              <div className="absolute top-[5%] -right-[5%] w-48 h-48 border-[25px] border-[#FCD303]/10 rounded-full z-0 translate-x-1/2 -translate-y-1/2" />

              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border-[14px] border-white max-w-md mx-auto transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2670&auto=format&fit=crop"
                  alt="Professional Team"
                  className="w-full object-cover aspect-[4/5]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section - Two-Column Reversed */}
      <section className="py-24 lg:px-16 md:px-10 px-4 bg-[#FAFAF5] overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[450px] md:h-[600px] flex items-center justify-center lg:justify-start order-2 lg:order-1">
              <div className="absolute left-[5%] top-[15%] w-[65%] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white transform -rotate-6 z-0 grayscale-[0.3] opacity-60">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2940&auto=format&fit=crop" alt="Founding Team" className="w-full h-full object-cover" />
              </div>
              <div className="absolute left-[15%] top-[10%] w-[65%] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transform -rotate-3 z-10 scale-105">
                <img src="https://images.unsplash.com/photo-1556761175-5973e8ac5817?q=80&w=2940&auto=format&fit=crop" alt="Office Work" className="w-full h-full object-cover shadow-blue-500/20 shadow-2xl" />
              </div>
              <div className="absolute left-[25%] top-[5%] w-[65%] aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border-[12px] border-white z-20 transform rotate-1 transition-transform duration-500 hover:rotate-0">
                <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop" alt="Customer Success" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="space-y-10 order-1 lg:order-2">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-[#EBEBE0] shadow-sm">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  Our Story
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                  Founded on <br />
                  <span className="text-green-800">Transparency.</span>
                </h2>
                <div className="space-y-6 text-lg text-slate-500 leading-relaxed font-medium max-w-xl">
                  <p>
                    Founded in 2020, GoHandyMate was born from a simple frustration: finding reliable, skilled professionals for home projects shouldn't be so difficult.
                  </p>
                  <p>
                    After experiencing countless delays and unexpected costs, our founders created a platform that puts quality and customer satisfaction first.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid - High Fidelity Grid */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="lg:w-7/12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f8fafc] text-slate-500 text-[10px] font-black tracking-[0.15em] uppercase border border-slate-200">
                <Award className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                Our Values
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                Guided by <br />
                <span className="text-green-800">Core Principles.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
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
                Ready to join the <br />
                <span className="text-green-700 mt-2 block">GoHandyMate community?</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/services')}
                  className="bg-[#166534] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-xl hover:bg-[#14532d] transition-colors"
                >
                  Explore Services
                </button>
                <button
                  onClick={() => navigate('/sign-up-pro')}
                  className="bg-white text-[#166534] px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-lg hover:bg-slate-50 transition-colors border border-green-100"
                >
                  Join as a Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

