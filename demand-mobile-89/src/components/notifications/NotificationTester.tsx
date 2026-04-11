import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAudioNotifications } from '@/hooks/useAudioNotifications';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { toast } from 'sonner';
import { TestTube, Volume2, VolumeX, Briefcase, DollarSign, MessageSquare, AlertTriangle, Wrench, Bell } from 'lucide-react';

export const NotificationTester = () => {
  const { playJobRequestTone, playQuoteNotificationTone, playMessageTone, isEnabled, volume } = useAudioNotifications();
  const { preferences, shouldPlayNotification } = useNotificationPreferences();

  const testNotification = (type: string, soundFunc: () => void, description: string) => {
    console.log(`🧪 Testing ${type} notification`);
    console.log(`Audio enabled: ${isEnabled}, volume: ${volume}, should play: ${shouldPlayNotification(type)}`);
    
    if (shouldPlayNotification(type)) {
      soundFunc();
      toast.success(`${type} Sound Test`, {
        description: `Playing ${description} at ${Math.round(volume * 100)}% volume`,
        duration: 2000,
      });
    } else {
      toast.info(`${type} Sound Disabled`, {
        description: `${description} notifications are currently disabled`,
        duration: 2000,
      });
    }
  };

  const tests = [
    {
      type: 'job_request',
      label: 'Job Request',
      icon: Briefcase,
      sound: playJobRequestTone,
      description: 'Job request notification'
    },
    {
      type: 'quote_request',
      label: 'Quote Request',
      icon: DollarSign,
      sound: playQuoteNotificationTone,
      description: 'Quote request notification'
    },
    {
      type: 'quote',
      label: 'Quote Response',
      icon: DollarSign,
      sound: playQuoteNotificationTone,
      description: 'Quote response notification'
    },
    {
      type: 'message',
      label: 'Message',
      icon: MessageSquare,
      sound: playMessageTone,
      description: 'Message notification'
    },
    {
      type: 'emergency',
      label: 'Emergency',
      icon: AlertTriangle,
      sound: playJobRequestTone,
      description: 'Emergency notification'
    },
    {
      type: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      sound: playJobRequestTone,
      description: 'Maintenance notification'
    },
    {
      type: 'system',
      label: 'System',
      icon: Bell,
      sound: playMessageTone,
      description: 'System notification'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Notification Sound Tester
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Test all notification sounds to ensure they're working correctly
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Status */}
        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
          {isEnabled ? <Volume2 className="w-4 h-4 text-green-600" /> : <VolumeX className="w-4 h-4 text-red-500" />}
          <span className="text-sm">
            Audio: {isEnabled ? `Enabled (${Math.round(volume * 100)}%)` : 'Disabled'}
          </span>
        </div>

        {/* Test Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tests.map((test) => {
            const IconComponent = test.icon;
            const canPlay = shouldPlayNotification(test.type);
            
            return (
              <Button
                key={test.type}
                variant={canPlay ? "outline" : "secondary"}
                onClick={() => testNotification(test.type, test.sound, test.description)}
                className="flex flex-col items-center gap-2 h-auto p-4"
                disabled={!isEnabled}
              >
                <IconComponent className={`w-5 h-5 ${canPlay ? 'text-primary' : 'text-muted-foreground'}`} />
                <span className="text-xs">{test.label}</span>
                {!canPlay && (
                  <span className="text-xs text-muted-foreground">(Disabled)</span>
                )}
              </Button>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Testing Instructions:</p>
          <ul className="space-y-1">
            <li>• Ensure your browser allows audio playback</li>
            <li>• Check that notification types are enabled in settings</li>
            <li>• Different sounds indicate different notification types</li>
            <li>• Disabled notifications won't play sounds</li>
          </ul>
        </div>

        {/* Debug Info */}
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">Debug Information</summary>
          <div className="mt-2 p-2 bg-muted/30 rounded text-xs font-mono">
            <div>Audio Enabled: {String(isEnabled)}</div>
            <div>Volume: {volume}</div>
            <div>Preferences Loaded: {String(!!preferences)}</div>
            <div>Audio Preferences: {String(preferences?.audio_enabled)}</div>
            <div>Job Notifications: {String(preferences?.job_notifications)}</div>
            <div>Quote Notifications: {String(preferences?.quote_notifications)}</div>
            <div>Message Notifications: {String(preferences?.message_notifications)}</div>
          </div>
        </details>
      </CardContent>
    </Card>
  );
};