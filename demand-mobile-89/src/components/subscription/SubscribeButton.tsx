
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';
import { Crown, Loader2 } from 'lucide-react';

interface SubscribeButtonProps {
  planId: string;
  userRole: 'handyman';
  isCurrentPlan?: boolean;
  className?: string;
}

export const SubscribeButton = ({ planId, userRole, isCurrentPlan, className }: SubscribeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { planId, userRole }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success('Redirecting to checkout...');
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSubscribe}
      disabled={isLoading || isCurrentPlan}
      className={`w-full ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : isCurrentPlan ? (
        'Current Plan'
      ) : (
        <>
          <Crown className="w-4 h-4 mr-2" />
          Subscribe Now
        </>
      )}
    </Button>
  );
};
