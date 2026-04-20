
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProfessionalTypeModal } from "@/components/ProfessionalTypeModal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, CheckCircle } from "lucide-react";
import { VideoModal } from "./hero/VideoModal";
import { supabase } from "@/integrations/supabase/client";

const HERO_CONTENT = {
  customer: {
    title: "Advance Your Home with Professional Services",
    description: "GoHandyMate connects local homeowners with skilled professionals for all your home repair, maintenance, and renovation needs.",
  },
  pro: {
    title: "Build Your Business with Quality Leads",
    description: "Join our network of verified experts and grow your professional reputation while managing your service business efficiently.",
  }
};

export const HeroSection = () => {
  const [audience, setAudience] = useState<'customer' | 'pro'>('customer');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isProfessionalTypeModalOpen, setIsProfessionalTypeModalOpen] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  // Load demo video
  useEffect(() => {
    loadDemoVideo();
  }, []);

  const loadDemoVideo = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('demo-videos')
        .list('videos', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (!error && data && data.length > 0) {
        const { data: { publicUrl } } = supabase.storage
          .from('demo-videos')
          .getPublicUrl(`videos/${data[0].name}`);
        setDemoVideoUrl(publicUrl);
      }
    } catch (error) {
      console.error('Error loading demo video:', error);
    }
  };

  const handleAction = () => {
    if (audience === 'customer') {
      setIsProfessionalTypeModalOpen(true);
    } else {
      navigate('/sign-up-pro');
    }
  };

  const handleSelectProfessionalType = (type: 'handyman') => {
    setIsProfessionalTypeModalOpen(false);
    navigate('/handyman');
  };

  const content = HERO_CONTENT[audience];

  return (
    <section className="px-4 py-4 sm:px-6 md:px-10 md:py-10 lg:px-16 lg:py-16">
      <div className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden rounded-[2rem] sm:rounded-[3rem] shadow-2xl border border-white/10">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/Gohandymate Hero.mp4" type="video/mp4" />
          </video>
          {/* Forest Green Filter Overlay - Reduced opacity to show more video */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-950/65 via-green-900/60 to-emerald-950/65 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 sm:py-16 text-center text-white w-full">
          {/* Role Toggle Pill */}
          <div className="inline-flex p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 sm:mb-10 transition-all duration-300">
            <button
              onClick={() => setAudience('customer')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-500 ${audience === 'customer'
                ? 'bg-white text-green-900 shadow-xl'
                : 'text-white hover:bg-white/10'
                }`}
            >
              I need a Service
            </button>
            <button
              onClick={() => setAudience('pro')}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-500 ${audience === 'pro'
                ? 'bg-white text-green-900 shadow-xl'
                : 'text-white hover:bg-white/10'
                }`}
            >
              I'm a Professional
            </button>
          </div>

          {/* Hero Content */}
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] transition-all duration-700 w-full px-2 sm:px-0">
              {content.title}
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light transition-all duration-700 px-4 sm:px-0">
              {content.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center pt-6 sm:pt-8 w-full max-w-md sm:max-w-none mx-auto">
              <Button
                size="lg"
                onClick={handleAction}
                className="bg-green-500 hover:bg-green-400 text-green-950 font-bold px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg rounded-2xl shadow-2xl transition-colors duration-500 group border-0 w-full sm:w-auto"
              >
                {audience === 'customer' ? 'Find a Pro Now' : 'Join as a Pro'}
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/25 px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg rounded-2xl transition-colors duration-500 w-full sm:w-auto"
                onClick={() => setIsVideoPlaying(true)}
              >
                <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2 fill-current" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Feature Tags / Indicators */}
          <div className="mt-12 sm:mt-20 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-8 opacity-70">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xs sm:text-sm font-medium">Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xs sm:text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xs sm:text-sm font-medium">Instant Matching</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoPlaying}
        onClose={() => setIsVideoPlaying(false)}
        videoUrl={demoVideoUrl || undefined}
      />

      {/* Professional Type Selection Modal */}
      <ProfessionalTypeModal
        open={isProfessionalTypeModalOpen}
        onClose={() => setIsProfessionalTypeModalOpen(false)}
        onSelectType={handleSelectProfessionalType}
      />
    </section>
  );
};
