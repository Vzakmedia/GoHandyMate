
import { CustomerDashboard } from "./customer/dashboard/CustomerDashboard";
import { MyBookings } from "@/components/MyBookings";
import { CustomerMessagingHub } from "@/components/customer/CustomerMessagingHub";
import { SearchTabContent } from "@/components/customer-tabs/SearchTabContent";
import { CommunityTabContent } from "@/components/customer-tabs/CommunityTabContent";
import { ProfileTabContent } from "@/components/customer-tabs/ProfileTabContent";
import { AuthScreen } from "@/features/auth";
import { useState } from "react";
import { useAuth } from '@/features/auth';
import { useNavigate } from "react-router-dom";

interface CustomerTabContentProps {
  activeTab: string;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  onTabChange?: (tab: string) => void;
  mockTasks: Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    location: string;
    timeAgo: string;
    taskerCount: number;
    urgency: string;
  }>;
}

export const CustomerTabContent = ({
  activeTab,
  selectedCategory,
  setSelectedCategory,
  onTabChange,
  mockTasks
}: CustomerTabContentProps) => {
  const [showBookings, setShowBookings] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleBackToHome = () => {
    setShowBookings(false);
    if (onTabChange) {
      onTabChange('home');
    }
  };

  const handleBackToSelection = () => {
    navigate('/', { replace: true });
  };

  const handleProtectedAction = (action: () => void) => {
    if (user) {
      action();
    } else {
      action();
    }
  };

  // Require authentication for ALL customer app areas
  if (!user) {
    return <AuthScreen onBack={handleBackToSelection} />;
  }

  switch (activeTab) {
    case 'search':
    case 'services':
      return <SearchTabContent onProtectedAction={handleProtectedAction} />;

    case 'bookings':
      return (
        <div className="px-4 py-6">
          <MyBookings onBack={handleBackToHome} />
        </div>
      );

    case 'messages':
      return (
        <div className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Messages</h2>
            <p className="text-gray-600">Chat with your assigned handymen</p>
          </div>
          <CustomerMessagingHub />
        </div>
      );

    case 'community':
      return <CommunityTabContent onShowAuth={() => { }} />;

    case 'profile':
      return <ProfileTabContent onShowAuth={() => { }} />;

    default:
    case 'home':
      return (
        <CustomerDashboard
          onTabChange={onTabChange || (() => {})}
          mockTasks={mockTasks}
        />
      );
  }
};
