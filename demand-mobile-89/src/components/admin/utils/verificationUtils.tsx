
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="text-yellow-600 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case 'active':
      return <Badge variant="default" className="text-green-600 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
    case 'rejected':
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
    case 'suspended':
      return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />Suspended</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getRoleBadge = (role: string) => {
  const roleColors = {
    handyman: 'bg-blue-100 text-blue-800',
    customer: 'bg-green-100 text-green-800',
    // Legacy roles (archived):
    contractor: 'bg-gray-100 text-gray-500',
    property_manager: 'bg-gray-100 text-gray-500'
  };

  return (
    <Badge className={roleColors[role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'}>
      {role.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};
