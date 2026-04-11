
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, DollarSign, User, Calendar, Check, X, Calculator, Sparkles, ShieldCheck, ChevronRight, Inbox, Send } from 'lucide-react';
import { useCustomQuotes, type CustomQuoteRequest } from '@/hooks/useCustomQuotes';
import { useAuth } from '@/features/auth';
import { useQuoteCalculator } from '@/hooks/useQuoteCalculator';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QuoteRequestCardProps {
  request: CustomQuoteRequest;
}

export const QuoteRequestCard = ({ request }: QuoteRequestCardProps) => {
  const { user } = useAuth();
  const { submitQuote } = useCustomQuotes();
  const { settings: businessSettings } = useBusinessSettings();
  const { calculateQuote, formData: calculatorData, updateFormData } = useQuoteCalculator();
  
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [formData, setFormData] = useState({
    quoted_price: request.budget_range ? request.budget_range.replace(/[^\d.-]/g, '') : '',
    description: '',
    estimated_hours: '',
    materials_included: false,
    materials_cost: '',
    travel_fee: '',
    availability_note: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUseCalculator = () => {
    if (businessSettings) {
      updateFormData({
        serviceCategory: request.service_name,
        jobDescription: request.service_description,
        rateValue: businessSettings.default_labor_rate || 50,
        estimatedHours: parseFloat(formData.estimated_hours) || 1,
        materialCosts: parseFloat(formData.materials_cost) || 0
      });
    }
    
    const calculation = calculateQuote(
      request.service_name,
      parseFloat(formData.materials_cost) || 0,
      parseFloat(formData.estimated_hours) || 1,
      businessSettings?.default_labor_rate || 50
    );
    
    setFormData(prev => ({
      ...prev,
      quoted_price: calculation.total.toString(),
      description: prev.description || `Professional ${request.service_name} service with ${calculation.laborHours} hours of labor and materials included.`
    }));
    
    toast.success('Quote calculated using professional rates!');
  };

  const handleSubmitQuote = async () => {
    if (!user || !formData.quoted_price || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitQuote({
        quote_request_id: request.id,
        customer_id: request.customer_id,
        service_name: request.service_name,
        quoted_price: parseFloat(formData.quoted_price),
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        description: formData.description,
        materials_included: formData.materials_included,
        materials_cost: parseFloat(formData.materials_cost) || 0,
        travel_fee: parseFloat(formData.travel_fee) || 0,
        availability_note: formData.availability_note || undefined
      });

      setShowQuoteForm(false);
      setFormData({
        quoted_price: '',
        description: '',
        estimated_hours: '',
        materials_included: false,
        materials_cost: '',
        travel_fee: '',
        availability_note: ''
      });
      toast.success('Quote submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptPrice = async () => {
    if (!user) return;

    const suggestedPrice = request.budget_range ? request.budget_range.replace(/[^\d.-]/g, '') : '0';
    
    setIsSubmitting(true);
    try {
      await submitQuote({
        quote_request_id: request.id,
        customer_id: request.customer_id,
        service_name: request.service_name,
        quoted_price: parseFloat(suggestedPrice),
        description: `I accept your budget of ${request.budget_range} for ${request.service_name}. I'm ready to start as soon as possible.`,
        materials_included: false,
        materials_cost: 0,
        travel_fee: 0,
        availability_note: 'Available immediately'
      });

      toast.success('Quote accepted and submitted!');
    } catch (error) {
      toast.error('Failed to accept quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusConfig = {
    emergency: { label: 'Immediate', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    same_day: { label: 'Priority', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    flexible: { label: 'Standard', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }
  }[request.urgency] || { label: 'Flexible', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/10 to-[#166534]/0 rounded-[42px] blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <Card className="relative bg-white/90 backdrop-blur-xl border border-black/5 rounded-[40px] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
        <CardContent className="p-0">
          <div className="p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
              <div className="space-y-4 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <div className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm", statusConfig.bg, statusConfig.color, statusConfig.border)}>
                    <Clock className="w-3 h-3" />
                    {statusConfig.label}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-black/5 text-[10px] font-black uppercase tracking-widest">
                    Available Request
                  </div>
                </div>
                
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight transition-colors group-hover:text-[#166534]">
                  {request.service_name}
                </h3>
                
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-2 max-w-2xl">
                  {request.service_description}
                </p>
              </div>

              <div className="flex flex-col items-start lg:items-end justify-center px-8 py-6 bg-slate-50/50 rounded-[32px] border border-black/5 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer Budget</span>
                <span className="text-3xl font-black text-emerald-600 tracking-tight leading-none">
                  {request.budget_range || 'TBD'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 border-t border-black/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4 text-[#166534]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Job location</p>
                    <p className="text-[12px] font-bold text-slate-700 truncate">{request.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                    <User className="w-4 h-4 text-[#166534]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Customer</p>
                    <p className="text-[12px] font-bold text-slate-700 truncate">{request.profiles?.full_name || 'Verified User'}</p>
                  </div>
                </div>
              </div>

              {!showQuoteForm && (
                <div className="flex items-center gap-3">
                  {request.budget_range && (
                    <button 
                      onClick={handleAcceptPrice}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#166534] text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 hover:bg-[#166534]/90 transition-all active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Syncing...' : `Accept budget`}
                    </button>
                  )}
                  <button 
                    onClick={() => setShowQuoteForm(true)}
                    className="flex items-center gap-2 px-8 py-4 rounded-full bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Custom Quote
                  </button>
                </div>
              )}
            </div>
          </div>

          {showQuoteForm && (
            <div className="p-6 sm:p-10 border-t border-black/5 bg-slate-50/30 animate-in slide-in-from-bottom-4 duration-500">
              <div className="max-w-4xl mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">Submit custom proposal</h4>
                      <p className="text-[12px] font-medium text-slate-500">Configure your professional quote parameters below.</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleUseCalculator}
                    className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Auto-calc rates
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your quote ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.quoted_price}
                      onChange={(e) => handleInputChange('quoted_price', e.target.value)}
                      placeholder="0.00"
                      className="h-14 rounded-[20px] border-black/5 bg-white font-black text-lg focus:ring-[#166534]/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Est. hours</label>
                    <Input
                      type="number"
                      step="0.5"
                      value={formData.estimated_hours}
                      onChange={(e) => handleInputChange('estimated_hours', e.target.value)}
                      placeholder="0.0"
                      className="h-14 rounded-[20px] border-black/5 bg-white font-black text-lg focus:ring-[#166534]/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Materials ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.materials_cost}
                      onChange={(e) => handleInputChange('materials_cost', e.target.value)}
                      placeholder="0.00"
                      className="h-14 rounded-[20px] border-black/5 bg-white font-black text-lg focus:ring-[#166534]/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Travel fee ($)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.travel_fee}
                      onChange={(e) => handleInputChange('travel_fee', e.target.value)}
                      placeholder="0.00"
                      className="h-14 rounded-[20px] border-black/5 bg-white font-black text-lg focus:ring-[#166534]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Detailed scope of work</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Outline your professional approach and deliverables..."
                      rows={4}
                      className="rounded-[24px] border-black/5 bg-white font-medium text-[13px] resize-none p-5 focus:ring-[#166534]/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Availability & timeline</label>
                    <Textarea
                      value={formData.availability_note}
                      onChange={(e) => handleInputChange('availability_note', e.target.value)}
                      placeholder="Specify your earliest start date and scheduling preferences..."
                      rows={4}
                      className="rounded-[24px] border-black/5 bg-white font-medium text-[13px] resize-none p-5 focus:ring-[#166534]/10"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <button
                    onClick={() => setShowQuoteForm(false)}
                    className="flex-1 w-full h-14 rounded-full border border-black/5 bg-white font-black text-[11px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Discard Changes
                  </button>
                  <button
                    onClick={handleSubmitQuote}
                    disabled={isSubmitting}
                    className="flex-[2] w-full h-14 rounded-full bg-[#166534] text-white font-black text-[11px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-[#166534]/90 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Transmitting Proposal...' : 'Transmit Proposal'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
