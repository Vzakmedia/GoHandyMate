
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ModernFeaturesSection = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Verified Professionals",
      description: "Every pro on GoHandyMate is thoroughly vetted with identity checks and verified skills for your peace of mind.",
      image: "/features/verify.png",
      bgColor: "bg-[#166534]", // Forest green
    },
    {
      title: "Secure Payment Options",
      description: "Make payments securely through our platform with multiple options including card and escrow-based systems.",
      image: "/features/secure.png",
      bgColor: "bg-[#fbbf24]", // Golden yellow
    },
    {
      title: "Clear, Honest Documentation",
      description: "We simplify the hiring process with clear digital quotes, invoices, and comprehensive job histories.",
      image: "/features/document.png",
      bgColor: "bg-[#166534]", // Forest green
    },
    {
      title: "Dedicated Support",
      description: "Our advisors guide you through your service journey, from your first request to final completion.",
      image: "/features/support.png",
      bgColor: "bg-[#fbbf24]", // Golden yellow
    }
  ];

  return (
    <section id="why-choose" className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16">
          <div className="lg:w-7/12 space-y-4 md:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f8fafc] text-slate-500 text-[10px] sm:text-xs font-black tracking-[0.15em] uppercase border border-slate-200 shadow-sm">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              What We Offer (Core Pillars)
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
              Why Choice <br className="hidden sm:block" />
              <span className="text-green-800">GoHandyMate?</span>
            </h2>
          </div>

          <div className="lg:w-4/12">
            <p className="text-base sm:text-lg text-slate-500 leading-relaxed font-medium mx-auto lg:mx-0 max-w-xl">
              Our mission is to be the most trusted and technology-driven platform for homeowners who want to safely hire professionals for their home service needs.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col h-full rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-black/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-transform duration-500 hover:-translate-y-2">
              {/* Top Section (White) */}
              <div className="flex-1 p-6 md:p-8 bg-white space-y-3 md:space-y-4">
                <h3 className="text-lg md:text-xl font-black text-[#0A0A0A] leading-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>

              {/* Bottom Section (Colored) */}
              <div className={`${feature.bgColor} h-40 md:h-48 flex items-center justify-center p-6 md:p-8 relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-white/10 opacity-20" />
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-24 h-24 md:w-28 md:h-28 object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
