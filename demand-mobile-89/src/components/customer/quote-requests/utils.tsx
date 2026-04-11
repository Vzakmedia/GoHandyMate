
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import { WorkProgress } from './types';

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'accepted':
    case 'in_progress':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'quotes_received':
      return <AlertCircle className="w-4 h-4 text-blue-600" />;
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'quotes_received':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getWorkProgress = (status: string, acceptedSubmission?: any): WorkProgress => {
  // If we have an accepted submission, use its status for more accurate progress
  if (acceptedSubmission) {
    switch (acceptedSubmission.status) {
      case 'accepted':
        return { progress: 25, text: 'Job Assigned - Handyman will contact you soon' };
      case 'in_progress':
        return { progress: 50, text: 'Work in Progress' };
      case 'completed':
        return { progress: 100, text: 'Job Completed' };
      default:
        return { progress: 25, text: 'Job Assigned - Handyman will contact you soon' };
    }
  }

  // Fallback to request status
  switch (status) {
    case 'accepted':
      return { progress: 25, text: 'Job Assigned - Handyman will contact you soon' };
    case 'in_progress':
      return { progress: 50, text: 'Work in Progress' };
    case 'completed':
      return { progress: 100, text: 'Job Completed' };
    default:
      return { progress: 0, text: 'Waiting for quotes' };
  }
};
