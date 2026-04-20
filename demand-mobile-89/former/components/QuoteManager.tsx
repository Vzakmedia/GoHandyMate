
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContractorQuotes } from "@/hooks/useContractorQuotes";
import { useQuoteCalculator } from "@/hooks/useQuoteCalculator";
import { QuoteViewModal } from "@/components/contractor/QuoteViewModal";
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  DollarSign,
  User,
  MapPin,
  Send,
  Edit,
  Eye
} from "lucide-react";

export const QuoteManager = () => {
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  
  const { mySubmissions: quotes, loading } = useContractorQuotes();
  const { calculateQuote, formData, updateFormData } = useQuoteCalculator();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'revision_requested':
        return 'bg-orange-100 text-orange-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredQuotes = quotes.filter(quote =>
    (quote.profiles?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (quote.quote_number || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setShowQuoteModal(true);
  };

  const handleEditQuote = (quote: any) => {
    // Implementation for editing quote
    console.log('Edit quote:', quote);
  };

  const handleDownloadQuote = (quote: any) => {
    // Implementation for downloading quote
    console.log('Download quote:', quote);
  };

  const handleSendQuote = (quote: any) => {
    // Implementation for sending quote
    console.log('Send quote:', quote);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Quote Management</h2>
        <Button onClick={() => setShowCreateQuote(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Quote
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search quotes by client or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="revision_requested">Revision Requested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quotes List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading quotes...</p>
          </div>
        ) : filteredQuotes.length > 0 ? (
          filteredQuotes.map((quote) => (
            <Card key={quote.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">Quote {quote.quote_number || `#${quote.id.slice(0, 8)}`}</h3>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{quote.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{quote.profiles?.full_name || 'Customer'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{quote.contractor_quote_requests?.location || 'Location TBD'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {new Date(quote.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      ${(quote.quoted_price || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Quote #{quote.quote_number || quote.id.slice(0, 8)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Status: {quote.status}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewQuote(quote)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditQuote(quote)}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => handleSendQuote(quote)}>
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No quotes found. Create your first quote to get started.</p>
          </div>
        )}
      </div>

      {/* Create Quote Form */}
      {showCreateQuote && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Quote</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientName">Client Name</Label>
                <Input id="clientName" placeholder="Enter client name" />
              </div>
              <div>
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input id="projectTitle" placeholder="Enter project title" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter project location" />
              </div>
              <div>
                <Label htmlFor="amount">Quote Amount</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" type="date" />
              </div>
              <div>
                <Label htmlFor="category">Project Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kitchen">Kitchen Renovation</SelectItem>
                    <SelectItem value="bathroom">Bathroom Remodel</SelectItem>
                    <SelectItem value="basement">Basement Finishing</SelectItem>
                    <SelectItem value="addition">Home Addition</SelectItem>
                    <SelectItem value="exterior">Exterior Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea 
                id="description" 
                placeholder="Detailed description of the project scope..."
                className="min-h-24"
              />
            </div>
            <div className="flex space-x-2">
              <Button>Create Quote</Button>
              <Button variant="outline" onClick={() => setShowCreateQuote(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote View Modal */}
      {selectedQuote && (
        <QuoteViewModal
          quote={selectedQuote}
          isOpen={showQuoteModal}
          onClose={() => {
            setShowQuoteModal(false);
            setSelectedQuote(null);
          }}
          onEdit={() => handleEditQuote(selectedQuote)}
          onDownload={() => handleDownloadQuote(selectedQuote)}
          onSend={() => handleSendQuote(selectedQuote)}
        />
      )}
    </div>
  );
};
