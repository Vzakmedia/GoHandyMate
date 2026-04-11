
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Download, Receipt, Search, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  property: string;
  unit: string;
  service: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
}

interface ServiceHistory {
  id: string;
  property: string;
  unit: string;
  service: string;
  technician: string;
  date: string;
  cost: number;
  status: 'completed' | 'warranty' | 'follow-up-needed';
}

export const BulkBilling = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'billing' | 'history'>('billing');
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [serviceHistory, setServiceHistory] = useState<ServiceHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchBillingData();
    fetchServiceHistory();
  }, [user]);

  const fetchBillingData = async () => {
    if (!user) return;

    try {
      const { data: jobRequests, error } = await supabase
        .from('job_requests')
        .select(`
          *,
          units!job_requests_unit_id_fkey (
            unit_number,
            property_address
          )
        `)
        .eq('manager_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedInvoices: Invoice[] = jobRequests?.map(job => ({
        id: `JOB-${job.id.slice(0, 8)}`,
        property: job.units?.property_address || job.location || 'Unknown Property',
        unit: job.units?.unit_number || 'N/A',
        service: job.title,
        amount: job.budget || 0,
        date: new Date(job.created_at).toISOString().split('T')[0],
        status: job.status === 'completed' ? 'paid' : job.status === 'assigned' ? 'pending' : 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })) || [];

      setInvoices(formattedInvoices);
    } catch (error) {
      console.error('Error fetching billing data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch billing data",
        variant: "destructive",
      });
    }
  };

  const fetchServiceHistory = async () => {
    if (!user) return;

    try {
      const { data: completedJobs, error } = await supabase
        .from('job_requests')
        .select(`
          *,
          units!job_requests_unit_id_fkey (
            unit_number,
            property_address
          )
        `)
        .eq('manager_id', user.id)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedHistory: ServiceHistory[] = completedJobs?.map(job => ({
        id: job.id,
        property: job.units?.property_address || job.location || 'Unknown Property',
        unit: job.units?.unit_number || 'N/A',
        service: job.title,
        technician: 'Assigned Technician', // Can be enhanced with actual technician data
        date: new Date(job.updated_at).toISOString().split('T')[0],
        cost: job.budget || 0,
        status: 'completed'
      })) || [];

      setServiceHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching service history:', error);
      toast({
        title: "Error",
        description: "Failed to fetch service history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'warranty': return 'bg-blue-100 text-blue-700';
      case 'follow-up-needed': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTotalAmount = () => {
    return invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getPendingAmount = () => {
    return invoices
      .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.unit.includes(searchTerm) ||
    invoice.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = serviceHistory.filter(record =>
    record.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.unit.includes(searchTerm) ||
    record.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">${getTotalAmount().toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Billed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">${getPendingAmount().toLocaleString()}</div>
                <div className="text-sm text-gray-600">Pending Payment</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{invoices.length}</div>
                <div className="text-sm text-gray-600">Total Invoices</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'billing' ? 'default' : 'outline'}
            onClick={() => setActiveTab('billing')}
          >
            Billing
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
          >
            Service History
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'billing' ? (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Management</CardTitle>
            <CardDescription>Manage billing across all properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{invoice.id}</h3>
                      <div className="text-sm text-gray-600">
                        {invoice.property} - Unit {invoice.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">${invoice.amount}</div>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Service: {invoice.service}</span>
                    <span>Due: {invoice.dueDate}</span>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Download PDF</Button>
                    {invoice.status !== 'paid' && (
                      <Button size="sm">Send Reminder</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Service History</CardTitle>
            <CardDescription>Detailed service records per unit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredHistory.map((record) => (
                <div key={record.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{record.service}</h3>
                      <div className="text-sm text-gray-600">
                        {record.property} - Unit {record.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">${record.cost}</div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Technician: {record.technician}</span>
                    <span>Date: {record.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
