import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Download,
  Send,
  Edit
} from 'lucide-react';
import { ProfessionalQuoteView } from './ProfessionalQuoteView';
import { useBusinessSettings } from '@/hooks/useBusinessSettings';

interface QuoteViewModalProps {
  quote: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onSend: () => void;
}

export const QuoteViewModal = ({ 
  quote, 
  isOpen, 
  onClose, 
  onEdit, 
  onDownload, 
  onSend 
}: QuoteViewModalProps) => {
  const { settings: businessSettings } = useBusinessSettings();

  if (!quote) return null;

  // Transform quote data to match ProfessionalQuoteView interface
  const quoteData = {
    id: quote.id,
    quote_number: quote.quote_number,
    quoted_price: quote.quoted_price || 0,
    description: quote.description || '',
    estimated_hours: quote.estimated_hours,
    materials_cost: quote.materials_cost,
    travel_fee: quote.travel_fee,
    valid_until: quote.valid_until,
    created_at: quote.created_at,
    status: quote.status,
    notes: quote.notes,
    payment_terms: quote.payment_terms,
    terms_conditions: quote.terms_conditions,
    quote_request_id: quote.quote_request_id || quote.id,
    customer_id: quote.customer_id,
    profiles: quote.profiles
  };

  const customerInfo = {
    full_name: quote.profiles?.full_name || 'Customer',
    email: quote.profiles?.email || '',
    phone: quote.profiles?.phone,
    avatar_url: quote.profiles?.avatar_url
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Professional Quote</DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-0">
          {businessSettings && (
            <ProfessionalQuoteView
              quote={quoteData}
              businessSettings={businessSettings}
              customerInfo={customerInfo}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-6 border-t mt-6">
            <Button onClick={onEdit} variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Edit Quote
            </Button>
            <Button onClick={onDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            {quote.status === 'pending' && (
              <Button onClick={onSend}>
                <Send className="w-4 h-4 mr-2" />
                Send to Customer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};