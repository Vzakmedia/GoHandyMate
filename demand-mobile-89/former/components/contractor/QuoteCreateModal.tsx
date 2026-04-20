import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/features/auth';
import { IntegratedQuoteEditor } from "./IntegratedQuoteEditor";

interface QuoteCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const QuoteCreateModal = ({ isOpen, onClose, onSave }: QuoteCreateModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async (quoteData: any) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create quotes",
        variant: "destructive"
      });
      return;
    }

    try {
      // First create or find the customer
      let customerId = null;
      
      if (quoteData.clientEmail) {
        const { data: existingCustomer } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .eq('email', quoteData.clientEmail)
          .single();
          
        if (existingCustomer) {
          customerId = existingCustomer.id;
        }
      }

      // Create quote request
      const { data: quoteRequest, error: quoteError } = await supabase
        .from('contractor_quote_requests')
        .insert({
          contractor_id: user.id,
          customer_id: customerId,
          service_name: quoteData.projectTitle,
          service_description: quoteData.description,
          location: 'TBD',
          preferred_date: quoteData.validDays ? new Date(Date.now() + quoteData.validDays * 24 * 60 * 60 * 1000).toISOString() : null,
          status: 'pending'
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Create quote submission
      const { data: submission, error: submissionError } = await supabase
        .from('contractor_quote_submissions')
        .insert({
          quote_request_id: quoteRequest.id,
          customer_id: customerId,
          quoted_price: quoteData.calculations.total,
          estimated_hours: null,
          materials_cost: quoteData.calculations.materialTotal,
          materials_included: quoteData.materialsIncluded,
          travel_fee: quoteData.travelFee,
          description: quoteData.description,
          availability_note: quoteData.availabilityNote,
          valid_until: new Date(Date.now() + quoteData.validDays * 24 * 60 * 60 * 1000).toISOString(),
          status: quoteData.status
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Create line items
      if (quoteData.lineItems?.length > 0) {
        const lineItemsData = quoteData.lineItems.map((item: any) => ({
          quote_submission_id: submission.id,
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
      console.error('Error creating quote:', error);
      throw error;
    }
  };

  const handleSend = async (quoteData: any) => {
    await handleSave(quoteData);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Quote</DialogTitle>
        </DialogHeader>
        
        <IntegratedQuoteEditor
          mode="create"
          onSave={handleSave}
          onSend={handleSend}
        />
      </DialogContent>
    </Dialog>
  );
};