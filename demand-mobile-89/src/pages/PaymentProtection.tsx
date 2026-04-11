import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/shared/LandingHero";
import { Shield, Lock, CreditCard, Banknote, RefreshCcw, CheckCircle, ArrowRight, Zap, Sparkles, Target, Users, Mail, Phone, ExternalLink, ShieldCheck, Wallet } from "lucide-react";

export const PaymentProtection = () => {
  const navigate = useNavigate();

  const protectionSteps = [
    {
      title: "Secured Booking",
      description: "Your payment is authorized but not captured until the pro accepts the job.",
      icon: <Lock className="w-5 h-5 text-white" />
    },
    {
      title: "Escrow Protection",
      description: "Funds are held securely in our GHM vault while the work is being performed.",
      icon: <Shield className="w-5 h-5 text-white" />
    },
    {
      title: "Approval Release",
      description: "Payment is only released to the professional once you confirm the work is complete.",
      icon: <CheckCircle className="w-5 h-5 text-white" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="SECURE TRANSACTIONS"
        title="Payment Protection"
        description="Your money is safe with us. Our advanced escrow system ensures that professionals only get paid when the job is done to your satisfaction."
        buttonText="How It Works"
        backgroundImageUrl="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2940&auto=format&fit=crop"
      />

      {/* How Protection Works - Vertical Timeline */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
              <Wallet className="w-3.5 h-3.5" /> THE PAY-SAFE PROTOCOL
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              Your Money, <span className="text-[#166534]">Protected.</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {protectionSteps.map((step, idx) => (
              <div key={idx} className="flex gap-8 md:gap-12 group pb-12 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-[#166534] rounded-2xl flex items-center justify-center relative z-10 shadow-xl group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  {idx !== protectionSteps.length - 1 && (
                    <div className="w-1 h-full bg-slate-100 mt-4 rounded-full" />
                  )}
                </div>
                <div className="pt-2 space-y-4">
                  <h3 className="text-2xl font-black text-[#0A0A0A]">{step.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed text-lg max-w-xl">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features & Security - High Fidelity Grid */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Full Refund Policy",
                desc: "Not satisfied? Our disputes team regulates refunds based on work evidence.",
                icon: <RefreshCcw className="w-6 h-6 text-[#166534]" />
              },
              {
                title: "Encrypted Data",
                desc: "We use 256-bit SSL encryption to keep your financial details private.",
                icon: <ShieldCheck className="w-6 h-6 text-[#166534]" />
              },
              {
                title: "Fraud Detection",
                desc: "Automated systems monitor for suspicious activity and unauthorized charges.",
                icon: <Zap className="w-6 h-6 text-[#166534]" />
              }
            ].map((f, idx) => (
              <div key={idx} className="p-10 rounded-[2.5rem] bg-white border border-black/5 shadow-sm hover:translate-y-[-8px] transition-all duration-500">
                <div className="w-12 h-12 bg-[#FAFAF5] rounded-xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-[#0A0A0A] mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
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
            <CreditCard className="w-4 h-4" /> SECURE PAY
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-black leading-[1] tracking-tight">
            Worry-Free <br />
            <span className="underline decoration-black decoration-8 underline-offset-8">Payments.</span>
          </h2>
          <p className="text-xl text-black/70 font-medium max-w-xl mx-auto leading-relaxed">
            Join the community of homeowners who never have to worry about contractors disappearing with their money.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center gap-6">
            <div className="flex items-center gap-4 bg-white/10 border border-black/10 px-8 py-5 rounded-3xl backdrop-blur-sm">
              <Lock className="w-5 h-5 text-black" />
              <div className="text-left">
                <span className="block text-[8px] font-black text-black/40 uppercase tracking-widest">ENCRYPTION</span>
                <span className="text-sm font-black text-black">Bank-Grade Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
