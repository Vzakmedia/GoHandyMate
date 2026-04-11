
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EscrowPaymentFormProps {
  jobRequestId: string;
  providerId: string;
  onPaymentCreated?: (clientSecret: string) => void;
}

export const EscrowPaymentForm = ({ jobRequestId, providerId, onPaymentCreated }: EscrowPaymentFormProps) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createEscrowPayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid payment amount.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const amountInCents = Math.round(parseFloat(amount) * 100);
      
      const { data, error } = await supabase.functions.invoke('create-escrow-payment', {
        body: {
          job_request_id: jobRequestId,
          provider_id: providerId,
          amount_total: amountInCents,
          commission_rate: 0.15 // 15% platform commission
        }
      });

      if (error) throw error;

      toast({
        title: "Payment Created",
        description: "Escrow payment has been set up successfully.",
      });

      if (onPaymentCreated) {
        onPaymentCreated(data.client_secret);
      }
    } catch (error) {
      console.error('Error creating escrow payment:', error);
      toast({
        title: "Error",
        description: "Failed to create escrow payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Secure Payment</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Payment Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <div className="flex justify-between">
            <span>Payment Amount:</span>
            <span>${amount || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Platform Fee (15%):</span>
            <span>-${amount ? (parseFloat(amount) * 0.15).toFixed(2) : '0.00'}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2 mt-2">
            <span>Provider Receives:</span>
            <span>${amount ? (parseFloat(amount) * 0.85).toFixed(2) : '0.00'}</span>
          </div>
        </div>

        <div className="text-xs text-gray-600">
          Payment will be held in escrow until the job is completed and approved.
        </div>

        <Button 
          onClick={createEscrowPayment}
          disabled={loading || !amount}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Payment...
            </>
          ) : (
            'Create Secure Payment'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
