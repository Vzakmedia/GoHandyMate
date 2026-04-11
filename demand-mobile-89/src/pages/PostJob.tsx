
import { ArrowLeft, Plus, MapPin, Clock, DollarSign, Sparkles, Users, CheckCircle, Star, Loader2, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomerReviews } from "@/hooks/useCustomerReviews";
import { LandingHero } from "@/components/shared/LandingHero";

export const PostJob = () => {
  const navigate = useNavigate();
  const { reviews, loading, error } = useCustomerReviews(6);

  const categories = [
    { name: "Plumbing", count: "1.2k+ Pros", icon: "🔧", bgColor: "bg-blue-50" },
    { name: "Electrical", count: "980+ Pros", icon: "⚡", bgColor: "bg-yellow-50" },
    { name: "Painting", count: "2.1k+ Pros", icon: "🎨", bgColor: "bg-pink-50" },
    { name: "Carpentry", count: "1.5k+ Pros", icon: "🔨", bgColor: "bg-orange-50" },
    { name: "HVAC", count: "830+ Pros", icon: "❄️", bgColor: "bg-cyan-50" },
    { name: "Cleaning", count: "3.4k+ Pros", icon: "🧽", bgColor: "bg-green-50" },
    { name: "Landscaping", count: "1.8k+ Pros", icon: "🌱", bgColor: "bg-emerald-50" },
    { name: "Moving", count: "740+ Pros", icon: "📦", bgColor: "bg-slate-50" }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-[#166534] hover:opacity-70 transition-opacity group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secure Job Posting</div>
        </div>
      </div>

      <LandingHero
        topic="Fast & Reliable"
        title="Post Your Project, Get Expert Quotes."
        description="Connect with thousands of verified local professionals. Simply describe what you need and watch the offers come in."
        buttonText="Get Started Now"
        onButtonClick={() => navigate('/services')}
        backgroundImageUrl="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2940&auto=format&fit=crop"
      />

      {/* How It Works - Premium Design */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
              <Zap className="w-3.5 h-3.5 text-green-600" />
              THE PROCESS
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
              Three simple steps to <span className="text-green-800">success.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line (Desktop) */}
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-px border-t border-dashed border-slate-200 -z-0" />

            {[
              {
                step: "01",
                title: "Describe Your Job",
                desc: "Tell us what you need done, when you need it, and your budget. Photos help pros give accurate quotes.",
                color: "bg-blue-600"
              },
              {
                step: "02",
                title: "Get Matched",
                desc: "Qualified professionals in your area will review your job and send you personalized, competitive quotes.",
                color: "bg-green-600"
              },
              {
                step: "03",
                title: "Choose & Book",
                desc: "Compare quotes, read verified reviews, and book the professional that best fits your specific needs.",
                color: "bg-[#fbbf24]"
              }
            ].map((s, idx) => (
              <div key={idx} className="relative z-10 group text-center space-y-6">
                <div className={`${s.color} w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <span className="text-xl font-black text-white">{s.step}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-[#0A0A0A]">{s.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories - Premium Cards */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <div className="text-[10px] font-black tracking-widest text-[#166534] uppercase italic">POPULAR REQUESTS</div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A]">What can we help <br /> you with today?</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <div key={cat.name} className={`${cat.bgColor} p-8 rounded-[2.5rem] border border-black/5 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group`}>
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="text-lg font-black text-[#0A0A0A] mb-1">{cat.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section - Feature Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[9px] font-black tracking-widest uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                TRUSTED NETWORK
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] leading-tight tracking-tight">
                Why thousands trust <br />
                <span className="text-green-800">GoHandyMate.</span>
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                We've built a platform where quality meets reliability. Every professional is vetted to ensure your peace of mind.
              </p>

              <div className="grid sm:grid-cols-2 gap-8 pt-4">
                {[
                  { icon: MapPin, title: "Local Pros", desc: "Vetted experts in your zip code." },
                  { icon: Clock, title: "Fast Replies", desc: "Quotes in under 30 minutes." },
                  { icon: DollarSign, title: "Fair Pricing", desc: "Compare and save easily." },
                  { icon: CheckCircle, title: "Guaranteed", desc: "Satisfaction on every job." }
                ].map((f, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#FAFAF5] flex items-center justify-center">
                      <f.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-[#0A0A0A] text-sm">{f.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1581578731522-9b7c6666016e?q=80&w=2940&auto=format&fit=crop"
                  alt="Professional at work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2rem] shadow-2xl border border-black/5 animate-bounce-slow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Star className="w-6 h-6 text-green-600 fill-green-600" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#0A0A0A]">4.9/5</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-nowrap">Average Pro Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Premium Cards */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#0A0A0A]">Success Stories</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin text-green-600" />
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading verified reviews...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-500 group">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed italic mb-8 h-24 overflow-hidden line-clamp-4 group-hover:text-black transition-colors">
                    "{review.review_text}"
                  </p>
                  <div className="flex items-center gap-4 pt-6 border-t border-black/5">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-black/5 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${review.customer_name}`} alt={review.customer_name} />
                    </div>
                    <div>
                      <p className="font-black text-sm text-[#0A0A0A]">{review.customer_name}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{review.customer_location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32 bg-[#166534] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DFF3EA] rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Ready to cross that <br />
            <span className="text-[#DFF3EA]">task off your list?</span>
          </h2>
          <p className="text-lg text-white/70 font-medium max-w-xl mx-auto">
            Join 50,000+ homeowners who found their perfect professional match today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => navigate('/services')}
              className="bg-white text-[#166534] px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl hover:bg-[#FAFAF5] hover:scale-105 transition-all flex items-center justify-center gap-3"
            >
              Post a Job for Free
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
