
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, RefreshCw, Search } from 'lucide-react';
import { PendingUser } from '../types/verification';
import { getStatusBadge, getRoleBadge } from '../utils/verificationUtils';

interface PendingUsersTableProps {
  filteredUsers: PendingUser[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  refreshing: boolean;
  onRefresh: () => void;
  processingUsers: Set<string>;
  onApproveUser: (userId: string) => void;
  onRejectUser: (user: PendingUser) => void;
}

export const PendingUsersTable = ({
  filteredUsers,
  searchTerm,
  onSearchChange,
  refreshing,
  onRefresh,
  processingUsers,
  onApproveUser,
  onRejectUser
}: PendingUsersTableProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Pending Account Verifications</CardTitle>
            <CardDescription>
              Review and approve handyman and contractor account applications
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? (
              <>
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-gray-600">No users match your search criteria.</p>
              </>
            ) : (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending account verifications at the moment.</p>
              </>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.full_name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.user_role)}</TableCell>
                  <TableCell>{getStatusBadge(user.account_status)}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => onApproveUser(user.id)}
                        className="text-green-600 hover:text-green-700"
                        variant="outline"
                        disabled={processingUsers.has(user.id)}
                      >
                        {processingUsers.has(user.id) ? (
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-1" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRejectUser(user)}
                        className="text-red-600 hover:text-red-700"
                        disabled={processingUsers.has(user.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
