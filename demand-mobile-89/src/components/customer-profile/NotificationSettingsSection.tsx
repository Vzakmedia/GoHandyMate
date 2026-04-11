
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

interface NotificationSettingsSectionProps {
  notifications: NotificationSettings;
  onNotificationChange: (key: string, value: boolean) => void;
}

export const NotificationSettingsSection = ({
  notifications,
  onNotificationChange
}: NotificationSettingsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-gray-500">Receive booking confirmations and updates via email</p>
          </div>
          <Switch
            checked={notifications.emailNotifications}
            onCheckedChange={(checked) => onNotificationChange('emailNotifications', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-gray-500">Get real-time updates on your device</p>
          </div>
          <Switch
            checked={notifications.pushNotifications}
            onCheckedChange={(checked) => onNotificationChange('pushNotifications', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>SMS Notifications</Label>
            <p className="text-sm text-gray-500">Receive important updates via text message</p>
          </div>
          <Switch
            checked={notifications.smsNotifications}
            onCheckedChange={(checked) => onNotificationChange('smsNotifications', checked)}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Marketing Emails</Label>
            <p className="text-sm text-gray-500">Receive promotions and special offers</p>
          </div>
          <Switch
            checked={notifications.marketingEmails}
            onCheckedChange={(checked) => onNotificationChange('marketingEmails', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
