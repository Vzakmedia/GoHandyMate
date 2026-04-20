import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Plus, Trash2, Save, Send, DollarSign, Package, Wrench, Search, User, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth';

export interface QuoteLineItem {
  id?: string;
  item_type: 'material' | 'labor' | 'service' | 'other';
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit_measure: string;
  notes?: string;
}

interface QuoteFormData {
  projectTitle: string;
  clientName: string;
  clientEmail: string;
  serviceCategory: string;
  description: string;
  laborRate: number;
  overhead: number;
  profitMargin: number;
  isUrgent: boolean;
  isAfterHours: boolean;
  validDays: number;
  materialsIncluded: boolean;
  travelFee: number;
  availabilityNote: string;
}

interface IntegratedQuoteEditorProps {
  initialData?: any;
  onSave?: (data: any) => void;
  onSend?: (data: any) => void;
  mode?: 'create' | 'edit';
}

export const IntegratedQuoteEditor = ({ 
  initialData, 
  onSave, 
  onSend, 
  mode = 'create' 
}: IntegratedQuoteEditorProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [customerSearchResults, setCustomerSearchResults] = useState<any[]>([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState<QuoteFormData>({
    projectTitle: initialData?.projectTitle || '',
    clientName: initialData?.clientName || '',
    clientEmail: initialData?.clientEmail || '',
    serviceCategory: initialData?.serviceCategory || '',
    description: initialData?.description || '',
    laborRate: initialData?.laborRate || 50,
    overhead: initialData?.overhead || 15,
    profitMargin: initialData?.profitMargin || 20,
    isUrgent: initialData?.isUrgent || false,
    isAfterHours: initialData?.isAfterHours || false,
    validDays: initialData?.validDays || 30,
    materialsIncluded: initialData?.materialsIncluded || false,
    travelFee: initialData?.travelFee || 0,
    availabilityNote: initialData?.availabilityNote || ''
  });

  const [lineItems, setLineItems] = useState<QuoteLineItem[]>(initialData?.lineItems || []);
  
  const [newItem, setNewItem] = useState<Omit<QuoteLineItem, 'total_price'>>({
    item_type: 'material',
    description: '',
    quantity: 1,
    unit_price: 0,
    unit_measure: 'each',
    notes: ''
  });

  // Calculate totals automatically
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    laborTotal: 0,
    materialTotal: 0,
    serviceTotal: 0,
    otherTotal: 0,
    overheadAmount: 0,
    profitAmount: 0,
    urgencyFee: 0,
    travelFeeAmount: 0,
    total: 0
  });

  useEffect(() => {
    calculateTotals();
  }, [lineItems, formData]);

  const calculateTotals = () => {
    const laborTotal = lineItems
      .filter(item => item.item_type === 'labor')
      .reduce((sum, item) => sum + item.total_price, 0);
      
    const materialTotal = lineItems
      .filter(item => item.item_type === 'material')
      .reduce((sum, item) => sum + item.total_price, 0);
      
    const serviceTotal = lineItems
      .filter(item => item.item_type === 'service')
      .reduce((sum, item) => sum + item.total_price, 0);
      
    const otherTotal = lineItems
      .filter(item => item.item_type === 'other')
      .reduce((sum, item) => sum + item.total_price, 0);

    const subtotal = laborTotal + materialTotal + serviceTotal + otherTotal;
    const overheadAmount = (subtotal * formData.overhead) / 100;
    const profitAmount = (subtotal * formData.profitMargin) / 100;
    
    let urgencyFee = 0;
    if (formData.isUrgent) urgencyFee += subtotal * 0.25;
    if (formData.isAfterHours) urgencyFee += subtotal * 0.50;
    
    const travelFeeAmount = formData.travelFee;
    const total = subtotal + overheadAmount + profitAmount + urgencyFee + travelFeeAmount;

    setCalculations({
      subtotal,
      laborTotal,
      materialTotal,
      serviceTotal,
      otherTotal,
      overheadAmount,
      profitAmount,
      urgencyFee,
      travelFeeAmount,
      total
    });
  };

  const addLineItem = () => {
    if (!newItem.description.trim()) return;

    const item: QuoteLineItem = {
      ...newItem,
      total_price: newItem.quantity * newItem.unit_price,
      id: `temp-${Date.now()}`
    };

    setLineItems([...lineItems, item]);
    setNewItem({
      item_type: 'material',
      description: '',
      quantity: 1,
      unit_price: 0,
      unit_measure: 'each',
      notes: ''
    });
  };

  const updateLineItem = (index: number, field: keyof QuoteLineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { 
      ...updated[index], 
      [field]: value,
      total_price: field === 'quantity' || field === 'unit_price' 
        ? (field === 'quantity' ? value : updated[index].quantity) * 
          (field === 'unit_price' ? value : updated[index].unit_price)
        : updated[index].total_price
    };
    setLineItems(updated);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case 'material': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'labor': return 'bg-green-50 text-green-700 border-green-200';
      case 'service': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'other': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const handleSave = async () => {
    if (!formData.projectTitle || !formData.clientName) {
      toast({
        title: "Missing Information",
        description: "Please fill in project title and client name",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const quoteData = {
        ...formData,
        lineItems,
        calculations,
        status: 'draft'
      };
      
      await onSave?.(quoteData);
      
      toast({
        title: "Quote Saved",
        description: "Quote saved successfully as draft",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quote",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!formData.projectTitle || !formData.clientName || !formData.clientEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including client email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const quoteData = {
        ...formData,
        lineItems,
        calculations,
        status: 'sent'
      };
      
      await onSend?.(quoteData);
      
      toast({
        title: "Quote Sent",
        description: "Quote sent successfully to client",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send quote",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchCustomers = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setCustomerSearchResults([]);
      setShowCustomerSearch(false);
      return;
    }

    try {
      // Search in both profiles and contractor quote requests for comprehensive results
      const [profilesResponse, quotesResponse] = await Promise.all([
        // Search in profiles for existing customers
        supabase
          .from('profiles')
          .select('id, email, full_name, phone')
          .eq('user_role', 'customer')
          .or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
          .limit(10),
        
        // Search in contractor quote requests for past clients
        supabase
          .from('contractor_quote_requests')
          .select(`
            id,
            customer_id,
            service_name,
            created_at,
            contractor_quote_submissions!inner(
              customer_id,
              quoted_price,
              description
            )
          `)
          .eq('contractor_id', user?.id)
          .or(`service_name.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false })
          .limit(5)
      ]);

      const customers = profilesResponse.data || [];
      const pastQuotes = quotesResponse.data || [];

      // Get customer details for past quotes
      const customerIds = pastQuotes
        .map(quote => quote.customer_id)
        .filter(Boolean);

      let pastCustomers: any[] = [];
      if (customerIds.length > 0) {
        const { data: pastCustomerData } = await supabase
          .from('profiles')
          .select('id, email, full_name, phone')
          .in('id', customerIds);
        
        pastCustomers = pastCustomerData || [];
      }

      // Combine and deduplicate results
      const allCustomers = [...customers];
      pastCustomers.forEach(pastCustomer => {
        if (!allCustomers.find(c => c.id === pastCustomer.id)) {
          allCustomers.push({
            ...pastCustomer,
            isPastClient: true
          });
        }
      });

      setCustomerSearchResults(allCustomers);
      setShowCustomerSearch(allCustomers.length > 0);
    } catch (error) {
      console.error('Error searching customers:', error);
    }
  };

  const handleClientNameChange = (value: string) => {
    setFormData({ ...formData, clientName: value });
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set new timeout for auto-search with debouncing
    const newTimeout = setTimeout(() => {
      if (value.length >= 2) {
        searchCustomers(value);
      } else {
        setCustomerSearchResults([]);
        setShowCustomerSearch(false);
      }
    }, 300); // 300ms debounce

    setSearchTimeout(newTimeout);
  };

  const selectCustomer = (customer: any) => {
    setFormData({
      ...formData,
      clientName: customer.full_name || '',
      clientEmail: customer.email || ''
    });
    setShowCustomerSearch(false);
    setCustomerSearchResults([]);
    
    toast({
      title: "Customer Selected",
      description: `Auto-filled information for ${customer.full_name}`,
    });
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const serviceCategories = [
    "Kitchen Renovation", "Bathroom Remodel", "Flooring", "Roofing", 
    "Electrical", "Plumbing", "Painting", "Deck Construction", 
    "Basement Finishing", "HVAC", "Windows & Doors", "Other"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-primary" />
            <span>{mode === 'edit' ? 'Edit Quote' : 'Create Professional Quote'}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Mobile: Scrollable horizontal tabs */}
            <div className="sm:hidden mb-4">
              <div className="flex overflow-x-auto pb-2 space-x-1 scrollbar-hide">
                <TabsList className="flex h-auto p-0.5 bg-muted rounded-lg min-w-max">
                  <TabsTrigger value="details" className="text-xs px-3 py-2 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="items" className="text-xs px-3 py-2 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Line Items
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="text-xs px-3 py-2 rounded-md whitespace-nowrap data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    Summary
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden sm:block">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="items">Line Items</TabsTrigger>
                <TabsTrigger value="summary">Summary & Send</TabsTrigger>
              </TabsList>
            </div>

            {/* Project Details Tab */}
            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectTitle">Project Title *</Label>
                  <Input
                    id="projectTitle"
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
                    placeholder="Kitchen Renovation - Smith Residence"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="serviceCategory">Service Category</Label>
                  <Select
                    value={formData.serviceCategory}
                    onValueChange={(value) => setFormData({...formData, serviceCategory: value})}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <div className="flex gap-2 mt-1">
                    <div className="relative flex-1">
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleClientNameChange(e.target.value)}
                        placeholder="Start typing customer name..."
                        className="pr-10"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowCustomerSearch(!showCustomerSearch);
                        if (!showCustomerSearch && formData.clientName) {
                          searchCustomers(formData.clientName);
                        }
                      }}
                      className="px-3"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {showCustomerSearch && customerSearchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2 border-b bg-gray-50">
                        <div className="text-xs text-gray-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {customerSearchResults.length} customer{customerSearchResults.length !== 1 ? 's' : ''} found
                        </div>
                      </div>
                      {customerSearchResults.map((customer) => (
                        <div
                          key={customer.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                          onClick={() => selectCustomer(customer)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{customer.full_name}</div>
                              <div className="text-sm text-gray-500">{customer.email}</div>
                              {customer.phone && (
                                <div className="text-xs text-gray-400">{customer.phone}</div>
                              )}
                            </div>
                            {customer.isPastClient && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Past Client
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="clientEmail">Client Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                    placeholder="john@email.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Detailed description of the work to be performed"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="laborRate">Default Labor Rate ($/hour)</Label>
                  <Input
                    id="laborRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.laborRate}
                    onChange={(e) => setFormData({...formData, laborRate: parseFloat(e.target.value) || 0})}
                    placeholder="50"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="overhead">Overhead (%)</Label>
                  <Input
                    id="overhead"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.overhead}
                    onChange={(e) => setFormData({...formData, overhead: parseFloat(e.target.value) || 0})}
                    placeholder="15"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="profitMargin">Profit Margin (%)</Label>
                  <Input
                    id="profitMargin"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.profitMargin}
                    onChange={(e) => setFormData({...formData, profitMargin: parseFloat(e.target.value) || 0})}
                    placeholder="20"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="travelFee">Travel Fee ($)</Label>
                  <Input
                    id="travelFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.travelFee}
                    onChange={(e) => setFormData({...formData, travelFee: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="validDays">Quote Valid (Days)</Label>
                  <Input
                    id="validDays"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.validDays}
                    onChange={(e) => setFormData({...formData, validDays: parseInt(e.target.value) || 30})}
                    placeholder="30"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="availabilityNote">Availability Notes</Label>
                <Textarea
                  id="availabilityNote"
                  value={formData.availabilityNote}
                  onChange={(e) => setFormData({...formData, availabilityNote: e.target.value})}
                  placeholder="When can you start? Any scheduling constraints?"
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="flex flex-wrap gap-6 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.materialsIncluded}
                    onCheckedChange={(checked) => setFormData({...formData, materialsIncluded: checked})}
                  />
                  <Label>Materials included in price</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isUrgent}
                    onCheckedChange={(checked) => setFormData({...formData, isUrgent: checked})}
                  />
                  <Label>Urgent Project (+25%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isAfterHours}
                    onCheckedChange={(checked) => setFormData({...formData, isAfterHours: checked})}
                  />
                  <Label>After Hours Work (+50%)</Label>
                </div>
              </div>
            </TabsContent>

            {/* Line Items Tab */}
            <TabsContent value="items" className="space-y-6 mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Quote Line Items
                </h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calculator className="w-4 h-4" />
                  <span>Subtotal: ${calculations.subtotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Existing Line Items */}
              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <Card key={item.id || index} className="relative">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start">
                        <div className="space-y-2">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={item.item_type}
                            onValueChange={(value) => updateLineItem(index, 'item_type', value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="material">Material</SelectItem>
                              <SelectItem value="labor">Labor</SelectItem>
                              <SelectItem value="service">Service</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                            placeholder="Item description"
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Qty & Unit</Label>
                          <div className="flex space-x-1">
                            <Input
                              type="number"
                              step="0.1"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                              className="h-8 w-16"
                            />
                            <Input
                              value={item.unit_measure}
                              onChange={(e) => updateLineItem(index, 'unit_measure', e.target.value)}
                              placeholder="unit"
                              className="h-8 w-16"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Unit Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="h-8"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs">Total</Label>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-green-600">
                              ${item.total_price.toLocaleString()}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeLineItem(index)}
                              className="h-6 w-6 p-0 ml-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mt-3 pt-3 border-t">
                        <Label className="text-xs">Notes</Label>
                        <Textarea
                          value={item.notes || ''}
                          onChange={(e) => updateLineItem(index, 'notes', e.target.value)}
                          placeholder="Optional notes for this item..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Add New Item Form */}
              <Card className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Line Item
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="space-y-2">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={newItem.item_type}
                        onValueChange={(value: any) => setNewItem({ ...newItem, item_type: value })}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="material">Material</SelectItem>
                          <SelectItem value="labor">Labor</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Item description"
                        className="h-8"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Qty & Unit</Label>
                      <div className="flex space-x-1">
                        <Input
                          type="number"
                          step="0.1"
                          value={newItem.quantity}
                          onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                          className="h-8 w-16"
                        />
                        <Input
                          value={newItem.unit_measure}
                          onChange={(e) => setNewItem({ ...newItem, unit_measure: e.target.value })}
                          placeholder="unit"
                          className="h-8 w-16"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Unit Price</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newItem.unit_price}
                        onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                        className="h-8"
                      />
                    </div>

                    <Button
                      onClick={addLineItem}
                      disabled={!newItem.description.trim()}
                      className="h-8"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {newItem.description && (
                    <div className="mt-3">
                      <Label className="text-xs">Notes (Optional)</Label>
                      <Textarea
                        value={newItem.notes || ''}
                        onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                        placeholder="Optional notes for this item..."
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Line Items Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Materials:</span>
                      <span className="font-medium">${calculations.materialTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor:</span>
                      <span className="font-medium">${calculations.laborTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Services:</span>
                      <span className="font-medium">${calculations.serviceTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other:</span>
                      <span className="font-medium">${calculations.otherTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t mt-3 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {lineItems.length} item{lineItems.length !== 1 ? 's' : ''}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        Subtotal: ${calculations.subtotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Summary Tab */}
            <TabsContent value="summary" className="space-y-6 mt-6">
              <Card className="bg-muted/50 border-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Quote Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Materials Cost:</span>
                      <span className="font-medium">${calculations.materialTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor Cost:</span>
                      <span className="font-medium">${calculations.laborTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Services Cost:</span>
                      <span className="font-medium">${calculations.serviceTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Other Costs:</span>
                      <span className="font-medium">${calculations.otherTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overhead ({formData.overhead}%):</span>
                      <span className="font-medium">${calculations.overheadAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Profit ({formData.profitMargin}%):</span>
                      <span className="font-medium">${calculations.profitAmount.toFixed(2)}</span>
                    </div>
                    {calculations.urgencyFee > 0 && (
                      <div className="flex justify-between col-span-2">
                        <span>Special Fees:</span>
                        <span className="font-medium">${calculations.urgencyFee.toFixed(2)}</span>
                      </div>
                    )}
                    {calculations.travelFeeAmount > 0 && (
                      <div className="flex justify-between col-span-2">
                        <span>Travel Fee:</span>
                        <span className="font-medium">${calculations.travelFeeAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Quote:</span>
                      <Badge className="text-lg px-4 py-2 bg-green-600 hover:bg-green-700">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {calculations.total.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                <Button
                  onClick={handleSave}
                  variant="outline"
                  disabled={loading || !formData.projectTitle || !formData.clientName}
                  className="w-full sm:flex-1 h-12 text-base font-medium"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={loading || !formData.clientEmail || !formData.projectTitle || !formData.clientName}
                  className="w-full sm:flex-1 h-12 text-base font-medium"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Quote
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
