
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TabsContent } from '@/components/ui/tabs';
import { Zap, Star, Crown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdvertisements } from '@/hooks/useAdvertisements';
import { useAuth } from '@/features/auth';
import { MyAdsManager } from '@/components/ads/MyAdsManager';
import { supabase } from '@/integrations/supabase/client';
import { BusinessAdvertisingHeader } from '@/components/business-advertising/BusinessAdvertisingHeader';
import { BusinessAdvertisingHero } from '@/components/business-advertising/BusinessAdvertisingHero';
import { BusinessAdvertisingTabs } from '@/components/business-advertising/BusinessAdvertisingTabs';
import { PricingPlansSection, PricingPlan } from '@/components/business-advertising/PricingPlansSection';
import { AdSubmissionForm } from '@/components/business-advertising/AdSubmissionForm';

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic Visibility',
    price: 35,
    duration: 7,
    impressions: 1000,
    targeting: ['Location-based'],
    features: [
      'Local neighborhood targeting',
      'Basic analytics',
      '7-day campaign duration',
      'Standard placement',
      'Email support'
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'premium',
    name: 'Professional',
    price: 105,
    duration: 14,
    impressions: 3500,
    targeting: ['Location-based', 'Service category'],
    features: [
      'Multi-neighborhood targeting',
      'Advanced analytics',
      '14-day campaign duration',
      'Priority placement',
      'A/B testing available',
      'Priority support'
    ],
    popular: true,
    icon: <Star className="w-6 h-6" />,
    color: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'featured',
    name: 'Premium Boost',
    price: 199,
    duration: 30,
    impressions: 8000,
    targeting: ['Location-based', 'Service category', 'Demographics'],
    features: [
      'City-wide targeting',
      'Premium analytics dashboard',
      '30-day campaign duration',
      'Featured placement',
      'A/B testing included',
      'Dedicated account support',
      'Custom branding options'
    ],
    icon: <Crown className="w-6 h-6" />,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  }
];

const BusinessAdvertising = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { createAdWithPayment } = useAdvertisements();
  const [activeTab, setActiveTab] = useState('pricing');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'featured' | ''>('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [adForm, setAdForm] = useState({
    ad_title: '',
    ad_description: '',
    target_zip_codes: '',
    target_audience: 'all',
    auto_renew: false,
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('ad-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('ad-images')
        .getPublicUrl(fileName);

      setImageUrl(data.publicUrl);
      
      toast({
        title: "Image uploaded successfully!",
        description: "Your ad image has been uploaded.",
      });
    } catch (error: unknown) {
      const err = error as Error;
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      toast({
        title: "Plan Required",
        description: "Please select a pricing plan before submitting your ad.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create an advertisement.",
        variant: "destructive"
      });
      return;
    }

    // Validate required fields
    if (!adForm.ad_title.trim() || !adForm.ad_description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the ad title and description.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      const selectedPlanData = pricingPlans.find(p => p.id === selectedPlan);
      if (!selectedPlanData) {
        throw new Error('Selected plan not found');
      }

      const zipCodes = adForm.target_zip_codes
        .split(',')
        .map(zip => zip.trim())
        .filter(zip => zip.length > 0);

      const adData = {
        ad_title: adForm.ad_title.trim(),
        ad_description: adForm.ad_description.trim(),
        image_url: imageUrl || undefined,
        plan_type: selectedPlan,
        target_zip_codes: zipCodes,
        target_audience: adForm.target_audience,
        auto_renew: adForm.auto_renew,
        cost: selectedPlanData.price
      };

      console.log('Submitting ad data for payment:', adData);
      const result = await createAdWithPayment(adData);
      
      if (result.success) {
        const message = 'message' in result ? result.message : "Opening payment page...";
        toast({
          title: "Payment Processing",
          description: message,
        });
        
        // Reset form after successful submission
        setAdForm({
          ad_title: '',
          ad_description: '',
          target_zip_codes: '',
          target_audience: 'all',
          auto_renew: false,
        });
        setSelectedPlan('');
        setImageUrl('');
        setActiveTab('my-ads');
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error: any) {
      console.error('Error submitting ad:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to process your advertisement submission.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePlanSelect = (planId: 'basic' | 'premium' | 'featured') => {
    setSelectedPlan(planId);
    setActiveTab('submit');
  };

  const handleCreateNewAd = () => {
    setActiveTab('pricing');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2 opacity-50"></div>
      
      <BusinessAdvertisingHeader onNavigateHome={() => navigate('/')} />

      <main className="max-w-7xl mx-auto px-6 py-10 md:py-16 relative z-10">
        <BusinessAdvertisingHero />

        <div className="mt-12 md:mt-20">
            <BusinessAdvertisingTabs activeTab={activeTab} onTabChange={setActiveTab}>
                <TabsContent value="pricing" className="mt-0 outline-none">
                    <PricingPlansSection 
                        plans={pricingPlans}
                        selectedPlan={selectedPlan}
                        onPlanSelect={handlePlanSelect}
                    />
                </TabsContent>

                <TabsContent value="submit" className="mt-0 outline-none">
                    <AdSubmissionForm
                        selectedPlan={selectedPlan}
                        plans={pricingPlans}
                        adForm={adForm}
                        setAdForm={setAdForm}
                        imageUrl={imageUrl}
                        uploading={uploading}
                        submitting={submitting}
                        onImageUpload={handleImageUpload}
                        onFormSubmit={handleFormSubmit}
                        onChangePlan={() => setActiveTab('pricing')}
                    />
                </TabsContent>

                <TabsContent value="my-ads" className="mt-0 outline-none">
                    <div className="max-w-5xl mx-auto">
                        <MyAdsManager onCreateNewAd={handleCreateNewAd} />
                    </div>
                </TabsContent>
            </BusinessAdvertisingTabs>
        </div>
      </main>
      
      {/* Subtle Footer/End of Page spacer */}
      <div className="h-40"></div>
    </div>
  );
};

export default BusinessAdvertising;
