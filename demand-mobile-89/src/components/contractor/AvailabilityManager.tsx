
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft, Save, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContractorSync } from '@/hooks/useContractorSync';

interface AvailabilityManagerProps {
  onBack: () => void;
}

export const AvailabilityManager = ({ onBack }: AvailabilityManagerProps) => {
  const { toast } = useToast();
  const { updateAvailability, loading } = useContractorSync();

  const [businessHours, setBusinessHours] = useState({
    monday: { open: '07:00', close: '18:00', closed: false },
    tuesday: { open: '07:00', close: '18:00', closed: false },
    wednesday: { open: '07:00', close: '18:00', closed: false },
    thursday: { open: '07:00', close: '18:00', closed: false },
    friday: { open: '07:00', close: '18:00', closed: false },
    saturday: { open: '08:00', close: '16:00', closed: false },
    sunday: { open: '09:00', close: '15:00', closed: true }
  });

  const [vacationDays, setVacationDays] = useState([
    { id: 1, startDate: '2024-07-15', endDate: '2024-07-22', reason: 'Summer vacation' },
    { id: 2, startDate: '2024-12-23', endDate: '2024-12-31', reason: 'Holiday break' }
  ]);

  const [newVacation, setNewVacation] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  const [showVacationForm, setShowVacationForm] = useState(false);

  const dayNames = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday'
  };

  const updateBusinessHour = (day: string, field: string, value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const addVacationPeriod = () => {
    if (!newVacation.startDate || !newVacation.endDate || !newVacation.reason) {
      toast({
        title: "Error",
        description: "Please fill in all vacation details",
        variant: "destructive",
      });
      return;
    }

    const vacation = {
      id: vacationDays.length + 1,
      ...newVacation
    };

    setVacationDays([...vacationDays, vacation]);
    setNewVacation({ startDate: '', endDate: '', reason: '' });
    setShowVacationForm(false);

    toast({
      title: "Success",
      description: "Vacation period added successfully",
    });
  };

  const removeVacationPeriod = (id: number) => {
    setVacationDays(vacationDays.filter(vacation => vacation.id !== id));
    toast({
      title: "Success",
      description: "Vacation period removed",
    });
  };

  const handleSave = async () => {
    try {
      await updateAvailability({
        businessHours,
        vacationDays
      });

      toast({
        title: "Success",
        description: "Availability updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Availability Manager
          </h2>
          <p className="text-gray-600">Set your business hours and vacation schedule</p>
        </div>
      </div>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-600" />
            Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(dayNames).map(([key, dayName]) => (
            <div key={key} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                <Label className="font-medium">{dayName}</Label>
              </div>
              
              <div className="col-span-2 flex items-center space-x-2">
                <Switch
                  checked={!businessHours[key as keyof typeof businessHours].closed}
                  onCheckedChange={(checked) => updateBusinessHour(key, 'closed', !checked)}
                />
                <span className="text-sm text-gray-600">
                  {businessHours[key as keyof typeof businessHours].closed ? 'Closed' : 'Open'}
                </span>
              </div>

              {!businessHours[key as keyof typeof businessHours].closed && (
                <>
                  <div className="col-span-3">
                    <Label className="text-sm text-gray-600">Open</Label>
                    <Input
                      type="time"
                      value={businessHours[key as keyof typeof businessHours].open}
                      onChange={(e) => updateBusinessHour(key, 'open', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label className="text-sm text-gray-600">Close</Label>
                    <Input
                      type="time"
                      value={businessHours[key as keyof typeof businessHours].close}
                      onChange={(e) => updateBusinessHour(key, 'close', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Vacation/Time Off */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Vacation & Time Off</CardTitle>
            <Button onClick={() => setShowVacationForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Vacation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showVacationForm && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-medium mb-3">Add Vacation Period</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newVacation.startDate}
                    onChange={(e) => setNewVacation({...newVacation, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newVacation.endDate}
                    onChange={(e) => setNewVacation({...newVacation, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Input
                    id="reason"
                    value={newVacation.reason}
                    onChange={(e) => setNewVacation({...newVacation, reason: e.target.value})}
                    placeholder="e.g., Summer vacation"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={addVacationPeriod} size="sm">Add</Button>
                <Button variant="outline" onClick={() => setShowVacationForm(false)} size="sm">Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {vacationDays.map((vacation) => (
              <div key={vacation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{vacation.reason}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(vacation.startDate).toLocaleDateString()} - {new Date(vacation.endDate).toLocaleDateString()}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeVacationPeriod(vacation.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {vacationDays.length === 0 && !showVacationForm && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p>No vacation periods scheduled</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-green-100 text-green-800 mb-2">Currently Available</Badge>
              <p className="text-sm text-gray-600">
                Next scheduled time off: {vacationDays.length > 0 ? new Date(vacationDays[0].startDate).toLocaleDateString() : 'None scheduled'}
              </p>
            </div>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
