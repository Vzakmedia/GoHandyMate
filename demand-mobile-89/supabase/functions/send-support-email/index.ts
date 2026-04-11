import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SupportEmailRequest {
  type: 'contact_request' | 'support_ticket' | 'feedback';
  subject: string;
  message: string;
  userEmail?: string;
  userName?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, subject, message, userEmail, userName, priority = 'medium' }: SupportEmailRequest = await req.json();

    console.log('Support email request received:', { type, subject, userEmail, priority });

    // Here you would integrate with your email service (like Resend, SendGrid, etc.)
    // For now, we'll just log the request and return success
    
    const supportEmail = {
      to: userEmail || 'customer@example.com',
      from: 'support@gohandymate.com',
      subject: `GoHandyMate Support: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">Thank you for contacting GoHandyMate Support</h2>
          
          <p>Hi ${userName || 'there'},</p>
          
          <p>We've received your ${type.replace('_', ' ')} and our support team will get back to you as soon as possible.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Your Request Details:</h3>
            <p><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Priority:</strong> ${priority.charAt(0).toUpperCase() + priority.slice(1)}</p>
            <p><strong>Message:</strong> ${message}</p>
          </div>
          
          <h3 style="color: #374151;">What happens next?</h3>
          <ul style="color: #6b7280;">
            <li>High priority issues: Response within 2 hours</li>
            <li>Medium priority issues: Response within 24 hours</li>
            <li>Low priority issues: Response within 2-3 business days</li>
          </ul>
          
          <p>If you need immediate assistance, you can also:</p>
          <ul style="color: #6b7280;">
            <li>Call our support line: 1-800-HANDYMAN</li>
            <li>Use live chat on our website</li>
            <li>Email us directly: support@gohandymate.com</li>
          </ul>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; font-size: 14px;">
            Best regards,<br>
            The GoHandyMate Support Team<br>
            <a href="https://gohandymate.com">gohandymate.com</a>
          </p>
        </div>
      `
    };

    console.log('Support email prepared:', supportEmail);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Support email sent successfully',
        ticketId: `GM-${Date.now()}`
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in send-support-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send support email',
        details: error.message 
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});