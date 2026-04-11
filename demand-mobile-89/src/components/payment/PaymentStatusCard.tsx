
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, TrendingUp, RefreshCw } from "lucide-react";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";

interface PaymentStats {
  totalEarnings: number;
  monthlyEarnings: number;
  pendingPayments: number;
  completedJobs: number;
}

export const PaymentStatusCard = () => {
  const [stats, setStats] = useState<PaymentStats>({
    totalEarnings: 0,
    monthlyEarnings: 0,
    pendingPayments: 0,
    completedJobs: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchPaymentStats = async () => {
    if (!user) return;

    try {
      // Fetch escrow payments for this user
      const { data: payments, error } = await supabase
        .from('escrow_payments')
        .select('*')
        .eq('provider_id', user.id);

      if (error) throw error;

      if (payments) {
        const total = payments
          .filter(p => p.status === 'released')
          .reduce((sum, p) => sum + p.amount_provider, 0);

        const thisMonth = payments
          .filter(p => {
            const paymentDate = new Date(p.created_at);
            const now = new Date();
            return paymentDate.getMonth() === now.getMonth() && 
                   paymentDate.getFullYear() === now.getFullYear() &&
                   p.status === 'released';
          })
          .reduce((sum, p) => sum + p.amount_provider, 0);

        const pending = payments
          .filter(p => p.status === 'pending' || p.status === 'escrowed')
          .reduce((sum, p) => sum + p.amount_provider, 0);

        setStats({
          totalEarnings: total,
          monthlyEarnings: thisMonth,
          pendingPayments: pending,
          completedJobs: payments.filter(p => p.status === 'released').length
        });
      }
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentStats();
  }, [user]);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading payment stats...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Total Earnings
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatAmount(stats.totalEarnings)}
          </div>
          <div className="text-xs text-gray-600">All time</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            This Month
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatAmount(stats.monthlyEarnings)}
          </div>
          <div className="text-xs text-gray-600">Current month</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Pending
            <CreditCard className="w-4 h-4 text-yellow-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {formatAmount(stats.pendingPayments)}
          </div>
          <div className="text-xs text-gray-600">In escrow</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Completed Jobs
            <Badge variant="outline">{stats.completedJobs}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPaymentStats}
            className="w-full"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
