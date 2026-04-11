import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Clock, DollarSign, User, Calendar, Check, X } from 'lucide-react';
import { useContractorQuotes, type ContractorQuoteRequest } from '@/hooks/useContractorQuotes';
import { useAuth } from '@/features/auth';
import { toast } from 'sonner';

interface ContractorQuoteResponseCardProps {
  request: ContractorQuoteRequest;
}

export const ContractorQuoteResponseCard = ({ request }: ContractorQuoteResponseCardProps) => {
  const { user } = useAuth();
  const { submitQuote } = useContractorQuotes();
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    quoted_price: request.budget_range ? request.budget_range.replace(/[^\d.-]/g, '') : '',
    description: '',
    estimated_hours: '',
    materials_included: false,
    availability_note: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitQuote = async () => {
    if (!user || !formData.quoted_price || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitQuote({
        quote_request_id: request.id,
        customer_id: user.id,
        quoted_price: parseFloat(formData.quoted_price),
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        description: formData.description,
        materials_included: formData.materials_included,
        materials_cost: 0,
        travel_fee: 0,
        availability_note: formData.availability_note || undefined
      });

      setShowQuoteForm(false);
      setFormData({
        quoted_price: '',
        description: '',
        estimated_hours: '',
        materials_included: false,
        availability_note: ''
      });
      toast.success('Quote submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptPrice = async () => {
    if (!user) return;

    const suggestedPrice = request.budget_range ? request.budget_range.replace(/[^\d.-]/g, '') : '0';
    
    setIsSubmitting(true);
    try {
      await submitQuote({
        quote_request_id: request.id,
        customer_id: user.id,
        quoted_price: parseFloat(suggestedPrice),
        description: `I accept your budget of ${request.budget_range} for ${request.service_name}. I'm ready to start as soon as possible.`,
        materials_included: false,
        materials_cost: 0,
        travel_fee: 0,
        availability_note: 'Available immediately'
      });

      toast.success('Quote accepted and submitted!');
    } catch (error) {
      toast.error('Failed to accept quote');
    } finally {
      setIsSubmitting(false);
    }
  };

  const urgencyColor = request.urgency === 'emergency' ? 'destructive' : 
                      request.urgency === 'same_day' ? 'default' : 'secondary';

  return (
    <Card className="transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-blue-600 mb-2">
              {request.service_name}
            </CardTitle>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>From: {request.profiles?.full_name || 'Contractor'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{request.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(request.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={urgencyColor}>
              {request.urgency === 'emergency' ? 'Emergency' :
               request.urgency === 'same_day' ? 'Same Day' : 'Flexible'}
            </Badge>
            {request.budget_range && (
              <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                <DollarSign className="w-4 h-4" />
                <span>{request.budget_range}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-gray-700">{request.service_description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {request.preferred_date && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Preferred: {new Date(request.preferred_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {!showQuoteForm && request.status === 'pending' && (
          <div className="flex space-x-3 pt-4">
            {request.budget_range && (
              <Button 
                onClick={handleAcceptPrice}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : `Accept ${request.budget_range}`}
              </Button>
            )}
            <Button 
              onClick={() => setShowQuoteForm(true)}
              variant="outline"
              className="flex-1"
            >
              Custom Quote
            </Button>
          </div>
        )}

        {showQuoteForm && (
          <div className="space-y-4 pt-4 border-t">
            <h4 className="font-semibold text-gray-800">Submit Your Quote</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quoted_price">Your Price ($) *</Label>
                <Input
                  id="quoted_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.quoted_price}
                  onChange={(e) => handleInputChange('quoted_price', e.target.value)}
                  placeholder="150.00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="estimated_hours">Estimated Hours</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.estimated_hours}
                  onChange={(e) => handleInputChange('estimated_hours', e.target.value)}
                  placeholder="4.5"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Work Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe how you'll approach this project..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="availability_note">Availability</Label>
              <Textarea
                id="availability_note"
                value={formData.availability_note}
                onChange={(e) => handleInputChange('availability_note', e.target.value)}
                placeholder="When can you start? Any scheduling preferences..."
                rows={2}
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowQuoteForm(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmitQuote}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quote'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};