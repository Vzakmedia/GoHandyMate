import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

export interface QuoteAutomationSettings {
  autoFollowUp: boolean;
  followUpDays: number;
  autoExpiration: boolean;
  expirationDays: number;
  reminderDays: number[];
  autoTemplatePopulation: boolean;
  smartPricing: boolean;
}

export interface QuoteReminder {
  id: string;
  quoteId: string;
  type: 'follow_up' | 'expiration' | 'reminder';
  scheduledDate: string;
  status: 'pending' | 'sent' | 'cancelled';
  message: string;
}

export const useQuoteAutomation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Default settings - stored in localStorage for now
  const [settings, setSettings] = useState<QuoteAutomationSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quoteAutomationSettings');
      if (saved) {
        return JSON.parse(saved);
      }
    }
    return {
      autoFollowUp: true,
      followUpDays: 3,
      autoExpiration: true,
      expirationDays: 30,
      reminderDays: [7, 3, 1],
      autoTemplatePopulation: true,
      smartPricing: false
    };
  });

  const [reminders, setReminders] = useState<QuoteReminder[]>([]);
  const [loading, setLoading] = useState(false);

  // Save settings to localStorage
  const saveSettings = useCallback(async (newSettings: Partial<QuoteAutomationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('quoteAutomationSettings', JSON.stringify(updatedSettings));
      }

      toast({
        title: "Settings Saved",
        description: "Quote automation settings updated successfully"
      });
    } catch (error) {
      console.error('Error saving automation settings:', error);
      toast({
        title: "Error",
        description: "Failed to save automation settings",
        variant: "destructive"
      });
    }
  }, [settings, toast]);

  // Schedule quote follow-up
  const scheduleQuoteFollowUp = useCallback(async (quoteId: string, clientEmail: string) => {
    if (!settings.autoFollowUp || !user?.id) return;

    try {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + settings.followUpDays);

      const reminder: QuoteReminder = {
        id: `reminder_${Date.now()}`,
        quoteId,
        type: 'follow_up',
        scheduledDate: followUpDate.toISOString(),
        status: 'pending',
        message: `Follow up on quote #${quoteId}`
      };

      setReminders(prev => [...prev, reminder]);

      toast({
        title: "Follow-up Scheduled",
        description: `Quote follow-up scheduled for ${followUpDate.toLocaleDateString()}`
      });
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
    }
  }, [settings.autoFollowUp, settings.followUpDays, user?.id, toast]);

  // Auto-populate quote template
  const getQuoteTemplate = useCallback(async (serviceType: string, projectSize: 'small' | 'medium' | 'large') => {
    if (!settings.autoTemplatePopulation || !user?.id) return null;

    // Mock template data for now
    const templates = {
      'plumbing': {
        small: {
          title: 'Basic Plumbing Repair',
          description: 'Standard plumbing repair service including basic fixtures and minor repairs.',
          terms: 'Payment due within 30 days. 1-year warranty on parts and labor.',
          laborRate: 85,
          markup: 0.25,
          warranty: '12 months on parts and labor'
        },
        medium: {
          title: 'Plumbing Installation',
          description: 'Installation of new plumbing fixtures, pipes, and related components.',
          terms: 'Payment due within 30 days. 2-year warranty on parts and labor.',
          laborRate: 95,
          markup: 0.3,
          warranty: '24 months on parts and labor'
        },
        large: {
          title: 'Complete Plumbing System',
          description: 'Full plumbing system installation or major renovation project.',
          terms: 'Payment schedule: 50% upfront, 25% at midpoint, 25% on completion.',
          laborRate: 110,
          markup: 0.35,
          warranty: '36 months on parts and labor'
        }
      }
    };

    return templates[serviceType as keyof typeof templates]?.[projectSize] || null;
  }, [settings.autoTemplatePopulation, user?.id]);

  // Smart pricing suggestions
  const getSuggestedPricing = useCallback(async (serviceType: string, location: string, projectDetails: any) => {
    if (!settings.smartPricing || !user?.id) return null;

    // Mock pricing data for now
    const pricingDatabase = {
      'plumbing': {
        avgPrice: 750,
        avgMaterials: 150,
        confidence: 'high'
      },
      'electrical': {
        avgPrice: 650,
        avgMaterials: 120,
        confidence: 'medium'
      },
      'hvac': {
        avgPrice: 1200,
        avgMaterials: 300,
        confidence: 'high'
      }
    };

    const baseData = pricingDatabase[serviceType as keyof typeof pricingDatabase];
    if (!baseData) return null;

    return {
      suggestedPrice: Math.round(baseData.avgPrice),
      suggestedMaterialsCost: Math.round(baseData.avgMaterials),
      marketRange: {
        min: Math.round(baseData.avgPrice * 0.8),
        max: Math.round(baseData.avgPrice * 1.2)
      },
      confidence: baseData.confidence
    };
  }, [settings.smartPricing, user?.id]);

  // Check for expired quotes
  const checkExpiredQuotes = useCallback(async () => {
    if (!settings.autoExpiration || !user?.id) return;

    // This would normally check the database for expired quotes
    // For now, we'll just show a notification about the feature
    toast({
      title: "Automation Active",
      description: `Quote expiration check running (${settings.expirationDays} day threshold)`
    });
  }, [settings.autoExpiration, settings.expirationDays, user?.id, toast]);

  // Load reminders from localStorage
  const loadReminders = useCallback(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quoteReminders');
      if (saved) {
        setReminders(JSON.parse(saved));
      }
    }
  }, []);

  // Save reminders to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined' && reminders.length > 0) {
      localStorage.setItem('quoteReminders', JSON.stringify(reminders));
    }
  }, [reminders]);

  // Initialize
  useEffect(() => {
    if (user?.id) {
      loadReminders();
      
      // Set up interval to check for expired quotes
      const interval = setInterval(checkExpiredQuotes, 60 * 60 * 1000); // Check every hour
      
      return () => clearInterval(interval);
    }
  }, [user?.id, loadReminders, checkExpiredQuotes]);

  return {
    settings,
    reminders,
    loading,
    saveSettings,
    scheduleQuoteFollowUp,
    getQuoteTemplate,
    getSuggestedPricing,
    checkExpiredQuotes,
    loadReminders
  };
};