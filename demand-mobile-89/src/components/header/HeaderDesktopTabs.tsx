import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  MessageSquare,
  User,
  Briefcase,
  DollarSign,
  LayoutDashboard
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface HeaderDesktopTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const HeaderDesktopTabs = ({ activeTab, onTabChange }: HeaderDesktopTabsProps) => {
  const { userRole } = useUserRole();

  const customerTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Services', icon: Search },
    { id: 'community', label: 'Community', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handymanTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // contractorTabs and propertyManagerTabs removed — those roles are archived

  const getTabsForRole = () => {
    switch (userRole) {
      case 'handyman':
        return handymanTabs;
      // contractor and property_manager cases removed — those roles are archived
      default:
        return customerTabs;
    }
  };

  const tabs = getTabsForRole();

  return (
    <nav className="hidden lg:flex items-center space-x-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Button
            key={tab.id}
            variant={isActive ? 'default' : 'ghost'}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium"
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </Button>
        );
      })}
    </nav>
  );
};