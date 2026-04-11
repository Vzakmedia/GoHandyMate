import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Star, Users, Award, BookOpen, Zap, Sparkles, ChevronRight } from 'lucide-react';
import { VideoModal } from '@/components/hero/VideoModal';
import { supabase } from '@/integrations/supabase/client';
import { LandingHero } from "@/components/shared/LandingHero";
import type { Tables } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';

type TrainingResource = Tables<'training_resources'> & {
  thumbnail: string;
  rating: number;
  views: string;
};

const ProResources = () => {
  const navigate = useNavigate();
  const [selectedVideo, setSelectedVideo] = useState<TrainingResource | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [resources, setResources] = useState<TrainingResource[]>([]);
  const [loading, setLoading] = useState(true);

  const resourceDefaults: Record<number, { thumbnail: string; rating: number; views: string }> = {
    1: { thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop", rating: 4.8, views: "12.5K" },
    2: { thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=225&fit=crop", rating: 4.9, views: "18.2K" },
    3: { thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop", rating: 4.7, views: "9.8K" },
    4: { thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=225&fit=crop", rating: 4.6, views: "15.3K" }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const { data, error } = await supabase.from('training_resources').select('*').limit(4);
      if (data) {
        setResources(data.map(r => ({ ...r, ...resourceDefaults[r.id as number] })));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const benefits = [
    {
      title: "Master New Skills",
      description: "Access curated video tutorials covering plumbing, electrical, and modern smart home installations.",
      image: "/features/document.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Get Certified",
      description: "Complete specialized tracks to earn badges and increase your standing in search results.",
      image: "/features/verify.png",
      bgColor: "bg-[#fbbf24]",
    },
    {
      title: "Business Growth",
      description: "Learn how to optimize your quotes, manage client expectations, and build a local brand.",
      image: "/features/support.png",
      bgColor: "bg-[#166534]",
    },
    {
      title: "Priority Access",
      description: "Pros who complete advanced training get first pick of high-value projects in their area.",
      image: "/features/secure.png",
      bgColor: "bg-[#fbbf24]",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHero
        topic="Professional Development"
        title="Level Up Your Craft"
        description="Access exclusive training videos, tutorials, and business resources designed specifically for GoHandyMate Pros. Master new techniques and grow your revenue."
        buttonText="Browse All Tutorials"
        onButtonClick={() => document.getElementById('resources-grid')?.scrollIntoView({ behavior: 'smooth' })}
        backgroundImageUrl="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop"
      />

      {/* Benefits Grid - Consistent with Site Design */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
            <div className="lg:w-8/12 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAFAF5] text-green-800 text-[10px] font-black tracking-[0.15em] uppercase border border-green-100 shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-green-600" />
                LEARNING TRACKS
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] leading-[1.1] tracking-tight">
                Resources to <br />
                <span className="text-green-800">Fuel Your Growth.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((v, idx) => (
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

      {/* Main Training Grid */}
      <section id="resources-grid" className="py-24 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-[#0A0A0A]">Trending Resources</h3>
              <p className="text-slate-500 font-medium">The most watched tutorials this week</p>
            </div>
            <Button variant="outline" className="rounded-full border-black font-bold uppercase text-[10px] tracking-widest px-8">
              View All <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {resources.map((resource) => (
              <div key={resource.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-black/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500">
                <div className="relative aspect-video overflow-hidden">
                  <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="lg"
                      onClick={() => { setSelectedVideo(resource); setIsVideoModalOpen(true); }}
                      className="bg-white text-black hover:bg-slate-50 rounded-full font-black px-10 py-6 shadow-2xl"
                    >
                      <Play className="w-5 h-5 mr-3 fill-black" /> Watch Video
                    </Button>
                  </div>
                  <div className="absolute top-6 left-6">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border border-white/20 ${getLevelColor(resource.level || '')}`}>
                      {resource.level}
                    </span>
                  </div>
                </div>
                <div className="p-10 space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-[#0A0A0A] leading-tight group-hover:text-[#166534] transition-colors">{resource.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed line-clamp-2">{resource.description}</p>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {resource.rating || '4.8'} Rating
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> {resource.views || '12k'} Views
                    </div>
                    <div className="text-[#166534]">
                      {resource.duration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Orbit CTA - Master Certification */}
      <section className="relative py-40 md:py-48 bg-[#DFF3EA] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] border border-[#166534]/10 rounded-full" />
          <div className="absolute w-[600px] h-[600px] md:w-[900px] md:h-[900px] border border-[#166534]/5 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="max-w-3xl space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-[#166534] text-[10px] font-black tracking-widest uppercase border border-[#166534]/10 backdrop-blur-sm mx-auto">
                <Award className="w-4 h-4" /> GO MASTER CERTIFIED
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#166534] leading-[1.05] tracking-tight">
                Transform Your <br />
                <span className="text-green-700 block">Professional Career.</span>
              </h2>
              <p className="text-lg text-[#166534]/70 font-medium max-w-xl mx-auto">
                Join 10,000+ certified pros who have increased their monthly revenue by 40% after completing our Master tracks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/sign-up-pro')}
                  className="bg-[#166534] text-white px-10 py-5 rounded-full font-black text-sm uppercase tracking-wider shadow-xl hover:bg-[#14532d] transition-colors"
                >
                  Get Certified Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => { setIsVideoModalOpen(false); setSelectedVideo(null); }}
        videoUrl={selectedVideo?.video_url || ''}
      />
    </div>
  );
};

export default ProResources;

