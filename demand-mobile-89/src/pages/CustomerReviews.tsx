import { useState } from "react";
import { LandingHero } from "@/components/shared/LandingHero";
import { Star, MessageCircle, ThumbsUp, CheckCircle, Users, Sparkles, Target, Zap, Phone, Mail, ArrowRight, Quote } from "lucide-react";
import { useAllReviews } from "@/hooks/useAllReviews";

export const CustomerReviews = () => {
  const { reviews, loading, averageRating, totalReviews, ratingDistribution } = useAllReviews();
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const filteredReviews = ratingFilter
    ? reviews.filter(review => review.rating === ratingFilter)
    : reviews;

  // Convert ratingDistribution object to a sorted array for the UI
  const distributionArray = ratingDistribution
    ? Object.entries(ratingDistribution)
      .sort((a, b) => Number(b[0]) - Number(a[0])) // 5 stars to 1 star
      .map(([stars, count]) => ({
        stars: Number(stars),
        count,
        percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
      }))
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="COMMUNITY VOICE"
        title="Customer Reviews"
        description="Real stories from real people. See how GoHandyMate is transforming home services one task at a time."
        buttonText="Leave a Review"
        backgroundImageUrl="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Trust Metrics - High Fidelity Bar Grid */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-[#166534] text-[10px] font-black tracking-[0.15em] uppercase border border-green-100">
                <Users className="w-3.5 h-3.5" /> SOCIAL PROOF
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[#0A0A0A] tracking-tight">
                Trusted by <span className="text-[#166534]">{totalReviews}+</span> <br />
                Homeowners.
              </h2>
            </div>
            <div className="flex items-center gap-6 p-8 bg-[#FAFAF5] rounded-[2.5rem] border border-black/5">
              <div className="text-center">
                <div className="text-5xl font-black text-[#0A0A0A] mb-2">{averageRating}</div>
                <div className="flex gap-1 justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(averageRating) ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-slate-200'}`} />
                  ))}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AVG RATING</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {distributionArray.map((dist, idx) => (
              <div key={idx} className="p-6 bg-[#FAFAF5] rounded-3xl border border-black/5 flex flex-col justify-between group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{dist.stars} STARS</div>
                <div className="flex items-end gap-2">
                  <div className="text-2xl font-black text-[#0A0A0A]">{dist.percentage}%</div>
                  <div className="text-[10px] font-medium text-slate-400 mb-1">({dist.count})</div>
                </div>
                <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#166534] transition-all duration-1000" style={{ width: `${dist.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews List - Modern Grid */}
      <section className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div className="flex gap-2">
              {[null, 5, 4, 3].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setRatingFilter(rating)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${ratingFilter === rating
                    ? 'bg-[#166534] text-white border-[#166534]'
                    : 'bg-white text-slate-500 border-black/5 hover:border-[#166534]/30'
                    }`}
                >
                  {rating === null ? 'ALL' : `${rating} STARS`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full py-20 text-center text-slate-400 font-black uppercase tracking-widest animate-pulse">Loading amazing stories...</div>
            ) : filteredReviews.length > 0 ? (
              filteredReviews.map((review, idx) => (
                <div key={idx} className="p-10 rounded-[3rem] bg-white border border-black/5 shadow-sm hover:shadow-2xl transition-all duration-700 group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-[#fbbf24] fill-[#fbbf24]' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <Quote className="w-10 h-10 text-[#166534]/10 mb-4" />
                  <p className="text-slate-600 font-medium leading-relaxed italic mb-8 flex-1">
                    "{review.review_text || "Excellent service, highly recommended!"}"
                  </p>
                  <div className="pt-8 border-t border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.customer.full_name}`} alt={review.customer.full_name} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#0A0A0A] uppercase tracking-tight">{review.customer.full_name}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VERIFIED USER</span>
                      </div>
                    </div>
                    <div className="p-2 bg-[#FAFAF5] rounded-lg">
                      <CheckCircle className="w-4 h-4 text-[#166534]" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-slate-400 font-black uppercase tracking-widest">No reviews found for this rating yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* Orbit CTA */}
      <section className="relative py-40 md:py-48 bg-[#166534] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[800px] h-[800px] border-[2px] border-white/30 rounded-full animate-[spin_100s_linear_infinite]" />
          <div className="absolute w-[600px] h-[600px] border-[2px] border-white/30 rounded-full animate-[spin_60s_linear_infinite_reverse]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center space-y-12 text-white">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 text-white text-[10px] font-black tracking-widest uppercase border border-white/20">
            <Sparkles className="w-4 h-4" /> TESTIMONIALS
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black leading-[1] tracking-tight">
            Experience the <br />
            <span className="underline decoration-[#fbbf24] decoration-8 underline-offset-8 text-white">GHM Magic.</span>
          </h2>
          <p className="text-xl text-white/70 font-medium max-w-xl mx-auto leading-relaxed">
            Ready to join our community of happy homeowners? Book your first service today.
          </p>
          <div className="pt-6 flex justify-center gap-6">
            <button onClick={() => navigate('/')} className="px-12 py-6 bg-[#fbbf24] text-black rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform">
              GET STARTED NOW
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

