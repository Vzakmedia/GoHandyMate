
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, RefreshCw, Clock, AlertTriangle } from 'lucide-react';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'success':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'failed':
    case 'error':
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    case 'running':
    case 'started':
      return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="text-green-600">Active</Badge>;
    case 'paused':
      return <Badge variant="secondary">Paused</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};
