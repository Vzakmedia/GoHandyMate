
import { SystemJob } from '../types/automation';

export const systemJobs: SystemJob[] = [
  {
    name: 'Monthly Job Reset',
    description: 'Reset monthly job counts for all users',
    status: 'active',
    frequency: 'Monthly (1st day)',
    functionName: 'reset-monthly-jobs'
  },
  {
    name: 'Subscription Sync',
    description: 'Sync subscription statuses with Stripe',
    status: 'active',
    frequency: 'Daily',
    functionName: 'admin-sync-subscriptions'
  },
  {
    name: 'Expired Ad Cleanup',
    description: 'Clean up expired advertisements',
    status: 'active',
    frequency: 'Daily',
    functionName: 'admin-cleanup-expired-ads'
  },
  {
    name: 'Notification Cleanup',
    description: 'Remove old read notifications',
    status: 'active',
    frequency: 'Weekly',
    functionName: 'admin-cleanup-notifications'
  }
];
