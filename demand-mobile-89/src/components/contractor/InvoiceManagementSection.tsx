import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInvoices } from '@/hooks/useInvoices';
import { useContractorQuotes } from '@/hooks/useContractorQuotes';
import { 
  FileText, 
  Plus, 
  Send, 
  Download, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock,
  AlertCircle,
  Edit,
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

export const InvoiceManagementSection = () => {
  const { 
    invoices, 
    loading: invoicesLoading, 
    stats, 
    createInvoice, 
    updateInvoiceStatus, 
    sendInvoice, 
    downloadInvoice,
    deleteInvoice
  } = useInvoices();
  
  const { 
    sentRequests, 
    receivedSubmissions, 
    loading: quotesLoading
  } = useContractorQuotes();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [invoiceForm, setInvoiceForm] = useState({
    amount: '',
    description: '',
    due_date: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'sent':
        return <Send className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleCreateFromQuote = (quote: any, type: 'request' | 'submission') => {
    setSelectedQuote({ ...quote, type });
    setInvoiceForm({
      amount: type === 'submission' ? quote.quoted_price?.toString() || '' : '',
      description: quote.service_name || quote.description || '',
      due_date: '',
      notes: ''
    });
    setIsCreateModalOpen(true);
  };

  const handleCreateInvoice = async () => {
    if (!selectedQuote || !invoiceForm.amount || !invoiceForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createInvoice({
        quote_request_id: selectedQuote.type === 'request' ? selectedQuote.id : undefined,
        quote_submission_id: selectedQuote.type === 'submission' ? selectedQuote.id : undefined,
        customer_id: selectedQuote.type === 'request' ? selectedQuote.customer_id : selectedQuote.customer_id,
        amount: parseFloat(invoiceForm.amount),
        description: invoiceForm.description,
        due_date: invoiceForm.due_date || undefined,
        notes: invoiceForm.notes || undefined
      });

      setIsCreateModalOpen(false);
      setSelectedQuote(null);
      setInvoiceForm({ amount: '', description: '', due_date: '', notes: '' });
    } catch (error) {
      // Error handled in hook
    }
  };

  const acceptedQuotes = sentRequests.filter(req => req.status === 'accepted');
  const paidSubmissions = receivedSubmissions.filter(sub => sub.status === 'accepted');

  if (invoicesLoading || quotesLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading invoices...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-2xl font-bold">{stats.paid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Invoice from Quotes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-green-600" />
            <span>Create Invoice from Accepted Quotes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {acceptedQuotes.length === 0 && paidSubmissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No accepted quotes available for invoicing</p>
              <p className="text-sm">Send quote requests and wait for acceptance to create invoices</p>
            </div>
          ) : (
            <div className="space-y-4">
              {acceptedQuotes.map((quote) => (
                <div key={quote.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{quote.service_name}</h3>
                    <p className="text-sm text-gray-600">Customer: {quote.profiles?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">Budget: {quote.budget_range || 'Not specified'}</p>
                  </div>
                  <Button 
                    onClick={() => handleCreateFromQuote(quote, 'request')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </div>
              ))}
              
              {paidSubmissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{submission.contractor_quote_requests?.service_name || 'Service'}</h3>
                    <p className="text-sm text-gray-600">Customer: {submission.profiles?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-600">Quote: ${submission.quoted_price?.toFixed(2)}</p>
                  </div>
                  <Button 
                    onClick={() => handleCreateFromQuote(submission, 'submission')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Invoice
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>All Invoices</span>
            <Badge variant="secondary">{invoices.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No invoices created yet</p>
              <p className="text-sm">Create invoices from accepted quotes above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                        <Badge className={getStatusColor(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
                        </Badge>
                      </div>
                      <p className="text-gray-700 mb-2">{invoice.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium text-green-600">${invoice.amount.toFixed(2)}</span>
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
                      </div>
                      {invoice.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">{invoice.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => downloadInvoice(invoice)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    
                    {invoice.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => sendInvoice(invoice.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send
                      </Button>
                    )}
                    
                    {invoice.status === 'sent' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Paid
                      </Button>
                    )}

                    {invoice.status !== 'paid' && (
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => deleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Invoice Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>
              Create an invoice from the selected quote
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
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
                className="flex-1 bg-green-600 hover:bg-green-700"
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
  );
};