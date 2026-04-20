
import { useState } from "react";
import { IntegratedQuoteEditor } from "./IntegratedQuoteEditor";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface QuoteCalculatorProps {
  onQuoteCreated?: (quote: any) => void;
  initialData?: any;
  onBack?: () => void;
}

export const QuoteCalculator = ({ onQuoteCreated, initialData, onBack }: QuoteCalculatorProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

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
      setIsProcessing(true);
      
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
          status: quoteData.status || 'draft'
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

      toast({
        title: "Quote Saved",
        description: "Quote has been saved successfully to your quotes list.",
      });
      
      onQuoteCreated?.(quoteData);
    } catch (error: any) {
      console.error('Error saving quote:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save quote. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = async (quoteData: any) => {
    await handleSave({ ...quoteData, status: 'sent' });
  };

  return (
    <div className="space-y-4">
      {onBack && (
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>
      )}
      
      <IntegratedQuoteEditor
        mode="create"
        initialData={initialData}
        onSave={handleSave}
        onSend={handleSend}
      />
    </div>
  );
};
