
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Calendar, Clock, Save, Plus, X } from 'lucide-react';

interface ScheduleEntry {
  id?: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  notes?: string;
}

export const AvailabilityTab = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const daysOfWeek = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 
    'Friday', 'Saturday', 'Sunday'
  ];

  useEffect(() => {
    if (user) {
      fetchSchedule();
    }
  }, [user]);

  const fetchSchedule = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'get_availability_slots',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      });

      if (error) throw error;
      
      // Initialize schedule if none exists
      if (!data?.slots || data.slots.length === 0) {
        const defaultSchedule = daysOfWeek.map(day => ({
          day_of_week: day,
          start_time: '09:00',
          end_time: '17:00',
          is_available: day !== 'Sunday',
          notes: ''
        }));
        setSchedule(defaultSchedule);
      } else {
        // Convert slots to schedule format
        const scheduleMap = new Map();
        data.slots.forEach((slot: any) => {
          const dayName = new Date(slot.date).toLocaleDateString('en-US', { weekday: 'long' });
          if (!scheduleMap.has(dayName)) {
            scheduleMap.set(dayName, {
              day_of_week: dayName,
              start_time: slot.start_time,
              end_time: slot.end_time,
              is_available: true,
              notes: slot.notes || ''
            });
          }
        });
        
        const completeSchedule = daysOfWeek.map(day => 
          scheduleMap.get(day) || {
            day_of_week: day,
            start_time: '09:00',
            end_time: '17:00',
            is_available: false,
            notes: ''
          }
        );
        setSchedule(completeSchedule);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

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
      // Convert schedule to slots format
      const slots = schedule
        .filter(entry => entry.is_available)
        .map(entry => ({
          date: getNextDateForDay(entry.day_of_week),
          start_time: entry.start_time,
          end_time: entry.end_time,
          slot_type: 'regular',
          notes: entry.notes || ''
        }));

      const { data, error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'update_availability_slots',
          slots
        }
      });

      if (error) throw error;
      
      if (data?.success) {
        toast.success('Schedule updated successfully!');
        setIsEditing(false);
      } else {
        toast.error('Failed to save schedule');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const getNextDateForDay = (dayName: string): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDay = days.indexOf(dayName);
    const today = new Date();
    const currentDay = today.getDay();
    let daysToAdd = targetDay - currentDay;
    if (daysToAdd <= 0) daysToAdd += 7;
    
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + daysToAdd);
    return targetDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Weekly Availability</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={saveSchedule}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Schedule'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Schedule
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {schedule.map((entry, index) => (
            <div key={entry.day_of_week} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{entry.day_of_week}</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor={`available-${index}`}>Available</Label>
                  <Switch
                    id={`available-${index}`}
                    checked={entry.is_available}
                    onCheckedChange={(checked) => updateScheduleEntry(index, 'is_available', checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {entry.is_available ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`start-${index}`}>Start Time</Label>
                    <Input
                      id={`start-${index}`}
                      type="time"
                      value={entry.start_time}
                      onChange={(e) => updateScheduleEntry(index, 'start_time', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`end-${index}`}>End Time</Label>
                    <Input
                      id={`end-${index}`}
                      type="time"
                      value={entry.end_time}
                      onChange={(e) => updateScheduleEntry(index, 'end_time', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`notes-${index}`}>Notes</Label>
                    <Input
                      id={`notes-${index}`}
                      placeholder="Special notes..."
                      value={entry.notes || ''}
                      onChange={(e) => updateScheduleEntry(index, 'notes', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 bg-gray-50 rounded">
                  <Badge variant="secondary">Not Available</Badge>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => {
                const updated = schedule.map(entry => ({ ...entry, is_available: true }));
                setSchedule(updated);
              }}
              disabled={!isEditing}
            >
              <Plus className="w-4 h-4 mr-2" />
              Enable All Days
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => {
                const updated = schedule.map(entry => ({ 
                  ...entry, 
                  start_time: '09:00', 
                  end_time: '17:00' 
                }));
                setSchedule(updated);
              }}
              disabled={!isEditing}
            >
              <Clock className="w-4 h-4 mr-2" />
              Set Standard Hours (9-5)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
