import { Star, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CustomerRecommendedPros = () => {
  const professionals = [
    {
      id: "pro1",
      name: "Marcus Johnson",
      trade: "Master Electrician",
      rating: 4.9,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
    },
    {
      id: "pro2",
      name: "Sarah Chen",
      trade: "Plumbing Expert",
      rating: 5.0,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"
    },
    {
      id: "pro3",
      name: "David Smith",
      trade: "General Handyman",
      rating: 4.8,
      reviews: 215,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"
    }
  ];

  return (
    <div className="bg-[#166534]/5 border border-[#166534]/10 rounded-[3rem] p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ShieldCheck className="w-32 h-32 md:w-48 md:h-48 text-[#166534]" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-black/5">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Top Rated Pros</h3>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">In your area</p>
          </div>
        </div>

        <div className="space-y-4">
          {professionals.map((pro) => (
            <div key={pro.id} className="group bg-white rounded-2xl p-4 border border-black/5 hover:border-[#166534]/30 transition-all duration-300 flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={pro.image} alt={pro.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#166534] transition-colors">
                    {pro.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-slate-500 mb-1">{pro.trade}</p>
                  <div className="flex items-center gap-1 text-[10px] font-black text-amber-600">
                    <Star className="w-3 h-3 fill-amber-500" />
                    {pro.rating} <span className="text-slate-400 font-medium">({pro.reviews})</span>
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-3.5 h-3.5 text-[#166534]" />
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="ghost"
          className="w-full mt-6 text-[#166534] hover:bg-[#166534]/10 font-bold uppercase tracking-widest text-[10px]"
        >
          View More Professionals
        </Button>
      </div>
    </div>
  );
};
