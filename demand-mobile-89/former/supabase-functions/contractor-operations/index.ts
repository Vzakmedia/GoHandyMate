import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CONTRACTOR-OPERATIONS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user) throw new Error('User not found');

    logStep("User authenticated", { userId: user.id });

    const body = await req.json();
    const { action } = body;

    logStep("Processing action", { action });

    switch (action) {
      case 'get_contractor_metrics':
        return await getContractorMetrics(supabaseClient, user.id);
        
      case 'update_contractor_metrics':
        return await updateContractorMetrics(supabaseClient, user.id);
        
      case 'generate_invoice_pdf':
        return await generateInvoicePDF(supabaseClient, body.invoice_id, user.id);
        
      case 'send_invoice_email':
        return await sendInvoiceEmail(supabaseClient, body.invoice_id, user.id);
        
      case 'bulk_update_quotes':
        return await bulkUpdateQuotes(supabaseClient, body.quote_ids, body.status, user.id);
        
      case 'export_contractor_data':
        return await exportContractorData(supabaseClient, user.id, body.date_range);
        
      case 'auto_follow_up':
        return await autoFollowUp(supabaseClient, user.id);
        
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getContractorMetrics(supabaseClient: any, userId: string) {
  logStep("Getting contractor metrics", { userId });

  // Get quote metrics
  const { data: quoteRequests } = await supabaseClient
    .from('contractor_quote_requests')
    .select('*')
    .eq('contractor_id', userId);

  const { data: quoteSubmissions } = await supabaseClient
    .from('contractor_quote_submissions')
    .select('*')
    .eq('customer_id', userId);

  // Get invoice metrics
  const { data: invoices } = await supabaseClient
    .from('invoices')
    .select('*')
    .eq('contractor_id', userId);

  // Calculate metrics
  const totalQuotesSent = quoteRequests?.length || 0;
  const quotesAccepted = quoteRequests?.filter(q => q.status === 'accepted').length || 0;
  const quotesRejected = quoteRequests?.filter(q => q.status === 'rejected').length || 0;
  
  const totalInvoicesSent = invoices?.filter(i => i.status !== 'draft').length || 0;
  const paidInvoices = invoices?.filter(i => i.status === 'paid').length || 0;
  const overdueInvoices = invoices?.filter(i => 
    i.status === 'sent' && i.due_date && new Date(i.due_date) < new Date()
  ).length || 0;

  const totalRevenue = invoices?.filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0) || 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRevenue = invoices?.filter(i => 
    i.status === 'paid' && 
    new Date(i.created_at).getMonth() === currentMonth &&
    new Date(i.created_at).getFullYear() === currentYear
  ).reduce((sum, i) => sum + i.amount, 0) || 0;

  // Calculate average response time
  const acceptedQuotes = quoteRequests?.filter(q => q.status === 'accepted') || [];
  const avgResponseTime = acceptedQuotes.length > 0 
    ? acceptedQuotes.reduce((sum, q) => {
        const created = new Date(q.created_at);
        const updated = new Date(q.updated_at);
        return sum + (updated.getTime() - created.getTime());
      }, 0) / acceptedQuotes.length / (1000 * 60 * 60) // Convert to hours
    : 0;

  const metrics = {
    totalQuotesSent,
    quotesAccepted,
    quotesRejected,
    totalRevenue,
    monthlyRevenue,
    averageResponseTimeHours: Math.round(avgResponseTime * 100) / 100,
    totalInvoicesSent,
    paidInvoices,
    overdueInvoices,
    acceptanceRate: totalQuotesSent > 0 ? (quotesAccepted / totalQuotesSent) * 100 : 0,
    paymentRate: totalInvoicesSent > 0 ? (paidInvoices / totalInvoicesSent) * 100 : 0
  };

  // Update contractor_metrics table
  await supabaseClient
    .from('contractor_metrics')
    .upsert({
      contractor_id: userId,
      ...metrics
    });

  logStep("Metrics calculated", metrics);

  return new Response(
    JSON.stringify({ metrics }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function updateContractorMetrics(supabaseClient: any, userId: string) {
  // This function recalculates and updates metrics
  return await getContractorMetrics(supabaseClient, userId);
}

async function generateInvoicePDF(supabaseClient: any, invoiceId: string, userId: string) {
  logStep("Generating invoice PDF", { invoiceId, userId });

  const { data: invoice, error } = await supabaseClient
    .from('invoices')
    .select(`
      *,
      customer:customer_id (full_name, email),
      contractor:contractor_id (full_name, email)
    `)
    .eq('id', invoiceId)
    .eq('contractor_id', userId)
    .single();

  if (error) throw error;
  if (!invoice) throw new Error('Invoice not found');

  // Generate HTML for PDF
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 40px; }
          .invoice-title { font-size: 36px; color: #2563eb; margin: 0; }
          .invoice-number { font-size: 18px; color: #6b7280; margin: 5px 0; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #374151; }
          .amount { font-size: 32px; font-weight: bold; color: #059669; }
          .status { 
            display: inline-block; 
            padding: 8px 16px; 
            border-radius: 20px; 
            color: white; 
            font-weight: bold;
            text-transform: uppercase;
          }
          .status-paid { background-color: #059669; }
          .status-sent { background-color: #2563eb; }
          .status-draft { background-color: #6b7280; }
          .status-overdue { background-color: #dc2626; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
          .info-row { margin-bottom: 8px; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #6b7280; }
          .description-box { 
            background-color: #f9fafb; 
            border: 1px solid #e5e7eb; 
            padding: 20px; 
            border-radius: 8px; 
            margin-top: 10px;
          }
          .footer { 
            margin-top: 60px; 
            padding-top: 20px; 
            border-top: 1px solid #e5e7eb; 
            text-align: center; 
            color: #6b7280; 
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="invoice-title">Invoice</h1>
          <div class="invoice-number">${invoice.invoice_number}</div>
          <span class="status status-${invoice.status}">${invoice.status}</span>
        </div>

        <div class="grid">
          <div class="section">
            <div class="section-title">From:</div>
            <div class="info-row">
              <span class="label">Contractor:</span> 
              <span class="value">${invoice.contractor?.full_name || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span> 
              <span class="value">${invoice.contractor?.email || 'N/A'}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">To:</div>
            <div class="info-row">
              <span class="label">Customer:</span> 
              <span class="value">${invoice.customer?.full_name || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span> 
              <span class="value">${invoice.customer?.email || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Invoice Details:</div>
          <div class="grid">
            <div>
              <div class="info-row">
                <span class="label">Invoice Date:</span> 
                <span class="value">${new Date(invoice.created_at).toLocaleDateString()}</span>
              </div>
              ${invoice.due_date ? `
                <div class="info-row">
                  <span class="label">Due Date:</span> 
                  <span class="value">${new Date(invoice.due_date).toLocaleDateString()}</span>
                </div>
              ` : ''}
              ${invoice.paid_at ? `
                <div class="info-row">
                  <span class="label">Paid Date:</span> 
                  <span class="value">${new Date(invoice.paid_at).toLocaleDateString()}</span>
                </div>
              ` : ''}
            </div>
            <div style="text-align: right;">
              <div class="section-title">Amount:</div>
              <div class="amount">$${invoice.amount.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Description:</div>
          <div class="description-box">
            ${invoice.description}
          </div>
        </div>

        ${invoice.notes ? `
          <div class="section">
            <div class="section-title">Notes:</div>
            <div class="description-box">
              ${invoice.notes}
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          <p>Invoice ${invoice.invoice_number}</p>
        </div>
      </body>
    </html>
  `;

  return new Response(
    JSON.stringify({ 
      success: true, 
      html,
      invoice_number: invoice.invoice_number 
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function sendInvoiceEmail(supabaseClient: any, invoiceId: string, userId: string) {
  logStep("Sending invoice email", { invoiceId, userId });

  // Here you would integrate with an email service like Resend
  // For now, we'll just update the invoice status to 'sent'
  
  const { error } = await supabaseClient
    .from('invoices')
    .update({ status: 'sent' })
    .eq('id', invoiceId)
    .eq('contractor_id', userId);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, message: 'Invoice marked as sent' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function bulkUpdateQuotes(supabaseClient: any, quoteIds: string[], status: string, userId: string) {
  logStep("Bulk updating quotes", { quoteIds, status, userId });

  const { error } = await supabaseClient
    .from('contractor_quote_requests')
    .update({ status })
    .in('id', quoteIds)
    .eq('contractor_id', userId);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true, updated: quoteIds.length }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function exportContractorData(supabaseClient: any, userId: string, dateRange: any) {
  logStep("Exporting contractor data", { userId, dateRange });

  const startDate = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const endDate = dateRange?.end || new Date().toISOString();

  // Fetch all relevant data
  const [quoteRequests, quoteSubmissions, invoices] = await Promise.all([
    supabaseClient
      .from('contractor_quote_requests')
      .select('*')
      .eq('contractor_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate),
    supabaseClient
      .from('contractor_quote_submissions')
      .select('*')
      .eq('customer_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate),
    supabaseClient
      .from('invoices')
      .select('*')
      .eq('contractor_id', userId)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
  ]);

  const exportData = {
    export_date: new Date().toISOString(),
    date_range: { start: startDate, end: endDate },
    summary: {
      total_quote_requests: quoteRequests.data?.length || 0,
      total_quote_submissions: quoteSubmissions.data?.length || 0,
      total_invoices: invoices.data?.length || 0,
      total_revenue: invoices.data?.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0) || 0
    },
    quote_requests: quoteRequests.data || [],
    quote_submissions: quoteSubmissions.data || [],
    invoices: invoices.data || []
  };

  return new Response(
    JSON.stringify(exportData),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function autoFollowUp(supabaseClient: any, userId: string) {
  logStep("Auto follow-up", { userId });

  // Find quotes that need follow-up (pending for more than 3 days)
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();

  const { data: pendingQuotes } = await supabaseClient
    .from('contractor_quote_requests')
    .select('*')
    .eq('contractor_id', userId)
    .eq('status', 'pending')
    .lt('created_at', threeDaysAgo);

  // Find overdue invoices
  const { data: overdueInvoices } = await supabaseClient
    .from('invoices')
    .select('*')
    .eq('contractor_id', userId)
    .eq('status', 'sent')
    .lt('due_date', new Date().toISOString());

  const followUpTasks = {
    pending_quotes: pendingQuotes?.length || 0,
    overdue_invoices: overdueInvoices?.length || 0,
    recommendations: []
  };

  if (pendingQuotes?.length) {
    followUpTasks.recommendations.push({
      type: 'follow_up_quotes',
      message: `You have ${pendingQuotes.length} quote requests pending for more than 3 days. Consider following up with customers.`,
      quotes: pendingQuotes.map(q => ({ id: q.id, service_name: q.service_name, customer_id: q.customer_id }))
    });
  }

  if (overdueInvoices?.length) {
    followUpTasks.recommendations.push({
      type: 'overdue_invoices',
      message: `You have ${overdueInvoices.length} overdue invoices. Consider sending payment reminders.`,
      invoices: overdueInvoices.map(i => ({ id: i.id, invoice_number: i.invoice_number, amount: i.amount }))
    });
  }

  return new Response(
    JSON.stringify(followUpTasks),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}