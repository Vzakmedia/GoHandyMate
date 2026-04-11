
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VerificationLog } from '../types/verification';

interface VerificationLogsProps {
  verificationLogs: VerificationLog[];
}

export const VerificationLogs = ({ verificationLogs }: VerificationLogsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification History</CardTitle>
        <CardDescription>
          Recent verification actions performed by administrators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Status Change</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verificationLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm">
                  {log.admin_email?.split('@')[0] || 'N/A'}
                </TableCell>
                <TableCell className="text-sm">
                  {log.user_email?.split('@')[0] || 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge variant={
                    log.action === 'approve' ? 'default' : 
                    log.action === 'reject' ? 'destructive' : 'secondary'
                  }>
                    {log.action.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {log.previous_status} → {log.new_status}
                </TableCell>
                <TableCell className="text-sm max-w-xs truncate">
                  {log.reason || 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
