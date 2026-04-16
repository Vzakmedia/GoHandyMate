
import { Home, Search, MessageSquare, User, Wrench, DollarSign, Building2, BarChart3, Calendar, LayoutDashboard, Briefcase, Crown } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';
import { useCustomerUpgrade } from '@/hooks/useCustomerUpgrade';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const { userRole } = useUserRole();
  const { isMobile, isTablet, isFoldable } = useResponsiveBreakpoints();
  const { isUpgraded } = useCustomerUpgrade();

  const customerTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Services', icon: Search },
    { id: 'community', label: 'Community', icon: MessageSquare },
    // Properties tab — visible only for upgraded customers
    ...(isUpgraded ? [{ id: 'property', label: 'Properties', icon: Building2 }] : []),
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const providerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const getTabsForRole = () => {
    switch (userRole) {
      case 'handyman':
      case 'provider': return providerTabs;
      case 'admin': return adminTabs;
      default: return customerTabs;
    }
  };

  const tabs = getTabsForRole();

  console.log('🔄 BottomNavigation: activeTab =', activeTab, 'userRole =', userRole, 'available tabs =', tabs.map(t => t.id));
  console.log('🔄 BottomNavigation: Tabs rendering, count =', tabs.length);

  // Responsive sizing based on device type
  const getResponsiveClasses = () => {
    if (isFoldable) {
      return {
        container: 'px-2 py-3',
        button: 'p-3 space-y-1',
        icon: 'w-6 h-6',
        text: 'text-xs font-medium'
      };
    } else if (isTablet) {
      return {
        container: 'px-4 py-3',
        button: 'p-4 space-y-1.5',
        icon: 'w-6 h-6',
        text: 'text-sm font-medium'
      };
    } else if (isMobile) {
      return {
        container: 'px-1 py-1.5',
        button: 'p-1.5 space-y-0.5',
        icon: 'w-4 h-4 xs:w-5 xs:h-5',
        text: 'text-[9px] xs:text-[10px] sm:text-xs font-medium'
      };
    } else {
      return {
        container: 'px-6 py-4',
        button: 'p-4 space-y-2',
        icon: 'w-6 h-6',
        text: 'text-sm font-medium'
      };
    }
  };

  const classes = getResponsiveClasses();

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 
      bg-background/95 backdrop-blur-md 
      border-t border-border z-50
      pb-[env(safe-area-inset-bottom)]
      ${classes.container}
    `}>
      <div className="flex justify-around items-center max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                console.log('🔄 BottomNavigation: Tab clicked:', tab.id, 'current activeTab:', activeTab);
                onTabChange(tab.id);
              }}
              className={`
                flex flex-col items-center transition-all duration-200 relative
                ${classes.button}
                ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-1 w-1.5 h-1.5 bg-primary rounded-full"></div>
              )}
              <Icon
                className={`${classes.icon} transition-colors duration-200`}
                style={{
                  color: isActive ? 'hsl(var(--primary))' : undefined
                }}
              />
              <span
                className={`${classes.text} transition-colors duration-200 ${isActive ? 'font-semibold' : ''}`}
                style={{
                  color: isActive ? 'hsl(var(--primary))' : undefined
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
