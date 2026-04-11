
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContractorMetrics } from "@/hooks/useContractorMetrics";
import { 
  Calculator, 
  DollarSign, 
  FileText, 
  Send, 
  Eye, 
  Edit, 
  Copy,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  User,
  MapPin
} from "lucide-react";

export const ContractorQuotes = () => {
  const { metrics, loading } = useContractorMetrics();
  
  // Get quotes from real data
  const quotes = Array.isArray(metrics.quotesData) ? metrics.quotesData : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': 
      case 'approved': return 'bg-green-100 text-green-800';
      case 'declined':
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted':
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'declined':
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const pendingQuotes = quotes.filter(q => q.status === 'pending');
  const acceptedQuotes = quotes.filter(q => ['accepted', 'approved'].includes(q.status));
  const completedQuotes = quotes.filter(q => ['declined', 'rejected', 'expired'].includes(q.status));

  const QuoteCard = ({ quote }: { quote: any }) => (
    <div className="p-3 sm:p-4 border rounded-lg space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm sm:text-base text-gray-900">
            {quote.title || quote.project || quote.projectTitle || 'Project'}
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{quote.client || quote.clientName || 'Client'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{quote.location || 'Location TBD'}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">
          <Badge className={getStatusColor(quote.status)}>
            {getStatusIcon(quote.status)}
            <span className="ml-1">{quote.status}</span>
          </Badge>
          <div className="text-sm sm:text-lg font-semibold text-green-600">
            ${(quote.amount || quote.budget || 0).toLocaleString()}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
        <div>
          <span className="text-gray-600">Materials:</span>
          <div className="font-medium">${(quote.materials || 0).toLocaleString()}</div>
        </div>
        <div>
          <span className="text-gray-600">Labor:</span>
          <div className="font-medium">${(quote.labor || 0).toLocaleString()}</div>
        </div>
        <div>
          <span className="text-gray-600">Profit:</span>
          <div className="font-medium text-green-600">${(quote.margin || 0).toLocaleString()}</div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-2">
        <div>
          <span>Created: {new Date(quote.createdDate || quote.created_at).toLocaleDateString()}</span>
          {quote.validUntil && (
            <>
              <span className="mx-2">•</span>
              <span>Valid until: {new Date(quote.validUntil).toLocaleDateString()}</span>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Quote Management</h2>
          <p className="text-sm text-gray-600">Create and manage project quotes</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Quote
        </Button>
      </div>

      {/* Quote Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{quotes.length}</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pending Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              ${pendingQuotes.reduce((sum, q) => sum + (q.amount || q.budget || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">{pendingQuotes.length} quotes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Accepted Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              ${acceptedQuotes.reduce((sum, q) => sum + (q.amount || q.budget || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">{acceptedQuotes.length} quotes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {quotes.length > 0 ? Math.round((acceptedQuotes.length / quotes.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Quote Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending" className="text-xs sm:text-sm">
            Pending ({pendingQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="accepted" className="text-xs sm:text-sm">
            Accepted ({acceptedQuotes.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Completed ({completedQuotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading quotes...</p>
              </div>
            ) : pendingQuotes.length > 0 ? (
              pendingQuotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No pending quotes found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading quotes...</p>
              </div>
            ) : acceptedQuotes.length > 0 ? (
              acceptedQuotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No accepted quotes found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading quotes...</p>
              </div>
            ) : completedQuotes.length > 0 ? (
              completedQuotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed quotes found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Quote Calculator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
            <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Quick Quote Calculator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="materials">Materials Cost</Label>
              <Input id="materials" placeholder="$0.00" />
            </div>
            <div>
              <Label htmlFor="labor">Labor Cost</Label>
              <Input id="labor" placeholder="$0.00" />
            </div>
            <div>
              <Label htmlFor="margin">Profit Margin (%)</Label>
              <Input id="margin" placeholder="20" />
            </div>
            <div>
              <Label htmlFor="total">Total Quote</Label>
              <Input id="total" placeholder="$0.00" readOnly className="bg-gray-50" />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate
            </Button>
            <Button variant="outline" className="w-full sm:w-auto">
              <FileText className="w-4 h-4 mr-2" />
              Create Quote
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
