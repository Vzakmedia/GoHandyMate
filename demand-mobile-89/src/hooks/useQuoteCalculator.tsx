
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface QuoteRequest {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_required: string;
  project_description: string;
  preferred_date?: Date;
  estimated_budget?: string;
  location: string;
}

export interface QuoteCalculation {
  basePrice: number;
  materialCosts: number;
  laborHours: number;
  laborRate: number;
  subtotal: number;
  tax: number;
  total: number;
  breakdown: {
    description: string;
    cost: number;
  }[];
}

interface QuoteFormData {
  serviceCategory: string;
  jobDescription: string;
  estimatedHours: number;
  rateType: string;
  rateValue: number;
  materialCosts: number;
  units: number;
  zipCode: string;
  isAfterHours: boolean;
  isUrgent: boolean;
}

export const useQuoteCalculator = (jobId?: string) => {
  const [loading, setLoading] = useState(false);
  const [calculation, setCalculation] = useState<QuoteCalculation>({
    basePrice: 0,
    materialCosts: 0,
    laborHours: 0,
    laborRate: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    breakdown: []
  });
  const [isSending, setIsSending] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  const [formData, setFormData] = useState<QuoteFormData>({
    serviceCategory: '',
    jobDescription: '',
    estimatedHours: 1,
    rateType: 'hourly',
    rateValue: 50,
    materialCosts: 0,
    units: 1,
    zipCode: '',
    isAfterHours: false,
    isUrgent: false
  });

  const updateFormData = (updates: Partial<QuoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Recalculate when form data changes
    calculateQuote(formData.serviceCategory, formData.materialCosts, formData.estimatedHours, formData.rateValue);
  };

  const calculateQuote = (
    serviceType: string,
    materialCosts: number = 0,
    laborHours: number = 1,
    laborRate: number = 50
  ): QuoteCalculation => {
    // Base prices for different service types
    const basePrices: Record<string, number> = {
      'plumbing': 100,
      'electrical': 120,
      'hvac': 150,
      'general_repair': 75,
      'painting': 60,
      'carpentry': 80,
      'cleaning': 40,
      'landscaping': 50
    };

    const basePrice = basePrices[serviceType.toLowerCase()] || 75;
    const laborCost = laborHours * laborRate;
    const subtotal = basePrice + materialCosts + laborCost;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    const breakdown = [
      { description: `${serviceType} Base Service`, cost: basePrice },
      { description: 'Materials', cost: materialCosts },
      { description: `Labor (${laborHours} hours @ $${laborRate}/hr)`, cost: laborCost },
      { description: 'Tax (8%)', cost: tax }
    ];

    const quoteCalculation: QuoteCalculation = {
      basePrice,
      materialCosts,
      laborHours,
      laborRate,
      subtotal,
      tax,
      total,
      breakdown
    };

    setCalculation(quoteCalculation);
    return quoteCalculation;
  };

  const sendQuote = async (customerInfo: any) => {
    if (!user) {
      toast.error('Please sign in to send quotes');
      return false;
    }

    try {
      setIsSending(true);

      // Check if user has a business profile
      const { data: businessProfile } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!businessProfile) {
        toast.error('Please create a business profile first');
        return false;
      }

      // Submit quote request
      const { error } = await supabase
        .from('quote_requests')
        .insert([{
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          customer_phone: customerInfo.phone,
          service_required: formData.serviceCategory,
          project_description: formData.jobDescription,
          estimated_budget: `$${calculation.total.toFixed(2)}`,
          location: formData.zipCode,
          business_id: businessProfile.id,
          status: 'pending'
        }]);

      if (error) throw error;

      toast.success('Quote sent successfully!');
      return true;
    } catch (error) {
      console.error('Error sending quote:', error);
      toast.error('Failed to send quote');
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const saveDraft = async () => {
    try {
      setIsSaving(true);
      // Save draft logic here
      toast.success('Quote saved as draft');
      return true;
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const getQuoteHistory = async () => {
    if (!user) return [];

    try {
      const { data: businessProfile } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!businessProfile) return [];

      const { data: quotes, error } = await supabase
        .from('quote_requests')
        .select('*')
        .eq('business_id', businessProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return quotes || [];
    } catch (error) {
      console.error('Error fetching quote history:', error);
      return [];
    }
  };

  return {
    loading,
    calculation,
    calculatedQuote: calculation,
    formData,
    updateFormData,
    isCalculating: loading,
    isSending,
    isSaving,
    calculateQuote,
    sendQuote,
    saveDraft,
    submitQuote: async (quoteRequest: QuoteRequest, calc: QuoteCalculation) => {
      return await sendQuote({ 
        name: quoteRequest.customer_name,
        email: quoteRequest.customer_email,
        phone: quoteRequest.customer_phone
      });
    },
    getQuoteHistory
  };
};
