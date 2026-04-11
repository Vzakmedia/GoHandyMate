
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAudioNotifications } from '@/hooks/useAudioNotifications';
import { Volume2, VolumeX, Bell, MessageSquare, Briefcase } from 'lucide-react';

export const NotificationSettings = () => {
  const {
    playJobRequestTone,
    playQuoteNotificationTone,
    playMessageTone,
    isEnabled,
    setIsEnabled,
    volume,
    setVolume
  } = useAudioNotifications();

  const [localVolume, setLocalVolume] = useState([volume * 100]);

  const handleVolumeChange = (newVolume: number[]) => {
    setLocalVolume(newVolume);
    setVolume(newVolume[0] / 100);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Audio Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isEnabled ? (
              <Volume2 className="w-5 h-5 text-green-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
            <Label htmlFor="notifications-enabled">
              Enable Audio Notifications
            </Label>
          </div>
          <Switch
            id="notifications-enabled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
        </div>

        {/* Volume Control */}
        {isEnabled && (
          <div className="space-y-3">
            <Label>Volume: {Math.round(localVolume[0])}%</Label>
            <Slider
              value={localVolume}
              onValueChange={handleVolumeChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
          </div>
        )}

        {/* Test Sounds */}
        {isEnabled && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Test Notification Sounds:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={playJobRequestTone}
                className="flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                Job Alert
              </Button>
              <Button
                variant="outline"
                onClick={playQuoteNotificationTone}
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Quote Alert
              </Button>
              <Button
                variant="outline"
                onClick={playMessageTone}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Message Alert
              </Button>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Audio Notifications:</p>
          <ul className="space-y-1 text-xs">
            <li>• Job alerts play when new jobs are available</li>
            <li>• Quote alerts play when customers receive quotes</li>
            <li>• Message alerts play for new messages</li>
            <li>• Notifications respect your browser's audio permissions</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
