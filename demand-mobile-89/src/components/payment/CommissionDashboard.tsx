
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CommissionStats {
  totalCommissions: number;
  monthlyCommissions: number;
  commissionsCount: number;
  averageCommissionRate: number;
}

interface CommissionRecord {
  id: string;
  commission_amount: number;
  commission_rate: number;
  collected_at: string;
  job_requests: {
    title: string;
  };
}

export const CommissionDashboard = () => {
  const [stats, setStats] = useState<CommissionStats>({
    totalCommissions: 0,
    monthlyCommissions: 0,
    commissionsCount: 0,
    averageCommissionRate: 0.15
  });
  const [recentCommissions, setRecentCommissions] = useState<CommissionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissionData();
  }, []);

  const fetchCommissionData = async () => {
    try {
      // Fetch commission stats
      const { data: commissions, error } = await supabase
        .from('commission_records')
        .select(`
          *,
          job_requests (title)
        `)
        .order('collected_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (commissions) {
        const total = commissions.reduce((sum, c) => sum + c.commission_amount, 0);
        const thisMonth = commissions
          .filter(c => new Date(c.collected_at).getMonth() === new Date().getMonth())
          .reduce((sum, c) => sum + c.commission_amount, 0);

        setStats({
          totalCommissions: total,
          monthlyCommissions: thisMonth,
          commissionsCount: commissions.length,
          averageCommissionRate: 0.15
        });

        setRecentCommissions(commissions);
      }
    } catch (error) {
      console.error('Error fetching commission data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="text-center">Loading...</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatAmount(stats.totalCommissions)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>All time</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatAmount(stats.monthlyCommissions)}
            </div>
            <div className="flex items-center text-xs text-blue-600">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Current month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {stats.commissionsCount}
            </div>
            <div className="text-xs text-gray-600">
              Commission records
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Commission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {(stats.averageCommissionRate * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">
              Platform fee
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Commissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Recent Commission Records</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentCommissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No commission records yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentCommissions.map((commission) => (
                <div key={commission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      {commission.job_requests?.title || 'Job Commission'}
                    </div>
                    <div className="text-sm text-gray-600">
                      Rate: {(commission.commission_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(commission.collected_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      {formatAmount(commission.commission_amount)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Commission
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
