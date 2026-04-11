import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddressInput } from '@/components/ui/address-input';
import { useContractorQuotes } from '@/hooks/useContractorQuotes';
import { toast } from 'sonner';
import { Send, Search, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const ContractorQuoteRequestsSection = () => {
  const { createQuoteRequest } = useContractorQuotes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  
  const [formData, setFormData] = useState({
    service_name: '',
    service_description: '',
    location: '',
    preferred_date: '',
    budget_range: '',
    urgency: 'flexible'
  });

  const searchCustomers = async (query: string) => {
    if (!query.trim()) {
      setCustomers([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('user_role', 'customer')
        .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Failed to search customers');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }

    if (!formData.service_name || !formData.service_description || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await createQuoteRequest({
        customer_id: selectedCustomer,
        service_name: formData.service_name,
        service_description: formData.service_description,
        location: formData.location,
        preferred_date: formData.preferred_date || undefined,
        budget_range: formData.budget_range || undefined,
        urgency: formData.urgency,
        quote_type: 'direct'
      });

      // Reset form
      setFormData({
        service_name: '',
        service_description: '',
        location: '',
        preferred_date: '',
        budget_range: '',
        urgency: 'flexible'
      });
      setSelectedCustomer('');
      setCustomerSearch('');
      setCustomers([]);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="w-5 h-5 text-blue-600" />
          <span>Send Quote Request to Customer</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Search */}
          <div className="space-y-2">
            <Label htmlFor="customer-search">Select Customer *</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="customer-search"
                placeholder="Search customers by name or email..."
                value={customerSearch}
                onChange={(e) => {
                  setCustomerSearch(e.target.value);
                  searchCustomers(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            
            {customers.length > 0 && (
              <div className="border rounded-md max-h-40 overflow-y-auto">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                      selectedCustomer === customer.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => {
                      setSelectedCustomer(customer.id);
                      setCustomerSearch(customer.full_name || customer.email);
                      setCustomers([]);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-medium">{customer.full_name || 'No name'}</div>
                        <div className="text-sm text-gray-600">{customer.email}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="service_name">Service Type *</Label>
              <Input
                id="service_name"
                value={formData.service_name}
                onChange={(e) => handleInputChange('service_name', e.target.value)}
                placeholder="e.g., Plumbing, Electrical, Renovation"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <AddressInput
                value={formData.location}
                onChange={(value) => handleInputChange('location', value)}
                onAddressSelect={(details) => {
                  handleInputChange('location', details.formatted_address);
                }}
                placeholder="Start typing address..."
              />
            </div>
          </div>

          <div>
            <Label htmlFor="service_description">Service Description *</Label>
            <Textarea
              id="service_description"
              value={formData.service_description}
              onChange={(e) => handleInputChange('service_description', e.target.value)}
              placeholder="Describe the service you want to provide..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="preferred_date">Preferred Date</Label>
              <Input
                id="preferred_date"
                type="date"
                value={formData.preferred_date}
                onChange={(e) => handleInputChange('preferred_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="budget_range">Budget Range</Label>
              <Input
                id="budget_range"
                value={formData.budget_range}
                onChange={(e) => handleInputChange('budget_range', e.target.value)}
                placeholder="e.g., $200-500"
              />
            </div>

            <div>
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible</SelectItem>
                  <SelectItem value="same_day">Same Day</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? 'Sending...' : 'Send Quote Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};