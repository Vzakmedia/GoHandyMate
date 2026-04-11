
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PendingUser } from './admin/types/verification';
import { VerificationStats } from './admin/verification/VerificationStats';
import { PendingUsersTable } from './admin/verification/PendingUsersTable';
import { VerificationLogs } from './admin/verification/VerificationLogs';
import { RejectionDialog } from './admin/verification/RejectionDialog';
import { AccessDenied } from './admin/verification/AccessDenied';
import { useVerificationActions } from '@/hooks/useVerificationActions';

export const AdminVerificationPanel = () => {
  const { user } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<PendingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    pendingUsers,
    verificationLogs,
    stats,
    loading,
    refreshing,
    processingUsers,
    fetchData,
    refreshData,
    approveUser,
    rejectUser
  } = useVerificationActions();

  // Check if user is admin - temporarily including support@gohandymate.com for testing
  const isAdmin = user?.email === 'admin@gohandymate.com' || 
                  user?.email?.endsWith('@admin.gohandymate.com') ||
                  user?.email === 'support@gohandymate.com';

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  useEffect(() => {
    // Filter users based on search term
    const filtered = pendingUsers.filter(user => 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [pendingUsers, searchTerm]);

  const handleApproveUser = async (userId: string) => {
    await approveUser(userId);
  };

  const handleRejectUser = async () => {
    if (!selectedUser || !rejectionReason.trim()) return;
    
    await rejectUser(selectedUser.id, rejectionReason);
    setShowRejectDialog(false);
    setSelectedUser(null);
    setRejectionReason('');
  };

  const openRejectDialog = (user: PendingUser) => {
    setSelectedUser(user);
    setShowRejectDialog(true);
  };

  const closeRejectDialog = () => {
    setShowRejectDialog(false);
    setSelectedUser(null);
    setRejectionReason('');
  };

  if (!isAdmin) {
    return <AccessDenied userEmail={user?.email} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VerificationStats stats={stats} />

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          <TabsTrigger value="logs">Verification Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <PendingUsersTable
            filteredUsers={filteredUsers}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            refreshing={refreshing}
            onRefresh={refreshData}
            processingUsers={processingUsers}
            onApproveUser={handleApproveUser}
            onRejectUser={openRejectDialog}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <VerificationLogs verificationLogs={verificationLogs} />
        </TabsContent>
      </Tabs>

      <RejectionDialog
        showRejectDialog={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        selectedUser={selectedUser}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onReject={handleRejectUser}
        onCancel={closeRejectDialog}
        processingUsers={processingUsers}
      />
    </div>
  );
};
