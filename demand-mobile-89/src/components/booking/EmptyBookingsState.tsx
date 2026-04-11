
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface EmptyBookingsStateProps {
  onBookNow: () => void;
}

export const EmptyBookingsState = ({ onBookNow }: EmptyBookingsStateProps) => {
  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="text-center py-12">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No bookings yet</h3>
        <p className="text-gray-500 mb-4">Schedule your first service appointment</p>
        <Button 
          onClick={onBookNow} 
          className="bg-green-600 hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};
