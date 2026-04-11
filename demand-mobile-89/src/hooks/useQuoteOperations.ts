import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useQuoteOperations = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generatePDF = async (quoteId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('quote-operations', {
        body: {
          action: 'generate_pdf',
          quoteId
        }
      });

      if (error) throw error;

      if (data?.pdf) {
        // Create a blob from the HTML content and trigger download
        const blob = new Blob([data.pdf], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = data.filename || `quote-${quoteId}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
          title: "PDF Generated",
          description: "Quote PDF has been downloaded successfully.",
        });
      }

      return data;
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendQuote = async (quoteId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('quote-operations', {
        body: {
          action: 'send_quote',
          quoteId
        }
      });

      if (error) throw error;

      toast({
        title: "Quote Sent",
        description: "Quote has been sent to the customer successfully.",
      });

      return data;
    } catch (error: any) {
      console.error('Error sending quote:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send quote. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    generatePDF,
    sendQuote,
    loading
  };
};