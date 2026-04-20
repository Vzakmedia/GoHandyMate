import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Building2, Phone, Mail, Globe, Calendar, Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
// Import the QuoteLineItem interface from the integrated editor
interface QuoteLineItem {
  id?: string;
  item_type: 'material' | 'labor' | 'service' | 'other';
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit_measure: string;
  notes?: string;
}

interface QuoteData {
  id: string;
  quote_number?: string;
  quoted_price: number;
  description: string;
  estimated_hours?: number;
  materials_cost?: number;
  travel_fee?: number;
  valid_until?: string;
  created_at: string;
  status: string;
  notes?: string;
  payment_terms?: string;
  terms_conditions?: string;
  quote_request_id: string;
  customer_id: string;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface BusinessSettings {
  business_name: string;
  business_logo_url?: string;
  business_address?: string;
  business_phone?: string;
  business_email?: string;
  business_website?: string;
  license_number?: string;
  insurance_number?: string;
  tax_id?: string;
  payment_terms: string;
  terms_conditions: string;
  quote_footer: string;
}

interface ProfessionalQuoteViewProps {
  quote: QuoteData;
  businessSettings: BusinessSettings;
  customerInfo?: {
    full_name: string;
    email: string;
    phone?: string;
    avatar_url?: string;
  };
}

export const ProfessionalQuoteView: React.FC<ProfessionalQuoteViewProps> = ({
  quote,
  businessSettings,
  customerInfo,
}) => {
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const quoteNumber = quote.quote_number || `Q-${quote.id.slice(0, 8).toUpperCase()}`;

  // Load line items
  useEffect(() => {
    const loadLineItems = async () => {
      if (!quote?.id) return;

      const { data: items } = await supabase
        .from('quote_line_items')
        .select('*')
        .eq('quote_submission_id', quote.id)
        .order('created_at');

      if (items) {
        setLineItems(items.map(item => ({
          ...item,
          item_type: item.item_type as 'material' | 'labor' | 'service' | 'other',
          unit_measure: item.unit_measure || 'each',
          notes: item.notes || '',
          total_price: item.quantity * item.unit_price
        })));
      }
    };

    loadLineItems();
  }, [quote?.id]);

  const lineItemsTotal = lineItems.reduce((sum, item) => sum + item.total_price, 0);
  const total = lineItemsTotal + (quote.travel_fee || 0);

  return (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header with Business Info */}
      <div className="border-b-2 border-primary pb-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={businessSettings.business_logo_url} alt="Business Logo" />
              <AvatarFallback>
                <Building2 className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {businessSettings.business_name}
              </h1>
              {businessSettings.business_address && (
                <p className="text-muted-foreground mt-1">
                  {businessSettings.business_address}
                </p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-sm">
                {businessSettings.business_phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{businessSettings.business_phone}</span>
                  </div>
                )}
                {businessSettings.business_email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4" />
                    <span>{businessSettings.business_email}</span>
                  </div>
                )}
                {businessSettings.business_website && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span>{businessSettings.business_website}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-primary">QUOTE</h2>
            <p className="text-lg font-semibold">{quoteNumber}</p>
            <Badge variant={quote.status === 'pending' ? 'default' : 'secondary'}>
              {quote.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quote and Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Quote Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Quote Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quote Number:</span>
                <span className="font-medium">{quoteNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{format(new Date(quote.created_at), 'MMM dd, yyyy')}</span>
              </div>
              {quote.valid_until && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until:</span>
                  <span>{format(new Date(quote.valid_until), 'MMM dd, yyyy')}</span>
                </div>
              )}
              {quote.estimated_hours && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Hours:</span>
                  <span>{quote.estimated_hours} hours</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Bill To:</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={customerInfo?.avatar_url} alt="Customer" />
                  <AvatarFallback>
                    {customerInfo?.full_name?.split(' ').map(n => n[0]).join('') || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {customerInfo?.full_name || quote.profiles?.full_name || 'Customer'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customerInfo?.email || quote.profiles?.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Description */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Service Description</h3>
          <p className="text-sm leading-relaxed">{quote.description}</p>
          {quote.notes && (
            <div className="mt-3 p-3 bg-muted rounded">
              <p className="text-sm"><strong>Notes:</strong> {quote.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Breakdown */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Quote Breakdown</h3>
          {lineItems.length > 0 ? (
            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div key={item.id || index} className="flex justify-between items-center py-2 border-b">
                  <div className="flex-1">
                    <span className="font-medium">{item.description}</span>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} {item.unit_measure} × ${item.unit_price.toFixed(2)}
                      {item.notes && (
                        <span className="block text-xs mt-1">{item.notes}</span>
                      )}
                    </div>
                  </div>
                  <span className="font-medium">${item.total_price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span>Quote Amount</span>
                <span className="font-medium">${quote.quoted_price.toLocaleString()}</span>
              </div>
              {quote.materials_cost && quote.materials_cost > 0 && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Materials</span>
                  <span className="font-medium">${quote.materials_cost.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
          
          {quote.travel_fee && quote.travel_fee > 0 && (
            <div className="flex justify-between items-center py-2 border-b mt-4">
              <span>Travel Fee</span>
              <span className="font-medium">${quote.travel_fee.toLocaleString()}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center py-2 border-t-2 border-primary mt-4">
            <span className="text-lg font-bold">Total</span>
            <span className="text-lg font-bold text-primary">${total.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Terms & Conditions</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong>Payment Terms:</strong>
              <p className="mt-1">{quote.payment_terms || businessSettings.payment_terms}</p>
            </div>
            {(quote.terms_conditions || businessSettings.terms_conditions) && (
              <div>
                <strong>Terms & Conditions:</strong>
                <p className="mt-1 leading-relaxed">
                  {quote.terms_conditions || businessSettings.terms_conditions}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Business Credentials */}
      {(businessSettings.license_number || businessSettings.insurance_number || businessSettings.tax_id) && (
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-center space-x-8 text-xs text-muted-foreground">
            {businessSettings.license_number && (
              <span>License: {businessSettings.license_number}</span>
            )}
            {businessSettings.insurance_number && (
              <span>Insurance: {businessSettings.insurance_number}</span>
            )}
            {businessSettings.tax_id && (
              <span>Tax ID: {businessSettings.tax_id}</span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4 border-t">
        <p className="text-lg font-medium text-primary">
          {businessSettings.quote_footer}
        </p>
      </div>
    </div>
  );
};