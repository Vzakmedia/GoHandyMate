
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VerificationLog {
  id: string;
  admin_id: string;
  user_id: string;
  action: string;
  previous_status: string;
  new_status: string;
  reason?: string;
  created_at: string;
  user: {
    full_name: string;
    email: string;
  };
  admin: {
    full_name: string;
    email: string;
  };
}

interface PendingUser {
  id: string;
  full_name: string;
  email: string;
  user_role: string;
  account_status: string;
  created_at: string;
}

interface VerificationStats {
  pending_handymen: number;
  pending_contractors: number;
  total_pending: number;
}

export const useVerificationActions = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<VerificationStats>({
    pending_handymen: 0,
    pending_contractors: 0,
    total_pending: 0
  });

  const verifyUser = async (userId: string, status: 'active' | 'rejected' | 'suspended', reason?: string) => {
    try {
      setProcessingUsers(prev => new Set(prev).add(userId));
      
      const { data, error } = await supabase.rpc('admin_verify_account', {
        user_id_to_verify: userId,
        new_status: status,
        reason: reason || null
      });

      if (error) throw error;

      toast.success(`User ${status === 'active' ? 'approved' : status} successfully`);
      
      // Refresh data after action
      await fetchData();
      
      return true;
    } catch (error: any) {
      console.error('Error verifying user:', error);
      toast.error(error.message || 'Failed to update user status');
      return false;
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const approveUser = async (userId: string) => {
    return await verifyUser(userId, 'active');
  };

  const rejectUser = async (userId: string, reason?: string) => {
    return await verifyUser(userId, 'rejected', reason);
  };

  const fetchVerificationLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_verification_logs')
        .select(`
          *,
          user:profiles!admin_verification_logs_user_id_fkey(full_name, email),
          admin:profiles!admin_verification_logs_admin_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Map the data with proper error handling
      const mappedLogs: VerificationLog[] = (data || []).map(log => ({
        id: log.id,
        admin_id: log.admin_id,
        user_id: log.user_id,
        action: log.action,
        previous_status: log.previous_status,
        new_status: log.new_status,
        reason: log.reason,
        created_at: log.created_at,
        user: {
          full_name: (log.user && typeof log.user === 'object' && 'full_name' in log.user) ? log.user.full_name : 'Unknown User',
          email: (log.user && typeof log.user === 'object' && 'email' in log.user) ? log.user.email : 'No email'
        },
        admin: {
          full_name: (log.admin && typeof log.admin === 'object' && 'full_name' in log.admin) ? log.admin.full_name : 'Unknown Admin',
          email: (log.admin && typeof log.admin === 'object' && 'email' in log.admin) ? log.admin.email : 'No email'
        }
      }));

      setLogs(mappedLogs);
    } catch (error) {
      console.error('Error fetching verification logs:', error);
      toast.error('Failed to fetch verification logs');
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, user_role, account_status, created_at')
        .eq('account_status', 'pending')
        .in('user_role', ['handyman', 'contractor', 'property_manager'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedUsers: PendingUser[] = (data || []).map(user => ({
        id: user.id,
        full_name: user.full_name || 'Unknown User',
        email: user.email,
        user_role: user.user_role,
        account_status: user.account_status,
        created_at: user.created_at
      }));

      setPendingUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast.error('Failed to fetch pending users');
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('account_status, user_role')
        .in('user_role', ['handyman', 'contractor']);

      if (error) throw error;

      const stats = (data || []).reduce((acc, profile) => {
        const status = profile.account_status || 'pending';
        const role = profile.user_role;
        
        if (status === 'pending') {
          if (role === 'handyman') acc.pending_handymen++;
          else if (role === 'contractor') acc.pending_contractors++;
          acc.total_pending++;
        }
        return acc;
      }, { pending_handymen: 0, pending_contractors: 0, total_pending: 0 });

      setStats(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPendingUsers(),
        fetchVerificationLogs(),
        fetchStats()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await fetchData();
    } finally {
      setRefreshing(false);
    }
  };

  return {
    loading,
    refreshing,
    logs,
    pendingUsers,
    processingUsers,
    stats,
    verifyUser,
    approveUser,
    rejectUser,
    fetchVerificationLogs,
    fetchData,
    refreshData,
    verificationLogs: logs // alias for backward compatibility
  };
};
