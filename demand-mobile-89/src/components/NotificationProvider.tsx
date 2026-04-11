
import { ReactNode } from 'react';
import { useUnifiedNotifications } from '@/hooks/useUnifiedNotifications';

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  console.log('🔔 NotificationProvider: Rendering with unified notifications enabled');
  
  // Enable unified real-time notifications for all user roles
  useUnifiedNotifications();
  
  return <>{children}</>;
};
