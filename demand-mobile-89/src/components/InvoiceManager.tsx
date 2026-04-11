
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useInvoices } from "@/hooks/useInvoices";
import { useAuth } from '@/features/auth';
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  DollarSign,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

export const InvoiceManager = () => {
  const { user } = useAuth();
  const { 
    invoices, 
    loading, 
    stats, 
    createInvoice, 
    updateInvoiceStatus, 
    sendInvoice, 
    downloadInvoice, 
    deleteInvoice 
  } = useInvoices();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    customer_id: '',
    amount: '',
    description: '',
    due_date: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending':
      case 'sent':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleCreateInvoice = async () => {
    if (!invoiceForm.customer_id || !invoiceForm.amount || !invoiceForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createInvoice({
        customer_id: invoiceForm.customer_id,
        amount: parseFloat(invoiceForm.amount),
        description: invoiceForm.description,
        due_date: invoiceForm.due_date || undefined,
        notes: invoiceForm.notes || undefined
      });

      setIsCreateModalOpen(false);
      setInvoiceForm({ customer_id: '', amount: '', description: '', due_date: '', notes: '' });
    } catch (error) {
      // Error handled in hook
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const clientName = invoice.customer_profile?.full_name || invoice.contractor_profile?.full_name || 'Unknown';
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading invoices...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Invoice Management</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Create a new invoice for your customer
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="customer_id">Customer ID *</Label>
                <Input
                  id="customer_id"
                  value={invoiceForm.customer_id}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, customer_id: e.target.value }))}
                  placeholder="Enter customer ID"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="amount">Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the work performed..."
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={invoiceForm.due_date}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or terms..."
                  rows={2}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleCreateInvoice}
                  className="flex-1"
                >
                  Create Invoice
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${stats.pendingAmount.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Invoices</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search invoices by client, project, or invoice ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices List */}
      <div className="grid gap-4">
        {filteredInvoices.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-2">No invoices found</p>
              <p className="text-sm text-gray-400">
                {invoices.length === 0 
                  ? 'Create your first invoice to get started' 
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredInvoices.map((invoice) => {
            const clientName = invoice.customer_profile?.full_name || invoice.contractor_profile?.full_name || 'Unknown';
            const isContractor = invoice.contractor_id === user?.id;
            
            return (
              <Card key={invoice.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(invoice.status)}
                            <span>{invoice.status}</span>
                          </div>
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{invoice.description}</p>
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{isContractor ? 'To: ' : 'From: '}{clientName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {new Date(invoice.created_at).toLocaleDateString()}</span>
                        </div>
                        {invoice.due_date && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {invoice.paid_at && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Paid: {new Date(invoice.paid_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      {invoice.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">{invoice.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        ${invoice.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-sm text-gray-500">
                      Updated: {new Date(invoice.updated_at).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadInvoice(invoice)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      
                      {isContractor && invoice.status === 'draft' && (
                        <Button 
                          size="sm"
                          onClick={() => sendInvoice(invoice.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </Button>
                      )}
                      
                      {isContractor && invoice.status === 'sent' && (
                        <Button 
                          size="sm"
                          onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                      
                      {isContractor && invoice.status !== 'paid' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteInvoice(invoice.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
