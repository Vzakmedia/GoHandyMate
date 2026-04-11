
import { WorkProgress } from '../types';

export const getWorkProgress = (status: string): WorkProgress => {
  switch (status) {
    case 'pending':
      return { progress: 10, text: 'Waiting for quotes from handymen' };
    case 'quotes_received':
      return { progress: 30, text: 'Quotes received - review and select one' };
    case 'accepted':
      return { progress: 60, text: 'Quote accepted - work in progress' };
    case 'in_progress':
      return { progress: 80, text: 'Work is currently in progress' };
    case 'completed':
      return { progress: 100, text: 'Job completed successfully' };
    case 'cancelled':
      return { progress: 0, text: 'Request was cancelled' };
    default:
      return { progress: 0, text: 'Status unknown' };
  }
};
