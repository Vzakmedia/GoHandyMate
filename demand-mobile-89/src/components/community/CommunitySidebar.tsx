import { useState } from 'react';
import { 
  Settings, 
  Zap, 
  Bot, 
  Database, 
  Code, 
  Users, 
  Heart, 
  MessageSquare,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Activity,
  Server,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAutomationActions } from '@/hooks/useAutomationActions';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CommunitySidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const CommunitySidebar = ({ isCollapsed, onToggle }: CommunitySidebarProps) => {
  const [activeTab, setActiveTab] = useState<'automations' | 'functions' | 'analytics'>('automations');
  const [automationSettings, setAutomationSettings] = useState({
    autoModeration: true,
    smartNotifications: false,
    contentBoost: true,
    scheduledPosts: false
  });
  const { triggeringJobs, triggerJob, triggerDatabaseCleanup, generateReports } = useAutomationActions();
  const { toast } = useToast();

  const handleAutomationToggle = (key: keyof typeof automationSettings) => {
    setAutomationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    toast({
      title: "Setting Updated",
      description: `${key} has been ${automationSettings[key] ? 'disabled' : 'enabled'}`,
    });
  };

  const handleEdgeFunctionTrigger = async (functionName: string) => {
    const success = await triggerJob(functionName, functionName);
    if (success) {
      toast({
        title: "Function Triggered",
        description: `${functionName} executed successfully`,
      });
    }
  };

  const sidebarTabs = [
    { id: 'automations', label: 'Automations', icon: Zap },
    { id: 'functions', label: 'Edge Functions', icon: Code },
    { id: 'analytics', label: 'Analytics', icon: Activity }
  ];

  const edgeFunctions = [
    { name: 'get-professionals', label: 'Get Professionals', description: 'Fetch verified professionals' },
    { name: 'ad-automation', label: 'Ad Automation', description: 'Automated ad management' },
    { name: 'booking-request', label: 'Booking System', description: 'Handle booking requests' },
    { name: 'admin-cleanup-expired-ads', label: 'Cleanup Ads', description: 'Remove expired advertisements' },
    { name: 'optimize-ad-performance', label: 'Optimize Ads', description: 'Improve ad performance' }
  ];

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-10 h-10"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
        
        {sidebarTabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "ghost"}
            size="icon"
            onClick={() => setActiveTab(tab.id as any)}
            className="w-10 h-10"
          >
            <tab.icon className="w-5 h-5" />
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Community Control</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-8 h-8"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-4 bg-gray-100 rounded-lg p-1">
          {sidebarTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1 text-xs"
            >
              <tab.icon className="w-3 h-3 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'automations' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Community Automations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Auto Moderation</span>
                  </div>
                  <Switch
                    checked={automationSettings.autoModeration}
                    onCheckedChange={() => handleAutomationToggle('autoModeration')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Smart Notifications</span>
                  </div>
                  <Switch
                    checked={automationSettings.smartNotifications}
                    onCheckedChange={() => handleAutomationToggle('smartNotifications')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Content Boost</span>
                  </div>
                  <Switch
                    checked={automationSettings.contentBoost}
                    onCheckedChange={() => handleAutomationToggle('contentBoost')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Scheduled Posts</span>
                  </div>
                  <Switch
                    checked={automationSettings.scheduledPosts}
                    onCheckedChange={() => handleAutomationToggle('scheduledPosts')}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">System Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={triggerDatabaseCleanup}
                  disabled={triggeringJobs.has('database-cleanup')}
                  className="w-full justify-start text-xs"
                >
                  <Database className="w-3 h-3 mr-2" />
                  {triggeringJobs.has('database-cleanup') ? 'Cleaning...' : 'Clean Database'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateReports}
                  disabled={triggeringJobs.has('generate-reports')}
                  className="w-full justify-start text-xs"
                >
                  <Activity className="w-3 h-3 mr-2" />
                  {triggeringJobs.has('generate-reports') ? 'Generating...' : 'Generate Reports'}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'functions' && (
          <div className="space-y-3">
            {edgeFunctions.map((func) => (
              <Card key={func.name} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Server className="w-3 h-3 text-blue-500" />
                      <span className="text-sm font-medium">{func.label}</span>
                      <Badge variant="secondary" className="text-xs">
                        {triggeringJobs.has(func.name) ? 'Running' : 'Ready'}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{func.description}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdgeFunctionTrigger(func.name)}
                    disabled={triggeringJobs.has(func.name)}
                    className="ml-2"
                  >
                    {triggeringJobs.has(func.name) ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Real-time Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">24</div>
                    <div className="text-xs text-gray-500">Active Users</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">156</div>
                    <div className="text-xs text-gray-500">Messages Today</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">89%</div>
                    <div className="text-xs text-gray-500">Engagement</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">12</div>
                    <div className="text-xs text-gray-500">New Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Refresh Data
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                  <Layers className="w-3 h-3 mr-2" />
                  Export Analytics
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};