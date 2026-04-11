
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock,
  Eye,
  Edit,
  Send,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContractorMetrics } from "@/hooks/useContractorMetrics";
import { useQuoteOperations } from "@/hooks/useQuoteOperations";
import { QuoteViewModal } from "@/components/contractor/QuoteViewModal";
import { QuoteEditModal } from "@/components/contractor/QuoteEditModal";
import { InvoiceManagementSection } from "@/components/contractor/InvoiceManagementSection";
import { QuoteTemplateSection } from "@/components/contractor/QuoteTemplateSection";
import { QuoteCreateModal } from "@/components/contractor/QuoteCreateModal";

interface Quote {
  id: string;
  clientName: string;
  projectTitle: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  amount: number;
  createdDate: string;
  sentDate?: string;
  expiryDate: string;
  description: string;
  category: string;
}

export const QuoteManagerEnhanced = () => {
  const { toast } = useToast();
  const { metrics, loading, refreshMetrics } = useContractorMetrics();
  const { generatePDF, sendQuote, loading: operationsLoading } = useQuoteOperations();
  const [activeTab, setActiveTab] = useState("quotes");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewQuoteForm, setShowNewQuoteForm] = useState(false);
  
  // Modal states
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Get quotes from real data
  const quotes = Array.isArray(metrics.quotesData) ? metrics.quotesData : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = (quote.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (quote.projectTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSendQuote = async (quoteId: string) => {
    try {
      await sendQuote(quoteId);
      await refreshMetrics(); // Refresh data after sending
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setShowViewModal(true);
  };

  const handleEditQuote = (quote: any) => {
    setSelectedQuote(quote);
    setShowEditModal(true);
  };

  const handleDownloadQuote = async (quote: any) => {
    try {
      await generatePDF(quote.id);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleModalClose = () => {
    setSelectedQuote(null);
    setShowViewModal(false);
    setShowEditModal(false);
  };

  const handleEditSave = async () => {
    await refreshMetrics(); // Refresh data after editing
    handleModalClose();
  };

  const handleCreateQuote = () => {
    setShowNewQuoteForm(true);
  };

  const handleCreateQuoteClose = () => {
    setShowNewQuoteForm(false);
  };

  const handleCreateQuoteSave = async () => {
    await refreshMetrics(); // Refresh data after creating
    setShowNewQuoteForm(false);
  };

  const QuoteCard = ({ quote }: { quote: any }) => (
    <Card className="hover:shadow-md transition-shadow animate-fade-in border-2 rounded-xl">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header Row - Mobile Optimized */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate">
                {quote.projectTitle || quote.title || 'Project'}
              </h3>
              <p className="text-sm text-muted-foreground truncate mt-1">{quote.clientName || 'Client'}</p>
            </div>
            <Badge className={`${getStatusColor(quote.status)} flex-shrink-0 text-xs font-medium px-2 py-1 rounded-lg`}>
              {getStatusIcon(quote.status)}
              <span className="ml-1 capitalize">{quote.status}</span>
            </Badge>
          </div>
          
          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {quote.description || 'No description available'}
          </p>
          
          {/* Price and Meta Info - Stacked on Mobile */}
          <div className="space-y-3">
            <div className="text-2xl font-bold text-primary">
              ${(quote.amount || quote.quoted_price || 0).toLocaleString()}
            </div>
            <div className="flex flex-col space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Created {new Date(quote.created_at || quote.createdDate).toLocaleDateString()}</span>
              </div>
              {quote.valid_until && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Expires {new Date(quote.valid_until).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions - Mobile-First Grid */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button 
              variant="outline" 
              size="default"
              onClick={() => handleViewQuote(quote)}
              className="min-h-[44px] text-sm font-medium"
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button 
              variant="outline" 
              size="default"
              onClick={() => handleEditQuote(quote)}
              className="min-h-[44px] text-sm font-medium"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            {quote.status === 'pending' && (
              <Button 
                size="default"
                onClick={() => handleSendQuote(quote.id)}
                className="min-h-[44px] text-sm font-medium"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            )}
            <Button 
              variant="outline" 
              size="default"
              onClick={() => handleDownloadQuote(quote)}
              className="min-h-[44px] text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const QuoteStats = () => {
    const stats = {
      total: quotes.length,
      sent: quotes.filter(q => q.status === 'pending').length,
      accepted: quotes.filter(q => ['accepted', 'approved'].includes(q.status)).length,
      totalValue: quotes.filter(q => ['accepted', 'approved'].includes(q.status)).reduce((sum, q) => sum + (q.amount || q.quoted_price || 0), 0)
    };

    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <Card className="hover:shadow-lg transition-all duration-200 border-2 rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stats.total}</div>
            <div className="text-sm font-medium text-muted-foreground">Total Quotes</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-2 rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">{stats.sent}</div>
            <div className="text-sm font-medium text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-2 rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">{stats.accepted}</div>
            <div className="text-sm font-medium text-muted-foreground">Accepted</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-all duration-200 border-2 rounded-xl">
          <CardContent className="p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-500 mb-1">${stats.totalValue.toLocaleString()}</div>
            <div className="text-sm font-medium text-muted-foreground">Total Value</div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Quote Manager</h2>
          <p className="text-sm text-gray-600">Manage quotes, estimates, and invoices</p>
        </div>
        <Button onClick={handleCreateQuote} className="w-full sm:w-auto text-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Quote
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 text-sm">
          <TabsTrigger value="quotes" className="text-xs sm:text-sm">Quotes</TabsTrigger>
          <TabsTrigger value="invoices" className="text-xs sm:text-sm">Invoices</TabsTrigger>
          <TabsTrigger value="templates" className="text-xs sm:text-sm">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="quotes" className="space-y-4 sm:space-y-6">
          <QuoteStats />

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search quotes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quotes List */}
          <div className="space-y-3 sm:space-y-4">
            {loading ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm text-gray-500">Loading quotes...</p>
              </div>
            ) : filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))
            ) : (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm text-gray-500">No quotes found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4 sm:space-y-6">
          <InvoiceManagementSection />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4 sm:space-y-6">
          <QuoteTemplateSection />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <QuoteCreateModal
        isOpen={showNewQuoteForm}
        onClose={handleCreateQuoteClose}
        onSave={handleCreateQuoteSave}
      />

      <QuoteViewModal
        quote={selectedQuote}
        isOpen={showViewModal}
        onClose={handleModalClose}
        onEdit={() => {
          setShowViewModal(false);
          setShowEditModal(true);
        }}
        onDownload={() => handleDownloadQuote(selectedQuote)}
        onSend={() => handleSendQuote(selectedQuote?.id)}
      />

      <QuoteEditModal
        quote={selectedQuote}
        isOpen={showEditModal}
        onClose={handleModalClose}
        onSave={handleEditSave}
      />
    </div>
  );
};
