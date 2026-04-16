import { useEffect, useState } from 'react';
import { Star, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface HandymanProfile {
  id: string;
  full_name: string | null;
  average_rating: number | null;
  total_ratings: number | null;
  avatar_url: string | null;
}

export const CustomerRecommendedPros = () => {
  const [pros, setPros] = useState<HandymanProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPros = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, average_rating, total_ratings, avatar_url')
        .eq('user_role', 'handyman')
        .eq('account_status', 'active')
        .order('average_rating', { ascending: false })
        .limit(5);

      if (!error && data) {
        setPros(data);
      }
      setLoading(false);
    };

    fetchPros();
  }, []);

  return (
    <div className="bg-[#166534]/5 border border-[#166534]/10 rounded-[3rem] p-8 relative overflow-hidden">
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

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#166534]" />
          </div>
        ) : pros.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-10">No pros available yet.</p>
        ) : (
          <div className="space-y-4">
            {pros.map((pro) => (
              <div
                key={pro.id}
                className="group bg-white rounded-2xl p-4 border border-black/5 hover:border-[#166534]/30 transition-all duration-300 flex items-center justify-between cursor-pointer"
                onClick={() => navigate(`/handyman-profile/${pro.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {pro.avatar_url ? (
                      <img
                        src={pro.avatar_url}
                        alt={pro.full_name ?? 'Handyman'}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-black text-lg">
                        {(pro.full_name ?? 'H')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#166534] transition-colors">
                      {pro.full_name ?? 'Handyman'}
                    </h4>
                    <p className="text-[11px] font-semibold text-slate-500 mb-1">Handyman</p>
                    {pro.average_rating != null ? (
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-600">
                        <Star className="w-3 h-3 fill-amber-500" />
                        {pro.average_rating.toFixed(1)}
                        <span className="text-slate-400 font-medium">
                          ({pro.total_ratings ?? 0})
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">New</span>
                    )}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3.5 h-3.5 text-[#166534]" />
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          className="w-full mt-6 text-[#166534] hover:bg-[#166534]/10 font-bold uppercase tracking-widest text-[10px]"
          onClick={() => navigate('/professionals')}
        >
          View More Professionals
        </Button>
      </div>
    </div>
  );
};
