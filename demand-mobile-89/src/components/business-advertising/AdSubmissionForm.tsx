
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Megaphone, CreditCard, ImagePlus, Target, RefreshCcw, ArrowRight } from 'lucide-react';
import { PricingPlan } from './PricingPlansSection';
import { cn } from "@/lib/utils";

interface AdFormData {
  ad_title: string;
  ad_description: string;
  target_zip_codes: string;
  target_audience: string;
  auto_renew: boolean;
}

interface AdSubmissionFormProps {
  selectedPlan: string;
  plans: PricingPlan[];
  adForm: AdFormData;
  setAdForm: React.Dispatch<React.SetStateAction<AdFormData>>;
  imageUrl: string;
  uploading: boolean;
  submitting: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onChangePlan: () => void;
}

export const AdSubmissionForm = ({
  selectedPlan,
  plans,
  adForm,
  setAdForm,
  imageUrl,
  uploading,
  submitting,
  onImageUpload,
  onFormSubmit,
  onChangePlan
}: AdSubmissionFormProps) => {
  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="relative group">
        {/* Container Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
        
        <div className="relative bg-white/80 backdrop-blur-2xl border border-black/5 rounded-[40px] shadow-2xl overflow-hidden">
          <div className="bg-slate-900 px-8 py-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/20 text-[10px] font-black uppercase tracking-widest text-blue-200">
                        <Megaphone size={12} />
                        Campaign Configurator
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase">Submit Your Advertisement</h2>
                    <p className="text-slate-400 text-[13px] font-medium leading-relaxed max-w-lg">
                        configure your campaign parameters and proceed to secure checkout for immediate activation.
                    </p>
                </div>
                {selectedPlanData && (
                    <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 space-y-3">
                        <div className="flex items-center justify-between gap-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Selected Plan</p>
                                <p className="text-lg font-black text-white">{selectedPlanData.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white">${selectedPlanData.price}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400">Ready to Pay</p>
                            </div>
                        </div>
                        <button 
                            onClick={onChangePlan}
                            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                            <RefreshCcw size={12} />
                            Change Plan
                        </button>
                    </div>
                )}
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <form onSubmit={onFormSubmit} className="space-y-10">
              {/* Section: Content */}
              <div className="space-y-8">
                <div className="flex items-center gap-4 border-b border-black/5 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Target size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Advertisement Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="ad_title" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Campaign Title *</Label>
                    <Input
                      id="ad_title"
                      required
                      value={adForm.ad_title}
                      onChange={(e) => setAdForm({ ...adForm, ad_title: e.target.value })}
                      placeholder="e.g. Premium Electrical Services"
                      maxLength={100}
                      className="h-14 rounded-2xl bg-slate-50/50 border-black/5 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all px-6 text-[15px] font-medium"
                    />
                    <div className="flex justify-end pr-2">
                        <span className="text-[10px] font-bold text-slate-400">{adForm.ad_title.length}/100</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target_zip_codes" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Zip Codes</Label>
                    <Input
                      id="target_zip_codes"
                      value={adForm.target_zip_codes}
                      onChange={(e) => setAdForm({ ...adForm, target_zip_codes: e.target.value })}
                      placeholder="12345, 12346 (comma separated)"
                      className="h-14 rounded-2xl bg-slate-50/50 border-black/5 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all px-6 text-[15px] font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ad_description" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Ad Description *</Label>
                  <Textarea
                    id="ad_description"
                    required
                    value={adForm.ad_description}
                    onChange={(e) => setAdForm({ ...adForm, ad_description: e.target.value })}
                    placeholder="Describe your services and value proposition..."
                    maxLength={500}
                    rows={4}
                    className="rounded-3xl bg-slate-50/50 border-black/5 focus:bg-white focus:ring-4 focus:ring-blue-600/5 transition-all p-6 text-[15px] font-medium leading-relaxed"
                  />
                  <div className="flex justify-end pr-2">
                      <span className="text-[10px] font-bold text-slate-400">{adForm.ad_description.length}/500</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label htmlFor="target_audience" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Audience</Label>
                        <Select 
                            value={adForm.target_audience} 
                            onValueChange={(value) => setAdForm({ ...adForm, target_audience: value })}
                        >
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50/50 border-black/5 focus:ring-4 focus:ring-blue-600/5 transition-all px-6 text-[15px] font-medium">
                                <SelectValue placeholder="Select target audience" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-black/5 shadow-2xl">
                                <SelectItem value="all">All Users</SelectItem>
                                <SelectItem value="homeowners">Homeowners</SelectItem>
                                {/* property_managers option removed — property_manager role archived */}
                                <SelectItem value="businesses">Businesses</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4 pt-1">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Campaign Options</Label>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-black/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <RefreshCcw size={16} className="text-blue-600" />
                                </div>
                                <span className="text-[13px] font-black uppercase tracking-wider text-slate-700">Auto-renew</span>
                            </div>
                            <Switch
                                checked={adForm.auto_renew}
                                onCheckedChange={(checked) => setAdForm({ ...adForm, auto_renew: checked })}
                                className="data-[state=checked]:bg-blue-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Section: Image */}
                <div className="space-y-4">
                  <Label htmlFor="ad_image" className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">Visual Asset (Optional)</Label>
                  <div className="relative">
                    <input
                        type="file"
                        id="ad_image"
                        accept="image/*"
                        onChange={onImageUpload}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className={cn(
                        "relative z-10 w-full p-8 md:p-12 border-2 border-dashed rounded-[32px] transition-all duration-300 flex flex-col items-center justify-center text-center space-y-4",
                        imageUrl ? "border-emerald-200 bg-emerald-50/30" : "border-black/5 bg-slate-50/50 hover:bg-slate-50 hover:border-black/10"
                    )}>
                        {imageUrl ? (
                            <div className="relative group/img">
                                <img src={imageUrl} alt="Preview" className="w-48 h-48 object-cover rounded-3xl shadow-2xl transition-transform duration-500 group-hover/img:scale-105" />
                                <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Click to Replace</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-500">
                                    {uploading ? <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div> : <ImagePlus size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Upload Ad Creative</p>
                                    <p className="text-[12px] font-medium text-slate-400">Drag & drop or browse high-resolution assets</p>
                                </div>
                            </>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={!selectedPlan || submitting}
                  className={cn(
                    "w-full h-18 rounded-[28px] text-[12px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl active:scale-[0.98]",
                    !selectedPlan || submitting
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20 hover:-translate-y-1"
                  )}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Proceed to Payment (${selectedPlanData?.price || 0})
                      <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
                {!selectedPlan && (
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest text-center mt-4 animate-pulse">
                    Attention: Please select a growth plan to proceed
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
