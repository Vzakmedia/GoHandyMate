import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/navigation/BackButton';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Calendar, Clock, Save, Loader2 } from 'lucide-react';

interface ScheduleEntry {
  id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  notes?: string;
}

export const SchedulePage = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'
  ];

  const fetchSchedule = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('handyman-schedule', {
        body: { 
          userId: user.id,
          action: 'get'
        }
      });

      if (error) throw error;
      
      // Initialize schedule if none exists
      if (!data || data.length === 0) {
        const defaultSchedule = daysOfWeek.map(day => ({
          day_of_week: day,
          start_time: '09:00',
          end_time: '17:00',
          is_available: true,
          notes: ''
        }));
        setSchedule(defaultSchedule);
      } else {
        // Ensure all days are represented
        const existingDays = data.map((entry: ScheduleEntry) => entry.day_of_week);
        const completeSchedule = daysOfWeek.map(day => {
          const existing = data.find((entry: ScheduleEntry) => entry.day_of_week === day);
          return existing || {
            day_of_week: day,
            start_time: '09:00',
            end_time: '17:00',
            is_available: true,
            notes: ''
          };
        });
        setSchedule(completeSchedule);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [user]);

  const updateScheduleEntry = (dayIndex: number, field: keyof ScheduleEntry, value: any) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      [field]: value
    };
    setSchedule(updatedSchedule);
  };

  const saveSchedule = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('handyman-schedule', {
        body: { 
          userId: user.id,
          action: 'update',
          scheduleData: schedule
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success('Schedule updated successfully!');
      } else {
        toast.error(data.error || 'Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Schedule</h1>
          <p className="text-gray-600">Set your availability and working hours</p>
        </div>
        <BackButton />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Weekly Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {schedule.map((entry, index) => (
            <div key={entry.day_of_week} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{entry.day_of_week}</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`available-${index}`}>Available</Label>
                  <input
                    id={`available-${index}`}
                    type="checkbox"
                    checked={entry.is_available}
                    onChange={(e) => updateScheduleEntry(index, 'is_available', e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>
              </div>

              {entry.is_available && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`start-${index}`}>Start Time</Label>
                    <Input
                      id={`start-${index}`}
                      type="time"
                      value={entry.start_time}
                      onChange={(e) => updateScheduleEntry(index, 'start_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`end-${index}`}>End Time</Label>
                    <Input
                      id={`end-${index}`}
                      type="time"
                      value={entry.end_time}
                      onChange={(e) => updateScheduleEntry(index, 'end_time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`notes-${index}`}>Notes</Label>
                    <Input
                      id={`notes-${index}`}
                      placeholder="Special notes..."
                      value={entry.notes || ''}
                      onChange={(e) => updateScheduleEntry(index, 'notes', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {!entry.is_available && (
                <div className="text-center p-4 bg-gray-50 rounded">
                  <Badge variant="secondary">Not Available</Badge>
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button 
              onClick={saveSchedule}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? 'Saving...' : 'Save Schedule'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
