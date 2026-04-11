
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, Zap, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ScheduleEntry {
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  notes?: string;
}

interface AvailabilitySlot {
  id?: string;
  date: string;
  start_time: string;
  end_time: string;
  slot_type: 'regular' | 'same_day' | 'emergency';
  is_booked: boolean;
  price_multiplier: number;
  notes?: string;
}

export const EnhancedScheduleManager = ({ isEditing }: { isEditing: boolean }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleEntry[]>([]);
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (user) {
      fetchWeeklySchedule();
      if (selectedDate) {
        fetchAvailabilitySlots();
      }
    }
  }, [user, selectedDate]);

  const fetchWeeklySchedule = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('handyman-schedule', {
        body: { 
          userId: user?.id,
          action: 'get'
        }
      });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        const defaultSchedule = daysOfWeek.map(day => ({
          day_of_week: day,
          start_time: '08:00',
          end_time: '18:00',
          is_available: true,
          notes: ''
        }));
        setWeeklySchedule(defaultSchedule);
      } else {
        const completeSchedule = daysOfWeek.map(day => {
          const existing = data.find((entry: ScheduleEntry) => entry.day_of_week === day);
          return existing || {
            day_of_week: day,
            start_time: '08:00',
            end_time: '18:00',
            is_available: true,
            notes: ''
          };
        });
        setWeeklySchedule(completeSchedule);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailabilitySlots = async () => {
    if (!selectedDate) return;

    try {
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 7);
      const endDate = new Date(selectedDate);
      endDate.setDate(endDate.getDate() + 7);

      const { data, error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'get_availability_slots',
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        }
      });

      if (error) throw error;
      setAvailabilitySlots(data.slots || []);
    } catch (error) {
      console.error('Error fetching availability slots:', error);
      toast.error('Failed to load availability slots');
    }
  };

  const saveWeeklySchedule = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('handyman-schedule', {
        body: { 
          userId: user.id,
          action: 'update',
          scheduleData: weeklySchedule
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success('Weekly schedule updated successfully!');
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      toast.error('Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const saveAvailabilitySlots = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('handyman-enhanced-profile', {
        body: { 
          action: 'update_availability_slots',
          slots: availabilitySlots
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success('Availability slots updated successfully!');
      }
    } catch (error) {
      console.error('Error saving availability slots:', error);
      toast.error('Failed to save availability slots');
    } finally {
      setSaving(false);
    }
  };

  const addAvailabilitySlot = () => {
    if (!selectedDate) return;

    const newSlot: AvailabilitySlot = {
      date: selectedDate.toISOString().split('T')[0],
      start_time: '09:00',
      end_time: '10:00',
      slot_type: 'regular',
      is_booked: false,
      price_multiplier: 1.0,
      notes: ''
    };

    setAvailabilitySlots([...availabilitySlots, newSlot]);
  };

  const updateSlot = (index: number, field: keyof AvailabilitySlot, value: any) => {
    const updated = [...availabilitySlots];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilitySlots(updated);
  };

  const removeSlot = (index: number) => {
    setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
  };

  const updateWeeklySchedule = (dayIndex: number, field: keyof ScheduleEntry, value: any) => {
    const updated = [...weeklySchedule];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setWeeklySchedule(updated);
  };

  const getSlotsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availabilitySlots.filter(slot => slot.date === dateStr);
  };

  const getSlotTypeColor = (type: string) => {
    switch (type) {
      case 'same_day': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  if (loading) {
    return <div className="animate-pulse p-6">Loading schedule...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5" />
          <span>Enhanced Schedule Manager</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly Schedule</TabsTrigger>
            <TabsTrigger value="daily">Daily Availability</TabsTrigger>
            <TabsTrigger value="special">Special Slots</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <div className="space-y-4">
              {weeklySchedule.map((daySchedule, index) => (
                <div key={daySchedule.day_of_week} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{daySchedule.day_of_week}</span>
                    <Switch 
                      checked={daySchedule.is_available} 
                      onCheckedChange={(checked) => updateWeeklySchedule(index, 'is_available', checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  {daySchedule.is_available && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-sm">Start Time</Label>
                        <Input
                          type="time"
                          value={daySchedule.start_time}
                          onChange={(e) => updateWeeklySchedule(index, 'start_time', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">End Time</Label>
                        <Input
                          type="time"
                          value={daySchedule.end_time}
                          onChange={(e) => updateWeeklySchedule(index, 'end_time', e.target.value)}
                          disabled={!isEditing}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Notes</Label>
                        <Input
                          value={daySchedule.notes || ''}
                          onChange={(e) => updateWeeklySchedule(index, 'notes', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Special notes..."
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isEditing && (
                <Button onClick={saveWeeklySchedule} disabled={saving} className="w-full">
                  {saving ? 'Saving...' : 'Save Weekly Schedule'}
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="daily" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Daily Slots - {selectedDate?.toDateString()}
                    {isEditing && (
                      <Button size="sm" onClick={addAvailabilitySlot}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Slot
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDate && getSlotsForDate(selectedDate).map((slot, index) => (
                    <div key={index} className="p-3 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getSlotTypeColor(slot.slot_type)}>
                          {slot.slot_type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        {isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSlot(availabilitySlots.indexOf(slot))}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">Start Time</Label>
                          <Input
                            type="time"
                            value={slot.start_time}
                            onChange={(e) => updateSlot(availabilitySlots.indexOf(slot), 'start_time', e.target.value)}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm">End Time</Label>
                          <Input
                            type="time"
                            value={slot.end_time}
                            onChange={(e) => updateSlot(availabilitySlots.indexOf(slot), 'end_time', e.target.value)}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">Slot Type</Label>
                          <Select 
                            value={slot.slot_type} 
                            onValueChange={(value) => updateSlot(availabilitySlots.indexOf(slot), 'slot_type', value)}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="same_day">Same Day</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm">Price Multiplier</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={slot.price_multiplier}
                            onChange={(e) => updateSlot(availabilitySlots.indexOf(slot), 'price_multiplier', parseFloat(e.target.value))}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {selectedDate && getSlotsForDate(selectedDate).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No availability slots for this day</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {isEditing && (
              <Button onClick={saveAvailabilitySlots} disabled={saving} className="w-full">
                {saving ? 'Saving...' : 'Save Availability Slots'}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="special" className="space-y-4">
            <div className="p-6 border rounded-lg text-center">
              <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg font-semibold mb-2">TaskRabbit-Style Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-green-50 rounded">
                  <strong>Regular Slots</strong>
                  <p>Standard booking rates and terms</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded">
                  <strong>Same Day Slots</strong>
                  <p>Higher rates for urgent requests</p>
                </div>
                <div className="p-3 bg-red-50 rounded">
                  <strong>Emergency Slots</strong>
                  <p>Premium rates for immediate service</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
