import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { operation, quoteId } = await req.json();
    console.log(`Quote operation: ${operation}`, { quoteId });

    if (operation === 'generate_pdf') {
      return await generateQuotePDF(supabase, quoteId);
    } else if (operation === 'send_quote') {
      return await sendQuoteEmail(supabase, quoteId);
    } else {
      throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    console.error('Error in quote-operations function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function generateQuotePDF(supabase: any, quoteId: string) {
  console.log('Generating PDF for quote:', quoteId);

  // Get quote data with business settings and customer info
  const { data: quote, error: quoteError } = await supabase
    .from('contractor_quote_submissions')
    .select(`
      *,
      contractor_quote_requests (
        service_name,
        service_description,
        location,
        customer_id,
        profiles!contractor_quote_requests_customer_id_fkey (
          full_name,
          email,
          avatar_url
        )
      )
    `)
    .eq('id', quoteId)
    .single();

  if (quoteError || !quote) {
    console.error('Quote not found:', quoteError);
    throw new Error('Quote not found: ' + quoteError?.message);
  }

  // Get business settings for the quote creator
  const { data: businessSettings } = await supabase
    .from('business_settings')
    .select('*')
    .eq('user_id', quote.customer_id)
    .single();

  console.log('Quote data retrieved, generating PDF...');

  // Generate PDF HTML content
  const htmlContent = generateQuoteHTML(quote, businessSettings, quote.contractor_quote_requests?.profiles);

  // For now, return the HTML content as a downloadable file
  // In a production environment, you'd use a PDF generation service
  const blob = new Blob([htmlContent], { type: 'text/html' });
  
  return new Response(blob, {
    headers: {
      ...corsHeaders,
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="quote-${quote.quote_number || quoteId}.html"`,
    },
  });
}

async function sendQuoteEmail(supabase: any, quoteId: string) {
  console.log('Sending quote email for:', quoteId);

  // Get quote data
  const { data: quote, error: quoteError } = await supabase
    .from('contractor_quote_submissions')
    .select(`
      *,
      contractor_quote_requests (
        service_name,
        service_description,
        location,
        customer_id,
        profiles!contractor_quote_requests_customer_id_fkey (
          full_name,
          email
        )
      )
    `)
    .eq('id', quoteId)
    .single();

  if (quoteError || !quote) {
    console.error('Quote not found:', quoteError);
    throw new Error('Quote not found: ' + quoteError?.message);
  }

  // Get business settings
  const { data: businessSettings } = await supabase
    .from('business_settings')
    .select('*')
    .eq('user_id', quote.customer_id)
    .single();

  // Update quote status to sent
  await supabase
    .from('contractor_quote_submissions')
    .update({ status: 'sent' })
    .eq('id', quoteId);

  console.log('Quote marked as sent');

  // In a production environment, you'd integrate with an email service like Resend
  // For now, we'll just return success
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Quote sent successfully',
      customer_email: quote.contractor_quote_requests?.profiles?.email
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
}

function generateQuoteHTML(quote: any, businessSettings: any, customerInfo: any) {
  const quoteNumber = quote.quote_number || `Q-${quote.id.slice(0, 8).toUpperCase()}`;
  const subtotal = (quote.materials_cost || 0) + quote.quoted_price;
  const total = subtotal + (quote.travel_fee || 0);

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Quote ${quoteNumber}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
            .business-info { display: flex; align-items: center; margin-bottom: 20px; }
            .logo { width: 60px; height: 60px; margin-right: 20px; }
            .business-name { font-size: 28px; font-weight: bold; color: #2563eb; }
            .quote-number { font-size: 24px; font-weight: bold; text-align: right; }
            .section { margin: 20px 0; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
            .card { border: 1px solid #e5e5e5; padding: 20px; border-radius: 8px; }
            .breakdown { margin: 20px 0; }
            .breakdown-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
            .total { font-size: 18px; font-weight: bold; border-top: 2px solid #2563eb; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; }
        </style>
    </head>
    <body>
        <div class="header">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div class="business-info">
                    <div>
                        <div class="business-name">${businessSettings?.business_name || 'Professional Services'}</div>
                        <div>${businessSettings?.business_address || ''}</div>
                        <div>${businessSettings?.business_phone || ''} | ${businessSettings?.business_email || ''}</div>
                    </div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: bold;">QUOTE</div>
                    <div class="quote-number">${quoteNumber}</div>
                    <div>Status: ${quote.status}</div>
                </div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h3>Quote Details</h3>
                <div><strong>Quote Number:</strong> ${quoteNumber}</div>
                <div><strong>Created:</strong> ${new Date(quote.created_at).toLocaleDateString()}</div>
                ${quote.valid_until ? `<div><strong>Valid Until:</strong> ${new Date(quote.valid_until).toLocaleDateString()}</div>` : ''}
                ${quote.estimated_hours ? `<div><strong>Estimated Hours:</strong> ${quote.estimated_hours} hours</div>` : ''}
            </div>

            <div class="card">
                <h3>Bill To:</h3>
                <div><strong>${customerInfo?.full_name || 'Customer'}</strong></div>
                <div>${customerInfo?.email || ''}</div>
            </div>
        </div>

        <div class="section">
            <div class="card">
                <h3>Service Description</h3>
                <p>${quote.description}</p>
                ${quote.notes ? `<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 15px;"><strong>Notes:</strong> ${quote.notes}</div>` : ''}
            </div>
        </div>

        <div class="breakdown">
            <div class="card">
                <h3>Quote Breakdown</h3>
                <div class="breakdown-item">
                    <span>Labor</span>
                    <span>$${quote.quoted_price.toLocaleString()}</span>
                </div>
                ${quote.materials_cost && quote.materials_cost > 0 ? `
                <div class="breakdown-item">
                    <span>Materials</span>
                    <span>$${quote.materials_cost.toLocaleString()}</span>
                </div>
                ` : ''}
                ${quote.travel_fee && quote.travel_fee > 0 ? `
                <div class="breakdown-item">
                    <span>Travel Fee</span>
                    <span>$${quote.travel_fee.toLocaleString()}</span>
                </div>
                ` : ''}
                <div class="breakdown-item total">
                    <span>Total</span>
                    <span>$${total.toLocaleString()}</span>
                </div>
            </div>
        </div>

        <div class="section">
            <div class="card">
                <h3>Terms & Conditions</h3>
                <div><strong>Payment Terms:</strong> ${quote.payment_terms || businessSettings?.payment_terms || 'Net 30'}</div>
                <div style="margin-top: 15px;">
                    <strong>Terms & Conditions:</strong>
                    <p>${quote.terms_conditions || businessSettings?.terms_conditions || 'Payment is due within 30 days of invoice date.'}</p>
                </div>
            </div>
        </div>

        ${businessSettings?.license_number || businessSettings?.insurance_number ? `
        <div style="text-align: center; margin: 30px 0; font-size: 12px; color: #666;">
            ${businessSettings?.license_number ? `License: ${businessSettings.license_number}` : ''}
            ${businessSettings?.insurance_number ? ` | Insurance: ${businessSettings.insurance_number}` : ''}
            ${businessSettings?.tax_id ? ` | Tax ID: ${businessSettings.tax_id}` : ''}
        </div>
        ` : ''}

        <div class="footer">
            <div style="font-size: 18px; font-weight: bold; color: #2563eb;">
                ${businessSettings?.quote_footer || 'Thank you for your business!'}
            </div>
        </div>
    </body>
    </html>
  `;
}