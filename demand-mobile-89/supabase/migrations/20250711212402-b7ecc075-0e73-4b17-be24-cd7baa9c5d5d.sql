-- Fix RLS policies for contractor_quote_requests to allow customers to request quotes from contractors

-- Drop the incorrect policy
DROP POLICY IF EXISTS "Contractors can create quote requests to customers" ON public.contractor_quote_requests;

-- Add correct policy for customers to create quote requests TO contractors
CREATE POLICY "Customers can create quote requests to contractors" 
  ON public.contractor_quote_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = customer_id);