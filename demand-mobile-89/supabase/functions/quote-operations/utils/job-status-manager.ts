
export const updateQuoteJobStatus = async (supabaseClient: any, quoteId: string, status: string, userId: string) => {
  console.log('Updating quote job status:', { quoteId, status, userId });
  
  try {
    // Update the quote submission status
    const { data: updatedQuote, error: updateError } = await supabaseClient
      .from('quote_submissions')
      .update({ 
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', quoteId)
      .eq('handyman_id', userId)
      .select(`
        *,
        custom_quote_requests (
          id,
          service_name,
          customer_id,
          status,
          accepted_quote_id
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating quote submission:', updateError);
      throw updateError;
    }

    console.log('Quote submission updated successfully:', updatedQuote);

    // If the quote request was accepted by customer, cancel other pending quotes
    if (updatedQuote.custom_quote_requests?.status === 'accepted' && 
        updatedQuote.custom_quote_requests?.accepted_quote_id === quoteId) {
      
      console.log('Canceling other quotes for accepted request');
      
      // Cancel all other quote submissions for this request
      const { error: cancelError } = await supabaseClient
        .from('quote_submissions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('quote_request_id', updatedQuote.quote_request_id)
        .neq('id', quoteId);

      if (cancelError) {
        console.error('Error canceling other quotes:', cancelError);
      } else {
        console.log('Other quotes canceled successfully');
      }
    }

    return updatedQuote;
  } catch (error) {
    console.error('Error in updateQuoteJobStatus:', error);
    throw error;
  }
};
