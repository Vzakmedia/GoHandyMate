import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Clock, X, FileText, Wrench } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuoteRequest {
  id: string;
  service_name: string;
  service_description: string;
  location: string;
  preferred_date: string | null;
  budget_range: string | null;
  urgency: string;
  customer_id: string;
  status: string;
}

interface QuoteSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteRequest: QuoteRequest;
  onQuoteSubmitted?: () => void;
}

export const QuoteSubmissionModal = ({ 
  isOpen, 
  onClose, 
  quoteRequest,
  onQuoteSubmitted 
}: QuoteSubmissionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    quoted_price: '',
    description: '',
    estimated_hours: '',
    materials_included: false,
    materials_cost: '',
    travel_fee: '',
    availability_note: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('quote-operations', {
        body: {
          action: 'submit_quote',
          quote_request_id: quoteRequest.id,
          handyman_id: user.id,
          quoted_price: parseFloat(formData.quoted_price),
          description: formData.description,
          estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
          materials_included: formData.materials_included,
          materials_cost: formData.materials_cost ? parseFloat(formData.materials_cost) : null,
          travel_fee: formData.travel_fee ? parseFloat(formData.travel_fee) : null,
          availability_note: formData.availability_note || null
        }
      });

      if (response.error) throw response.error;

      toast({
        title: "Quote Submitted Successfully",
        description: "Your quote has been sent to the customer."
      });

      onClose();
      onQuoteSubmitted?.();
      
      // Reset form
      setFormData({
        quoted_price: '',
        description: '',
        estimated_hours: '',
        materials_included: false,
        materials_cost: '',
        travel_fee: '',
        availability_note: ''
      });
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit quote",
        variant: "destructive"
      });
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
              <span>Submit Quote</span>
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Quote Request Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">{quoteRequest.service_name}</h3>
          <p className="text-sm text-gray-600 mb-2">{quoteRequest.service_description}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {quoteRequest.location}
            </span>
            {quoteRequest.budget_range && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                Budget: {quoteRequest.budget_range}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quoted_price">Quoted Price * (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="quoted_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.quoted_price}
                  onChange={(e) => handleInputChange('quoted_price', e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="estimated_hours">Estimated Hours</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="estimated_hours"
                  type="number"
                  step="0.5"
                  min="0"
                  value={formData.estimated_hours}
                  onChange={(e) => handleInputChange('estimated_hours', e.target.value)}
                  placeholder="8.0"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Quote Details *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what's included in your quote, your approach, timeline, etc..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="materials_included"
                checked={formData.materials_included}
                onCheckedChange={(checked) => handleInputChange('materials_included', checked)}
              />
              <Label htmlFor="materials_included" className="text-sm">
                Materials included in quote
              </Label>
            </div>

            {formData.materials_included && (
              <div>
                <Label htmlFor="materials_cost">Materials Cost (USD)</Label>
                <div className="relative">
                  <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="materials_cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.materials_cost}
                    onChange={(e) => handleInputChange('materials_cost', e.target.value)}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="travel_fee">Travel Fee (USD)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="travel_fee"
                type="number"
                step="0.01"
                min="0"
                value={formData.travel_fee}
                onChange={(e) => handleInputChange('travel_fee', e.target.value)}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="availability_note">Availability Note</Label>
            <Textarea
              id="availability_note"
              value={formData.availability_note}
              onChange={(e) => handleInputChange('availability_note', e.target.value)}
              placeholder="When can you start? Any scheduling constraints?"
              rows={2}
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Quote Summary
            </h4>
            <div className="text-sm text-green-700 space-y-1">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>${formData.quoted_price || '0.00'}</span>
              </div>
              {formData.materials_included && formData.materials_cost && (
                <div className="flex justify-between">
                  <span>Materials:</span>
                  <span>${formData.materials_cost}</span>
                </div>
              )}
              {formData.travel_fee && (
                <div className="flex justify-between">
                  <span>Travel Fee:</span>
                  <span>${formData.travel_fee}</span>
                </div>
              )}
              <hr className="border-green-200" />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>
                  ${(
                    parseFloat(formData.quoted_price || '0') +
                    (formData.materials_included ? parseFloat(formData.materials_cost || '0') : 0) +
                    parseFloat(formData.travel_fee || '0')
                  ).toFixed(2)}
                </span>
              </div>
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
              {isSubmitting ? 'Submitting...' : 'Submit Quote'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};