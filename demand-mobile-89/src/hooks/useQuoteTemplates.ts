import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface QuoteTemplate {
  id: string;
  name: string;
  description: string;
  service_category: string;
  base_price: number;
  hourly_rate?: number;
  materials_markup?: number;
  estimated_hours?: number;
  default_terms: string;
  urgency_multipliers: {
    same_day: number;
    emergency: number;
  };
  created_at: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  service_category: string;
  hourly_rate?: number;
  materials_markup?: number;
  default_terms: string;
  created_at: string;
}

export const useQuoteTemplates = () => {
  const [quoteTemplates, setQuoteTemplates] = useState<QuoteTemplate[]>([]);
  const [invoiceTemplates, setInvoiceTemplates] = useState<InvoiceTemplate[]>([]);
  const [loading, setLoading] = useState(false);

  const createQuoteTemplate = useCallback(async (templateData: Omit<QuoteTemplate, 'id' | 'created_at'>) => {
    try {
      const newTemplate: QuoteTemplate = {
        ...templateData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      setQuoteTemplates(prev => [...prev, newTemplate]);
      toast.success('Quote template created successfully!');
      return newTemplate;
    } catch (error) {
      toast.error('Failed to create quote template');
      throw error;
    }
  }, []);

  const updateQuoteTemplate = useCallback(async (id: string, templateData: Partial<QuoteTemplate>) => {
    try {
      setQuoteTemplates(prev => 
        prev.map(template => 
          template.id === id ? { ...template, ...templateData } : template
        )
      );
      toast.success('Quote template updated successfully!');
    } catch (error) {
      toast.error('Failed to update quote template');
      throw error;
    }
  }, []);

  const deleteQuoteTemplate = useCallback(async (id: string) => {
    try {
      setQuoteTemplates(prev => prev.filter(template => template.id !== id));
      toast.success('Quote template deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete quote template');
      throw error;
    }
  }, []);

  const duplicateQuoteTemplate = useCallback(async (template: QuoteTemplate) => {
    try {
      const newTemplate: QuoteTemplate = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`,
        created_at: new Date().toISOString()
      };
      
      setQuoteTemplates(prev => [...prev, newTemplate]);
      toast.success('Quote template duplicated successfully!');
      return newTemplate;
    } catch (error) {
      toast.error('Failed to duplicate quote template');
      throw error;
    }
  }, []);

  const createInvoiceTemplate = useCallback(async (templateData: Omit<InvoiceTemplate, 'id' | 'created_at'>) => {
    try {
      const newTemplate: InvoiceTemplate = {
        ...templateData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      
      setInvoiceTemplates(prev => [...prev, newTemplate]);
      toast.success('Invoice template created successfully!');
      return newTemplate;
    } catch (error) {
      toast.error('Failed to create invoice template');
      throw error;
    }
  }, []);

  const updateInvoiceTemplate = useCallback(async (id: string, templateData: Partial<InvoiceTemplate>) => {
    try {
      setInvoiceTemplates(prev => 
        prev.map(template => 
          template.id === id ? { ...template, ...templateData } : template
        )
      );
      toast.success('Invoice template updated successfully!');
    } catch (error) {
      toast.error('Failed to update invoice template');
      throw error;
    }
  }, []);

  const deleteInvoiceTemplate = useCallback(async (id: string) => {
    try {
      setInvoiceTemplates(prev => prev.filter(template => template.id !== id));
      toast.success('Invoice template deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete invoice template');
      throw error;
    }
  }, []);

  const duplicateInvoiceTemplate = useCallback(async (template: InvoiceTemplate) => {
    try {
      const newTemplate: InvoiceTemplate = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`,
        created_at: new Date().toISOString()
      };
      
      setInvoiceTemplates(prev => [...prev, newTemplate]);
      toast.success('Invoice template duplicated successfully!');
      return newTemplate;
    } catch (error) {
      toast.error('Failed to duplicate invoice template');
      throw error;
    }
  }, []);

  // Calculate quote price based on template and options
  const calculateQuotePrice = useCallback((template: QuoteTemplate, options: {
    hours?: number;
    urgency?: 'flexible' | 'same_day' | 'emergency';
    materials_cost?: number;
    travel_fee?: number;
  }) => {
    let basePrice = template.base_price;
    
    // Add hourly cost if specified
    if (options.hours && template.hourly_rate) {
      basePrice += options.hours * template.hourly_rate;
    }
    
    // Apply urgency multiplier
    if (options.urgency && options.urgency !== 'flexible') {
      const multiplier = template.urgency_multipliers[options.urgency];
      basePrice *= multiplier;
    }
    
    // Add materials with markup
    let materialsTotal = options.materials_cost || 0;
    if (materialsTotal > 0 && template.materials_markup) {
      materialsTotal *= (1 + template.materials_markup / 100);
    }
    
    // Add travel fee
    const travelFee = options.travel_fee || 0;
    
    return {
      basePrice,
      materialsTotal,
      travelFee,
      total: basePrice + materialsTotal + travelFee
    };
  }, []);

  return {
    quoteTemplates,
    invoiceTemplates,
    loading,
    createQuoteTemplate,
    updateQuoteTemplate,
    deleteQuoteTemplate,
    duplicateQuoteTemplate,
    createInvoiceTemplate,
    updateInvoiceTemplate,
    deleteInvoiceTemplate,
    duplicateInvoiceTemplate,
    calculateQuotePrice
  };
};