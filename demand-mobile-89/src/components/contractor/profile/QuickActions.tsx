
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';

interface QuickActionsProps {
  onShowAvailability: () => void;
  onShowTeamManagement: () => void;
}

export const QuickActions = ({
  onShowAvailability,
  onShowTeamManagement
}: QuickActionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onShowAvailability}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Update Availability
        </Button>
        <Button 
          onClick={onShowTeamManagement}
          variant="outline" 
          className="w-full"
        >
          <Users className="w-4 h-4 mr-2" />
          Manage Team
        </Button>
      </CardContent>
    </Card>
  );
};
