import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  Calendar, 
  Bell, 
  Zap, 
  FileText, 
  DollarSign, 
  Settings,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useQuoteAutomation } from '@/hooks/useQuoteAutomation';

export const QuoteAutomationSettings = () => {
  const { 
    settings, 
    reminders, 
    loading, 
    saveSettings,
    scheduleQuoteFollowUp,
    getQuoteTemplate,
    getSuggestedPricing 
  } = useQuoteAutomation();

  const [testingFeature, setTestingFeature] = useState<string | null>(null);

  const handleToggleSetting = async (key: keyof typeof settings, value: boolean) => {
    await saveSettings({ [key]: value });
  };

  const handleNumberChange = async (key: keyof typeof settings, value: number) => {
    await saveSettings({ [key]: value });
  };

  const testAutomationFeature = async (feature: string) => {
    setTestingFeature(feature);
    
    try {
      switch (feature) {
        case 'followUp':
          await scheduleQuoteFollowUp('demo-quote-123', 'client@example.com');
          break;
        case 'template':
          const template = await getQuoteTemplate('plumbing', 'medium');
          if (template) {
            console.log('Template loaded:', template);
          }
          break;
        case 'pricing':
          const pricing = await getSuggestedPricing('plumbing', 'New York', {});
          if (pricing) {
            console.log('Smart pricing:', pricing);
          }
          break;
      }
    } finally {
      setTestingFeature(null);
    }
  };

  const automationFeatures = [
    {
      id: 'autoFollowUp',
      title: 'Auto Follow-up',
      description: 'Automatically schedule follow-ups for pending quotes',
      icon: Bell,
      setting: 'autoFollowUp',
      hasConfig: true,
      configKey: 'followUpDays',
      configLabel: 'Days until follow-up',
      testAction: 'followUp'
    },
    {
      id: 'autoExpiration',
      title: 'Quote Expiration',
      description: 'Automatically expire old quotes and notify clients',
      icon: Clock,
      setting: 'autoExpiration',
      hasConfig: true,
      configKey: 'expirationDays',
      configLabel: 'Days until expiration',
      testAction: 'expiration'
    },
    {
      id: 'autoTemplatePopulation',
      title: 'Template Auto-Population',
      description: 'Auto-fill quotes using saved templates',
      icon: FileText,
      setting: 'autoTemplatePopulation',
      hasConfig: false,
      testAction: 'template'
    },
    {
      id: 'smartPricing',
      title: 'Smart Pricing Suggestions',
      description: 'Get AI-powered pricing recommendations',
      icon: DollarSign,
      setting: 'smartPricing',
      hasConfig: false,
      testAction: 'pricing'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Quote Automation</CardTitle>
              <CardDescription>
                Streamline your quote process with smart automation features
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Automation Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {automationFeatures.map((feature) => (
          <Card key={feature.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <feature.icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </div>
                </div>
                <Switch
                  checked={settings[feature.setting as keyof typeof settings] as boolean}
                  onCheckedChange={(checked) => 
                    handleToggleSetting(feature.setting as keyof typeof settings, checked)
                  }
                  disabled={loading}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Configuration */}
              {feature.hasConfig && settings[feature.setting as keyof typeof settings] && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {feature.configLabel}
                  </Label>
                  <Input
                    type="number"
                    value={settings[feature.configKey as keyof typeof settings] as number}
                    onChange={(e) => 
                      handleNumberChange(
                        feature.configKey as keyof typeof settings, 
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-20"
                    min="1"
                    max="365"
                  />
                </div>
              )}

              {/* Test Button */}
              {settings[feature.setting as keyof typeof settings] && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testAutomationFeature(feature.testAction)}
                  disabled={testingFeature === feature.testAction}
                  className="w-full"
                >
                  {testingFeature === feature.testAction ? (
                    <>
                      <Settings className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Test Feature
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Reminders */}
      {reminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-orange-600" />
              Active Reminders
            </CardTitle>
            <CardDescription>
              Scheduled automation tasks and reminders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reminders.slice(0, 5).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-orange-100 rounded-full">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{reminder.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(reminder.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {reminder.type.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
              {reminders.length > 5 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  +{reminders.length - 5} more reminders
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(settings).filter(Boolean).length}
            </div>
            <div className="text-sm text-gray-600">Active Features</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {reminders.length}
            </div>
            <div className="text-sm text-gray-600">Pending Tasks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {settings.followUpDays}
            </div>
            <div className="text-sm text-gray-600">Follow-up Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {settings.expirationDays}
            </div>
            <div className="text-sm text-gray-600">Expiry Days</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};