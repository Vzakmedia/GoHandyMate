import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { useQuoteNotifications } from '@/hooks/useQuoteNotifications';
import { useAuth } from '@/features/auth';
import { formatDistanceToNow } from 'date-fns';

export const NotificationButton = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead: markAllSystemAndMessagesAsRead, clearNotification } = useNotifications();
  const { markAllAsRead: markAllQuotesAsRead, clearNotification: clearQuoteNotification, clearOldReadNotifications } = useQuoteNotifications();
  const { profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const navigate = useNavigate();

  console.log('NotificationButton: notifications:', notifications);
  console.log('NotificationButton: unreadCount:', unreadCount);

  const handleNotificationClick = async (notification: any) => {
    console.log('NotificationButton: clicked notification:', notification);
    
    if (!notification.isRead) {
      await markAsRead(notification.id, notification.type);
    }
    
    setIsOpen(false);
    
    // Navigate based on notification type and user role
    switch (notification.type) {
      case 'message':
        // Navigate to jobs page for all users - messages are handled there
        if (notification.jobId) {
          navigate(`/jobs?openJob=${notification.jobId}`);
        } else {
          navigate('/jobs');
        }
        break;
      case 'quote':
        // Navigate to quotes section for handymen/contractors
        if (profile?.user_role === 'handyman' || profile?.user_role === 'contractor') {
          // Use notification ID as quote identifier
          navigate('/', { state: { activeTab: 'quotes', openQuote: notification.id } });
        } else {
          // For customers, navigate to bookings to see quote responses
          navigate('/', { state: { activeTab: 'bookings' } });
        }
        break;
      case 'job_request':
        // Navigate to jobs section based on user role
        if (profile?.user_role === 'customer') {
          navigate('/', { state: { activeTab: 'bookings' } });
        } else {
          // For providers, navigate to specific job if available
          if (notification.jobId) {
            navigate(`/jobs?openJob=${notification.jobId}`);
          } else {
            navigate('/jobs');
          }
        }
        break;
      case 'system':
        // Navigate based on jobId if available or user role
        if (notification.jobId) {
          if (profile?.user_role === 'customer') {
            navigate('/', { state: { activeTab: 'bookings' } });
          } else {
            navigate(`/jobs?openJob=${notification.jobId}`);
          }
        } else {
          // Navigate to appropriate dashboard based on user role
          if (profile?.user_role === 'property_manager') {
            navigate('/', { state: { activeTab: 'maintenance' } });
          } else if (profile?.user_role === 'handyman' || profile?.user_role === 'contractor') {
            navigate('/jobs');
          } else {
            navigate('/');
          }
        }
        break;
      default:
        // Default to home page
        navigate('/');
        break;
    }
    
    // Auto-clear the notification after navigation
    setTimeout(() => {
      if (notification.type === 'quote') {
        clearQuoteNotification(notification.id);
      } else {
        clearNotification(notification.id, notification.type);
      }
    }, 2000);
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all system and message notifications as read
      await markAllSystemAndMessagesAsRead();
      
      // Mark all quote notifications as read
      await markAllQuotesAsRead();
      
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleClearRead = () => {
    setShowOnlyUnread(!showOnlyUnread);
  };

  const handleClearOldRead = () => {
    clearOldReadNotifications();
    // Clear the specific stuck notification immediately
    clearQuoteNotification('a03915c8-87b6-46a8-9a3f-730d770c4560');
  };

  // Clear old notifications when dropdown opens
  const handleDropdownOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      clearOldReadNotifications();
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'job_request':
        return '🔨';
      case 'quote':
        return '💰';
      case 'system':
        return '🔔';
      default:
        return '📝';
    }
  };

  const getNotificationTitle = (notification: any) => {
    if (notification.type === 'message' && notification.senderName) {
      return `Message from ${notification.senderName}`;
    }
    return notification.title;
  };

  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="relative p-2">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
      </Button>
    );
  }

  // Filter notifications based on showOnlyUnread
  const filteredNotifications = showOnlyUnread 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2 hover:bg-gray-100 transition-colors duration-200">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 text-xs flex items-center justify-center p-0 min-w-[20px]"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 max-h-[500px]">
        <DropdownMenuLabel className="flex items-center justify-between sticky top-0 bg-white z-10">
          <span>Notifications</span>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} unread
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        
        {/* Action buttons */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="flex gap-1 p-2 sticky top-8 bg-white z-10">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="flex-1 text-xs h-7"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearRead}
                className="flex-1 text-xs h-7"
              >
                <X className="w-3 h-3 mr-1" />
                {showOnlyUnread ? 'Show all' : 'Hide read'}
              </Button>
            </div>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            {showOnlyUnread ? 'No unread notifications' : 'No notifications yet'}
          </div>
        ) : (
          <ScrollArea className="max-h-80">
            <div className="space-y-1">
              {filteredNotifications.slice(0, 20).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors mx-1 rounded ${
                    !notification.isRead ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className="text-lg flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${
                          !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {getNotificationTitle(notification)}
                        </p>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {filteredNotifications.length > 20 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-center text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
              onClick={() => navigate('/?tab=profile&section=notifications')}
            >
              View all notifications
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
