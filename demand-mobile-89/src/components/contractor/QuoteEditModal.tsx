import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';
import { IntegratedQuoteEditor } from './IntegratedQuoteEditor';

interface QuoteEditModalProps {
  quote: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const QuoteEditModal = ({ quote, isOpen, onClose, onSave }: QuoteEditModalProps) => {
  const { toast } = useToast();
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const loadQuoteData = async () => {
      if (!quote?.id || !isOpen) return;

      // Load existing line items
      const { data: items } = await supabase
        .from('quote_line_items')
        .select('*')
        .eq('quote_submission_id', quote.id)
        .order('created_at');

      const lineItems = items?.map(item => ({
        ...item,
        item_type: item.item_type as 'material' | 'labor' | 'service' | 'other',
        unit_measure: item.unit_measure || 'each',
        notes: item.notes || '',
        total_price: item.quantity * item.unit_price
      })) || [];

      // Get customer details if available
      let customerName = '';
      let customerEmail = '';
      
      if (quote.customer_id) {
        const { data: customer } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', quote.customer_id)
          .single();
          
        if (customer) {
          customerName = customer.full_name || '';
          customerEmail = customer.email || '';
        }
      }

      // Map quote data to editor format
      setInitialData({
        projectTitle: quote.service_name || '',
        clientName: customerName || quote.customer_name || '',
        clientEmail: customerEmail || quote.customer_email || '',
        serviceCategory: '',
        description: quote.description || '',
        laborRate: 50,
        overhead: 15,
        profitMargin: 20,
        isUrgent: false,
        isAfterHours: false,
        validDays: quote.valid_until ? Math.ceil((new Date(quote.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 30,
        materialsIncluded: quote.materials_included || false,
        travelFee: quote.travel_fee || 0,
        availabilityNote: quote.availability_note || '',
        lineItems
      });
    };

    loadQuoteData();
  }, [quote?.id, isOpen]);

  const handleSave = async (quoteData: any) => {
    if (!quote?.id) return;

    try {
      const { error } = await supabase
        .from('contractor_quote_submissions')
        .update({
          quoted_price: quoteData.calculations.total,
          description: quoteData.description,
          materials_cost: quoteData.calculations.materialTotal,
          materials_included: quoteData.materialsIncluded,
          travel_fee: quoteData.travelFee,
          availability_note: quoteData.availabilityNote,
          valid_until: new Date(Date.now() + quoteData.validDays * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', quote.id);

      if (error) throw error;

      // Delete existing line items and create new ones
      await supabase
        .from('quote_line_items')
        .delete()
        .eq('quote_submission_id', quote.id);

      if (quoteData.lineItems?.length > 0) {
        const lineItemsData = quoteData.lineItems.map((item: any) => ({
          quote_submission_id: quote.id,
          item_type: item.item_type,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          unit_measure: item.unit_measure,
          notes: item.notes
        }));

        const { error: lineItemsError } = await supabase
          .from('quote_line_items')
          .insert(lineItemsData);

        if (lineItemsError) throw lineItemsError;
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error updating quote:', error);
      throw error;
    }
  };

  const handleSend = async (quoteData: any) => {
    await handleSave(quoteData);
  };

  if (!quote || !initialData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Quote</DialogTitle>
          <DialogDescription>
            Update your quote details for {quote.service_name}
          </DialogDescription>
        </DialogHeader>

        <IntegratedQuoteEditor
          mode="edit"
          initialData={initialData}
          onSave={handleSave}
          onSend={handleSend}
        />
      </DialogContent>
    </Dialog>
  );
};