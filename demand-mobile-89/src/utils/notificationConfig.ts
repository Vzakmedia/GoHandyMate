import { Profile } from '@/features/auth/types';

export interface NotificationConfig {
  channels: string[];
  filters: Record<string, any>;
  actionLabel: string;
  navigationPath: string;
}

export const getNotificationConfig = (userRole: Profile['user_role']): Record<string, NotificationConfig> => {
  const baseConfig = {
    // Common notifications for all users
    system: {
      channels: ['system-notifications'],
      filters: { recipient_role: [userRole, 'all'] },
      actionLabel: 'View',
      navigationPath: '/'
    },
    messages: {
      channels: ['messages'],
      filters: {},
      actionLabel: 'View Message',
      navigationPath: '/jobs'
    }
  };

  switch (userRole) {
    case 'handyman':
      return {
        ...baseConfig,
        job_requests: {
          channels: ['job-requests', 'handyman-assignments'],
          filters: { status: 'pending', job_type: ['handyman_service', 'maintenance', 'emergency'] },
          actionLabel: 'View Jobs',
          navigationPath: '/jobs'
        },
        quote_requests: {
          channels: ['custom-quote-requests'],
          filters: { status: 'pending' },
          actionLabel: 'View Quotes',
          navigationPath: '/?tab=quotes'
        },
        job_assignments: {
          channels: ['job-assignments'],
          filters: { assigned_to_user_id: 'current_user' },
          actionLabel: 'View Job',
          navigationPath: '/jobs'
        }
      };

    // contractor case archived — contractor role removed

    case 'customer':
      return {
        ...baseConfig,
        quote_submissions: {
          channels: ['quote-submissions'],
          filters: { customer_id: 'current_user' },
          actionLabel: 'View Quote',
          navigationPath: '/?tab=quotes'
        },
        job_updates: {
          channels: ['job-status-updates'],
          filters: { customer_id: 'current_user' },
          actionLabel: 'View Job',
          navigationPath: '/?tab=bookings'
        },
        payment_updates: {
          channels: ['payment-notifications'],
          filters: { customer_id: 'current_user' },
          actionLabel: 'View Payment',
          navigationPath: '/?tab=payments'
        }
      };

    // property_manager case archived — property_manager role removed

    default:
      return baseConfig;
  }
};

export const getNotificationTitle = (type: string, userRole: Profile['user_role'], data: any): string => {
  const titles: Record<string, Record<string, string>> = {
    handyman: {
      job_requests: 'New Job Available!',
      quote_requests: 'New Quote Request!',
      job_assignments: 'Job Assigned!',
      messages: 'New Message',
      system: 'System Notification'
    },
    customer: {
      quote_submissions: 'New Quote Received!',
      job_updates: 'Job Update',
      payment_updates: 'Payment Update',
      messages: 'New Message',
      system: 'System Notification'
    },
  };

  return titles[userRole]?.[type] || 'Notification';
};

export const getNotificationDescription = (type: string, userRole: Profile['user_role'], data: any): string => {
  switch (type) {
    case 'job_requests':
      return `${data.job_type || 'Service'} job posted${data.location ? ` in ${data.location}` : ''}`;
    case 'quote_requests':
      return `${data.service_name || 'Service'} - ${data.location || 'Location'}`;
    case 'quote_submissions':
      return `You received a quote for ${data.service_name || 'your request'}`;
    case 'job_updates':
      const statusMessages = {
        'assigned': 'Your job has been assigned to a professional',
        'in_progress': 'Work has started on your job',
        'completed': 'Your job has been completed',
        'cancelled': 'Your job has been cancelled'
      };
      return statusMessages[data.status as keyof typeof statusMessages] || 'Job status updated';
    case 'maintenance_requests':
      return `${data.title || 'Maintenance'} request submitted`;
    case 'emergency_requests':
      return `Urgent: ${data.description || 'Emergency situation'}`;
    case 'messages':
      return data.sender_name ? `Message from ${data.sender_name}` : 'You have a new message';
    case 'system':
      return data.message || 'You have a new notification';
    default:
      return 'You have a new notification';
  }
};

export const getNotificationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    message: '💬',
    job_request: '🔨',
    job_requests: '🔨',
    quote: '💰',
    quote_requests: '💰',
    quote_submissions: '💰',
    maintenance_requests: '🔧',
    emergency_requests: '🚨',
    system: '🔔',
    payment_updates: '💳',
    contract_updates: '📄',
    property_updates: '🏢'
  };

  return icons[type] || '📝';
};