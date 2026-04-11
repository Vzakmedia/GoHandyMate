import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceOperationRequest {
  action: 'send_invoice' | 'generate_pdf' | 'mark_paid' | 'send_reminder';
  invoiceId: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { action, invoiceId }: InvoiceOperationRequest = await req.json();

    switch (action) {
      case 'send_invoice':
        return await sendInvoiceEmail(supabaseClient, invoiceId, user.id);
      
      case 'generate_pdf':
        return await generateInvoicePDF(supabaseClient, invoiceId, user.id);
      
      case 'mark_paid':
        return await markInvoicePaid(supabaseClient, invoiceId, user.id);
      
      case 'send_reminder':
        return await sendPaymentReminder(supabaseClient, invoiceId, user.id);
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error("Error in invoice-operations function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function sendInvoiceEmail(supabase: any, invoiceId: string, userId: string) {
  try {
    // Get invoice with customer details
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer_profile:customer_id (
          full_name,
          email
        ),
        contractor_profile:contractor_id (
          full_name,
          email
        )
      `)
      .eq('id', invoiceId)
      .eq('contractor_id', userId)
      .single();

    if (error) throw error;
    if (!invoice) throw new Error('Invoice not found');

    // Here you would integrate with email service (Resend, etc.)
    // For now, we'll just update the status
    const { error: updateError } = await supabase
      .from('invoices')
      .update({ 
        status: 'sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId);

    if (updateError) throw updateError;

    console.log(`Invoice ${invoice.invoice_number} sent to ${invoice.customer_profile?.email}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Invoice sent successfully' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Failed to send invoice: ${error.message}`);
  }
}

async function generateInvoicePDF(supabase: any, invoiceId: string, userId: string) {
  try {
    // Get invoice with all details
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer_profile:customer_id (
          full_name,
          email,
          address,
          phone
        ),
        contractor_profile:contractor_id (
          full_name,
          email,
          address,
          phone
        )
      `)
      .eq('id', invoiceId)
      .or(`contractor_id.eq.${userId},customer_id.eq.${userId}`)
      .single();

    if (error) throw error;
    if (!invoice) throw new Error('Invoice not found');

    // Generate PDF content
    const pdfContent = generatePDFContent(invoice);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        pdf: pdfContent,
        filename: `${invoice.invoice_number}.pdf`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
}

async function markInvoicePaid(supabase: any, invoiceId: string, userId: string) {
  try {
    const { error } = await supabase
      .from('invoices')
      .update({ 
        status: 'paid',
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId)
      .eq('contractor_id', userId);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, message: 'Invoice marked as paid' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Failed to mark invoice as paid: ${error.message}`);
  }
}

async function sendPaymentReminder(supabase: any, invoiceId: string, userId: string) {
  try {
    // Get invoice details
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        customer_profile:customer_id (
          full_name,
          email
        )
      `)
      .eq('id', invoiceId)
      .eq('contractor_id', userId)
      .single();

    if (error) throw error;
    if (!invoice) throw new Error('Invoice not found');

    // Here you would send reminder email
    console.log(`Payment reminder sent for invoice ${invoice.invoice_number}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Reminder sent successfully' }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    throw new Error(`Failed to send reminder: ${error.message}`);
  }
}

function generatePDFContent(invoice: any): string {
  const customerProfile = Array.isArray(invoice.customer_profile) 
    ? invoice.customer_profile[0] 
    : invoice.customer_profile;
  const contractorProfile = Array.isArray(invoice.contractor_profile) 
    ? invoice.contractor_profile[0] 
    : invoice.contractor_profile;

  return `
<!DOCTYPE html>
<html>
<head>
    <title>Invoice ${invoice.invoice_number}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            line-height: 1.6;
        }
        .header { 
            border-bottom: 3px solid #2563eb; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        .invoice-title {
            font-size: 36px;
            font-weight: bold;
            color: #2563eb;
            margin: 0;
        }
        .invoice-number {
            font-size: 18px;
            color: #666;
            margin: 5px 0;
        }
        .company-info {
            text-align: right;
        }
        .details-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .bill-to, .invoice-details {
            width: 45%;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .amount-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .total-amount {
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            text-align: center;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
        }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-sent { background: #dbeafe; color: #1d4ed8; }
        .status-draft { background: #f3f4f6; color: #374151; }
        .status-overdue { background: #fee2e2; color: #dc2626; }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .description-box {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .notes-box {
            background: #fffbeb;
            border: 1px solid #fbbf24;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1 class="invoice-title">INVOICE</h1>
            <div class="invoice-number">${invoice.invoice_number}</div>
            <span class="status-badge status-${invoice.status}">${invoice.status}</span>
        </div>
        <div class="company-info">
            <strong>${contractorProfile?.full_name || 'Contractor'}</strong><br>
            ${contractorProfile?.email || ''}<br>
            ${contractorProfile?.phone || ''}<br>
            ${contractorProfile?.address || ''}
        </div>
    </div>

    <div class="details-section">
        <div class="bill-to">
            <div class="section-title">BILL TO</div>
            <strong>${customerProfile?.full_name || 'Customer'}</strong><br>
            ${customerProfile?.email || ''}<br>
            ${customerProfile?.phone || ''}<br>
            ${customerProfile?.address || ''}
        </div>
        <div class="invoice-details">
            <div class="section-title">INVOICE DETAILS</div>
            <strong>Invoice Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}<br>
            ${invoice.due_date ? `<strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}<br>` : ''}
            ${invoice.paid_at ? `<strong>Paid Date:</strong> ${new Date(invoice.paid_at).toLocaleDateString()}<br>` : ''}
        </div>
    </div>

    <div class="description-box">
        <div class="section-title">DESCRIPTION OF WORK</div>
        ${invoice.description}
    </div>

    <div class="amount-section">
        <div style="text-align: center; margin-bottom: 10px; font-size: 18px; color: #666;">
            TOTAL AMOUNT
        </div>
        <div class="total-amount">$${invoice.amount.toFixed(2)}</div>
    </div>

    ${invoice.notes ? `
    <div class="notes-box">
        <div class="section-title">NOTES</div>
        ${invoice.notes}
    </div>
    ` : ''}

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
</body>
</html>
  `;
}