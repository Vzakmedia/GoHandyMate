import { Badge } from "@/components/ui/badge";
import { Star, Info, Award, ShieldCheck, Sparkles, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingPanelProps {
    averageRating: number;
    totalReviews: number;
}

export const RatingPanel = ({ averageRating, totalReviews }: RatingPanelProps) => {
    const isNew = totalReviews === 0;

    return (
        <div className="group/panel bg-white/90 backdrop-blur-xl rounded-[48px] border border-black/5 p-8 sm:p-10 flex flex-col justify-between h-full min-h-[220px] transition-all duration-500 animate-fade-in outline-none relative overflow-hidden">
            {/* Animated Background Element */}
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover/panel:rotate-12 transition-transform duration-1000">
                <Award className="w-32 h-32 text-slate-900" />
            </div>

            <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center group-hover/panel:scale-110 transition-transform duration-500">
                        <Star className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">Quality reputation</h3>
                        <p className="text-[12px] font-medium text-slate-500 leading-relaxed">aggregated customer satisfaction and service feedback.</p>
                    </div>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500",
                  isNew 
                    ? "bg-slate-50 text-slate-400 border-slate-100" 
                    : "bg-emerald-50 text-emerald-700 border-emerald-100"
                )}>
                    {isNew ? 'New identity' : 'Verified trust'}
                </div>
            </div>

            <div className="mt-10 flex-1 flex flex-col justify-center relative z-10">
                {isNew ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-slate-300" />
                        <h2 className="text-2xl font-black text-slate-300 tracking-tighter lowercase first-letter:uppercase">Pending reviews</h2>
                      </div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                          deliver your first service to begin building your professional reputation.
                      </p>
                    </div>
                ) : (
                    <div className="flex items-end gap-6">
                        <div className="relative">
                            <h2 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{averageRating.toFixed(1)}</h2>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex flex-col gap-2 pb-1">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                          "w-5 h-5 transition-all duration-500 group-hover/panel:scale-110",
                                          i < Math.round(averageRating) 
                                            ? "text-amber-400 fill-amber-400" 
                                            : "text-slate-100 fill-slate-100"
                                        )}
                                        style={{ transitionDelay: `${i * 100}ms` }}
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">
                                    {totalReviews} Verified testimonials
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-10 pt-8 border-t border-black/5 relative z-10">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-black/5">
                  <ShieldCheck className="w-4 h-4 text-[#166534]" />
                  <span className="text-[11px] font-black text-slate-600 tracking-tight lowercase first-letter:uppercase">
                      {isNew 
                          ? 'deliver 3 jobs to unlock advanced features' 
                          : 'your reputation is publicly visible'}
                  </span>
                </div>
                <button className="flex items-center gap-2 group/btn px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover/btn:text-[#166534] transition-colors">Safety manual</span>
                    <Info className="w-3.5 h-3.5 text-slate-300 group-hover/btn:text-[#166534] transition-all" />
                </button>
            </div>
        </div>
    );
};
