
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, DollarSign, RefreshCw } from "lucide-react";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  arrival_date: string | null;
  description: string | null;
  created_at: string;
}

export const PayoutHistory = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPayouts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('provider_payouts')
        .select('*')
        .eq('provider_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayouts(data || []);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading payout history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Payout History</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchPayouts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {payouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No payouts yet. Complete jobs to start earning!
          </div>
        ) : (
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">
                      {formatAmount(payout.amount, payout.currency)}
                    </span>
                    <Badge className={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                  </div>
                  {payout.description && (
                    <p className="text-sm text-gray-600">{payout.description}</p>
                  )}
                  <div className="flex items-center text-xs text-gray-500">
                    <CalendarDays className="w-3 h-3 mr-1" />
                    <span>
                      {payout.arrival_date 
                        ? `Arrives ${new Date(payout.arrival_date).toLocaleDateString()}`
                        : `Created ${new Date(payout.created_at).toLocaleDateString()}`
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
