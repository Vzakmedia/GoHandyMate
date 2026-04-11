
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, DollarSign, Clock, X } from 'lucide-react';
import { useCustomQuotes } from '@/hooks/useCustomQuotes';

interface CustomQuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceName?: string;
}

// Service categories for suggestions
const serviceCategories = [
  'Plumbing',
  'Electrical',
  'Painting',
  'Carpentry',
  'HVAC',
  'Cleaning Services',
  'Furniture Assembly', 
  'Smart Home Installation',
  'Flooring',
  'Roofing',
  'Landscaping',
  'General Maintenance',
  'Kitchen Renovation',
  'Bathroom Renovation',
  'Drywall Repair',
  'Tile Installation',
  'Appliance Installation',
  'Window Installation',
  'Door Installation',
  'Deck Construction',
  'Fence Installation',
  'Gutter Cleaning',
  'Power Washing',
  'Moving Services',
  'Handyman Services'
];

export const CustomQuoteRequestModal = ({ 
  isOpen, 
  onClose, 
  initialServiceName = '' 
}: CustomQuoteRequestModalProps) => {
  const { createQuoteRequest } = useCustomQuotes();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    service_name: initialServiceName,
    service_description: '',
    location: '',
    preferred_date: '',
    budget_range: '',
    urgency: 'flexible',
    quote_type: 'public'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Handle service name suggestions
    if (field === 'service_name') {
      if (value.length > 0) {
        const filtered = serviceCategories.filter(category =>
          category.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(false);
        setFilteredSuggestions([]);
      }
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setFormData(prev => ({ ...prev, service_name: suggestion }));
    setShowSuggestions(false);
    setFilteredSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createQuoteRequest({
        service_name: formData.service_name,
        service_description: formData.service_description,
        location: formData.location,
        preferred_date: formData.preferred_date || undefined,
        budget_range: formData.budget_range || undefined,
        urgency: formData.urgency,
        quote_type: formData.quote_type
      });

      onClose();
      setFormData({
        service_name: '',
        service_description: '',
        location: '',
        preferred_date: '',
        budget_range: '',
        urgency: 'flexible',
        quote_type: 'public'
      });
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Request Custom Quote</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="relative">
            <Label htmlFor="service_name">Service Needed *</Label>
            <Input
              id="service_name"
              value={formData.service_name}
              onChange={(e) => handleInputChange('service_name', e.target.value)}
              onFocus={() => {
                if (formData.service_name.length > 0) {
                  const filtered = serviceCategories.filter(category =>
                    category.toLowerCase().includes(formData.service_name.toLowerCase())
                  );
                  setFilteredSuggestions(filtered);
                  setShowSuggestions(filtered.length > 0);
                }
              }}
              onBlur={() => {
                // Delay hiding suggestions to allow for selection
                setTimeout(() => setShowSuggestions(false), 150);
              }}
              placeholder="e.g., Kitchen Cabinet Installation"
              required
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="service_description">Detailed Description *</Label>
            <Textarea
              id="service_description"
              value={formData.service_description}
              onChange={(e) => handleInputChange('service_description', e.target.value)}
              placeholder="Please describe your project in detail, including any specific requirements, materials, or preferences..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Service Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter full address or zip code"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="preferred_date">Preferred Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="preferred_date"
                  type="date"
                  value={formData.preferred_date}
                  onChange={(e) => handleInputChange('preferred_date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="budget_range">Budget Range</Label>
              <Input
                id="budget_range"
                value={formData.budget_range}
                onChange={(e) => handleInputChange('budget_range', e.target.value)}
                placeholder="e.g., $500-$1000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="urgency">Urgency Level</Label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => handleInputChange('urgency', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible (Standard Rate)</SelectItem>
                <SelectItem value="same_day">Same Day (+50%)</SelectItem>
                <SelectItem value="emergency">Emergency (+100%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Quote Request Type</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <Button
                  type="button"
                  variant={formData.quote_type === 'public' ? 'default' : 'outline'}
                  onClick={() => handleInputChange('quote_type', 'public')}
                  className="h-auto p-4 flex flex-col items-start text-left"
                >
                  <div className="font-medium mb-1">Public Job Feed</div>
                  <div className="text-sm text-muted-foreground">
                    Post to contractor job board for all qualified contractors to see
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={formData.quote_type === 'direct' ? 'default' : 'outline'}
                  onClick={() => handleInputChange('quote_type', 'direct')}
                  className="h-auto p-4 flex flex-col items-start text-left"
                >
                  <div className="font-medium mb-1">Direct to Contractor</div>
                  <div className="text-sm text-muted-foreground">
                    Send directly to specific contractors in your area
                  </div>
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                How it works
              </h4>
              {formData.quote_type === 'public' ? (
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your request will be posted in the contractor job feed</li>
                  <li>• All qualified contractors in your area can see and bid</li>
                  <li>• You'll receive multiple competitive quotes within 24-48 hours</li>
                  <li>• Compare proposals and choose the best contractor for your project</li>
                </ul>
              ) : (
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Your request will be sent directly to specific contractors</li>
                  <li>• Contractors will receive a private quote invitation</li>
                  <li>• You'll receive personalized quotes from selected professionals</li>
                  <li>• More privacy and targeted responses for your project</li>
                </ul>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Request Quotes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
