
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SetAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetAvailabilityModal = ({ isOpen, onClose }: SetAvailabilityModalProps) => {
  const [workDays, setWorkDays] = useState({
    monday: { enabled: true, start: "08:00", end: "17:00" },
    tuesday: { enabled: true, start: "08:00", end: "17:00" },
    wednesday: { enabled: true, start: "08:00", end: "17:00" },
    thursday: { enabled: true, start: "08:00", end: "17:00" },
    friday: { enabled: true, start: "08:00", end: "17:00" },
    saturday: { enabled: true, start: "09:00", end: "15:00" },
    sunday: { enabled: false, start: "10:00", end: "14:00" }
  });

  const [emergencyAvailable, setEmergencyAvailable] = useState(false);
  const [sameDayBooking, setSameDayBooking] = useState(true);
  const [advanceBookingDays, setAdvanceBookingDays] = useState("30");
  const [workRadius, setWorkRadius] = useState("25");

  const handleDayToggle = (day: string, enabled: boolean) => {
    setWorkDays(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], enabled }
    }));
  };

  const handleTimeChange = (day: string, timeType: 'start' | 'end', value: string) => {
    setWorkDays(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], [timeType]: value }
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would typically save to your backend/database
      toast.success("Availability settings updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update availability. Please try again.");
    }
  };

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Set Your Availability</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Weekly Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Weekly Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(dayNames).map(([key, dayName]) => (
                <div key={key} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="w-24">
                    <Switch
                      checked={workDays[key as keyof typeof workDays].enabled}
                      onCheckedChange={(enabled) => handleDayToggle(key, enabled)}
                    />
                    <Label className="ml-2 font-medium">{dayName}</Label>
                  </div>
                  
                  {workDays[key as keyof typeof workDays].enabled && (
                    <div className="flex items-center space-x-2 flex-1">
                      <div>
                        <Label className="text-xs text-gray-500">Start</Label>
                        <Input
                          type="time"
                          value={workDays[key as keyof typeof workDays].start}
                          onChange={(e) => handleTimeChange(key, 'start', e.target.value)}
                          className="w-24"
                        />
                      </div>
                      <span className="text-gray-400">to</span>
                      <div>
                        <Label className="text-xs text-gray-500">End</Label>
                        <Input
                          type="time"
                          value={workDays[key as keyof typeof workDays].end}
                          onChange={(e) => handleTimeChange(key, 'end', e.target.value)}
                          className="w-24"
                        />
                      </div>
                      <div className="text-sm text-gray-500 ml-4">
                        {(() => {
                          const start = new Date(`2000-01-01T${workDays[key as keyof typeof workDays].start}`);
                          const end = new Date(`2000-01-01T${workDays[key as keyof typeof workDays].end}`);
                          const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                          return `${hours} hours`;
                        })()}
                      </div>
                    </div>
                  )}
                  
                  {!workDays[key as keyof typeof workDays].enabled && (
                    <div className="text-gray-400 italic">Not available</div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Service Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Emergency Availability</Label>
                      <p className="text-sm text-gray-500">Available for urgent jobs outside normal hours</p>
                    </div>
                    <Switch
                      checked={emergencyAvailable}
                      onCheckedChange={setEmergencyAvailable}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Same Day Booking</Label>
                      <p className="text-sm text-gray-500">Accept jobs scheduled for today</p>
                    </div>
                    <Switch
                      checked={sameDayBooking}
                      onCheckedChange={setSameDayBooking}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="advanceBooking">Advance Booking (days)</Label>
                    <Input
                      id="advanceBooking"
                      type="number"
                      value={advanceBookingDays}
                      onChange={(e) => setAdvanceBookingDays(e.target.value)}
                      min="1"
                      max="90"
                    />
                    <p className="text-xs text-gray-500 mt-1">How far in advance customers can book</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="workRadius">Work Radius (miles)</Label>
                    <Input
                      id="workRadius"
                      type="number"
                      value={workRadius}
                      onChange={(e) => setWorkRadius(e.target.value)}
                      min="5"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum distance you'll travel for jobs</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span>Availability Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {Object.values(workDays).filter(day => day.enabled).length}
                  </div>
                  <div className="text-sm text-gray-600">Working Days/Week</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{workRadius} mi</div>
                  <div className="text-sm text-gray-600">Service Radius</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {emergencyAvailable ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-600">Emergency Available</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Availability
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
