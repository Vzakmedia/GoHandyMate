
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp,
  MessageSquare,
  Settings,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HandymanQuickActionsProps {
  onTabChange: (tab: string) => void;
  onEarningsClick: () => void;
}

export const HandymanQuickActions = ({ onTabChange, onEarningsClick }: HandymanQuickActionsProps) => {
  const navigate = useNavigate();
  const quickActions = [
    {
      id: 'earnings',
      title: 'View Earnings',
      description: 'Track your income',
      icon: DollarSign,
      color: 'bg-green-500',
      action: onEarningsClick
    },
    {
      id: 'analytics',
      title: 'View Analytics',
      description: 'Track performance',
      icon: TrendingUp,
      color: 'bg-blue-500',
      action: onEarningsClick
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Client communications',
      icon: MessageSquare,
      color: 'bg-purple-500',
      action: () => navigate('/admin/chat')
    },
    {
      id: 'settings',
      title: 'Profile Settings',
      description: 'Update your profile',
      icon: Settings,
      color: 'bg-gray-500',
      action: () => onTabChange('profile')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:relative lg:border-0 lg:bg-transparent">
      {/* Mobile Quick Actions */}
      <div className="lg:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-white">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Button
                key={action.id}
                variant="ghost"
                size="sm"
                onClick={action.action}
                className="flex flex-col items-center space-y-1 p-2 sm:p-3 h-auto min-h-[60px] text-xs"
              >
                <div className={`p-1.5 sm:p-2 rounded-lg ${action.color} transition-colors`}>
                  <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-medium text-center leading-tight break-words">
                  {action.title}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Desktop Quick Actions */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-4 lg:p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={action.id}
                    variant="ghost"
                    onClick={action.action}
                    className="w-full justify-between p-3 lg:p-4 h-auto hover:bg-gray-50 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${action.color} transition-transform`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="font-medium text-sm lg:text-base truncate">{action.title}</div>
                        <div className="text-xs text-gray-500 truncate">{action.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
