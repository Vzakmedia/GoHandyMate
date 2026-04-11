import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Invoice {
  id: string;
  contractor_id: string;
  customer_id: string;
  quote_request_id?: string;
  quote_submission_id?: string;
  invoice_number: string;
  amount: number;
  description: string;
  due_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  notes?: string;
  customer_profile?: {
    full_name: string;
    email: string;
  };
  contractor_profile?: {
    full_name: string;
    email: string;
  };
}

export interface CreateInvoiceData {
  customer_id: string;
  quote_request_id?: string;
  quote_submission_id?: string;
  amount: number;
  description: string;
  due_date?: string;
  notes?: string;
}

export const useInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate unique invoice number
  const generateInvoiceNumber = useCallback(async () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${year}${month}-${timestamp}`;
  }, []);

  // Create new invoice
  const createInvoice = useCallback(async (data: CreateInvoiceData) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      const invoiceNumber = await generateInvoiceNumber();
      
      const { data: result, error } = await supabase
        .from('invoices')
        .insert({
          contractor_id: user.id,
          customer_id: data.customer_id,
          quote_request_id: data.quote_request_id,
          quote_submission_id: data.quote_submission_id,
          invoice_number: invoiceNumber,
          amount: data.amount,
          description: data.description,
          due_date: data.due_date,
          notes: data.notes,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Invoice created successfully!');
      await fetchInvoices();
      return result;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice');
      throw error;
    }
  }, [user?.id, generateInvoiceNumber]);

  // Update invoice
  const updateInvoice = useCallback(async (invoiceId: string, updates: Partial<Invoice>) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update(updates)
        .eq('id', invoiceId);

      if (error) throw error;
      
      toast.success('Invoice updated successfully!');
      await fetchInvoices();
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      toast.error('Failed to update invoice');
      throw error;
    }
  }, []);

  // Update invoice status
  const updateInvoiceStatus = useCallback(async (invoiceId: string, status: string) => {
    try {
      const updateData: any = { status };
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) throw error;
      
      toast.success(`Invoice ${status} successfully!`);
      await fetchInvoices();
    } catch (error: any) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
      throw error;
    }
  }, []);

  // Send invoice
  const sendInvoice = useCallback(async (invoiceId: string) => {
    try {
      // Call edge function to send invoice
      const { error } = await supabase.functions.invoke('invoice-operations', {
        body: {
          action: 'send_invoice',
          invoiceId
        }
      });

      if (error) throw error;
      
      await updateInvoiceStatus(invoiceId, 'sent');
      toast.success('Invoice sent to customer!');
    } catch (error: any) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice');
      throw error;
    }
  }, [updateInvoiceStatus]);

  // Delete invoice
  const deleteInvoice = useCallback(async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;
      
      toast.success('Invoice deleted successfully!');
      await fetchInvoices();
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
      throw error;
    }
  }, []);

  // Download invoice as PDF
  const downloadInvoice = useCallback(async (invoice: Invoice) => {
    try {
      const { data, error } = await supabase.functions.invoke('invoice-operations', {
        body: {
          action: 'generate_pdf',
          invoiceId: invoice.id
        }
      });

      if (error) throw error;

      // Create blob and download
      const blob = new Blob([data.pdf], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully!');
    } catch (error: any) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  }, []);

  // Fetch invoices
  const fetchInvoices = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Fetch invoices for contractor
      const { data: contractorInvoices, error: contractorError } = await supabase
        .from('invoices')
        .select('*')
        .eq('contractor_id', user.id)
        .order('created_at', { ascending: false });

      if (contractorError) throw contractorError;

      // Fetch invoices for customer
      const { data: customerInvoices, error: customerError } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (customerError) throw customerError;

      // Fetch customer profiles for contractor invoices
      const customerIds = contractorInvoices?.map(inv => inv.customer_id).filter(Boolean) || [];
      let customerProfiles: any[] = [];
      if (customerIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', customerIds);
        customerProfiles = profiles || [];
      }

      // Fetch contractor profiles for customer invoices
      const contractorIds = customerInvoices?.map(inv => inv.contractor_id).filter(Boolean) || [];
      let contractorProfiles: any[] = [];
      if (contractorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', contractorIds);
        contractorProfiles = profiles || [];
      }

      // Combine and format invoices
      const allInvoices = [
        ...(contractorInvoices || []).map(inv => ({
          ...inv,
          customer_profile: customerProfiles.find(profile => profile.id === inv.customer_id)
        })),
        ...(customerInvoices || []).map(inv => ({
          ...inv,
          contractor_profile: contractorProfiles.find(profile => profile.id === inv.contractor_id)
        }))
      ];

      setInvoices(allInvoices as Invoice[]);
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Check for overdue invoices
  const checkOverdueInvoices = useCallback(async () => {
    if (!user?.id) return;

    try {
      const overdueDate = new Date();
      overdueDate.setHours(0, 0, 0, 0);

      const { error } = await supabase
        .from('invoices')
        .update({ status: 'overdue' })
        .eq('contractor_id', user.id)
        .eq('status', 'sent')
        .lt('due_date', overdueDate.toISOString());

      if (error) throw error;
    } catch (error) {
      console.error('Error checking overdue invoices:', error);
    }
  }, [user?.id]);

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`invoices-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `contractor_id=eq.${user.id}`
        },
        () => fetchInvoices()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `customer_id=eq.${user.id}`
        },
        () => fetchInvoices()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, fetchInvoices]);

  // Initial load and periodic overdue check
  useEffect(() => {
    if (user?.id) {
      fetchInvoices();
      checkOverdueInvoices();
      
      // Check for overdue invoices every hour
      const interval = setInterval(checkOverdueInvoices, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user?.id, fetchInvoices, checkOverdueInvoices]);

  // Statistics
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    pending: invoices.filter(inv => inv.status === 'sent').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
    pendingAmount: invoices.filter(inv => ['sent', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + inv.amount, 0)
  };

  return {
    invoices,
    loading,
    stats,
    createInvoice,
    updateInvoice,
    updateInvoiceStatus,
    sendInvoice,
    deleteInvoice,
    downloadInvoice,
    fetchInvoices
  };
};