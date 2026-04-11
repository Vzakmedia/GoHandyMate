
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "lucide-react";
import { TechnicianCard } from './TechnicianCard';
import { PreviousTechnician } from './types';

interface PreviousTechniciansTabProps {
  technicians: PreviousTechnician[];
  loading: boolean;
  onViewCalendar: (technician: PreviousTechnician) => void;
  onSwitchToAllServices: () => void;
}

export const PreviousTechniciansTab = ({ 
  technicians, 
  loading, 
  onViewCalendar, 
  onSwitchToAllServices 
}: PreviousTechniciansTabProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (technicians.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Previous Technicians</h3>
          <p className="text-gray-500 mb-4">You haven't worked with any technicians yet or don't have any completed jobs.</p>
          <Button onClick={onSwitchToAllServices}>
            Find New Technician
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {technicians.map((technician) => (
        <TechnicianCard
          key={technician.id}
          technician={technician}
          onViewCalendar={onViewCalendar}
        />
      ))}

      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-8">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Don't see your preferred technician?</h3>
            <Button 
              onClick={onSwitchToAllServices}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              Find New Technician
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
