
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar as CalendarIcon, Clock, MapPin, Settings } from "lucide-react";
import { useAuth } from '@/features/auth';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScheduleEntry {
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  notes?: string;
}

export const HandymanScheduleManager = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    fetchSchedule();
  }, [user]);

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
      
      if (!data || data.length === 0) {
        const defaultSchedule = daysOfWeek.map(day => ({
          day_of_week: day,
          start_time: '08:00',
          end_time: '18:00',
          is_available: true,
          notes: ''
        }));
        setSchedule(defaultSchedule);
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
        setSchedule(completeSchedule);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      toast.error('Failed to load schedule');
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (updatedSchedule: ScheduleEntry[]) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('handyman-schedule', {
        body: { 
          userId: user.id,
          action: 'update',
          scheduleData: updatedSchedule
        }
      });

      if (error) throw error;
      
      if (data.success) {
        toast.success('Schedule updated successfully!');
        setSchedule(updatedSchedule);
      } else {
        toast.error(data.error || 'Failed to update schedule');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Failed to update schedule');
    }
  };

  const toggleDayAvailability = (dayIndex: number, available: boolean) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      is_available: available
    };
    updateSchedule(updatedSchedule);
  };

  const updateWorkingHours = (dayIndex: number, field: 'start_time' | 'end_time', value: string) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[dayIndex] = {
      ...updatedSchedule[dayIndex],
      [field]: value
    };
    updateSchedule(updatedSchedule);
  };

  // Mock scheduled jobs for calendar display
  const scheduledJobs = [
    {
      id: 1,
      title: "Fix leaky faucet",
      date: "2024-01-15",
      time: "14:00",
      location: "Downtown",
      status: "confirmed"
    },
    {
      id: 2,
      title: "Install ceiling fan",
      date: "2024-01-16",
      time: "10:00",
      location: "Midtown",
      status: "pending"
    }
  ];

  const getJobsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledJobs.filter(job => job.date === dateStr);
  };

  if (loading) {
    return <div className="p-6">Loading schedule...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Schedule Management</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Available Today:</span>
          <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
        </div>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Clock className="w-4 h-4 mr-2" />
            Availability Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Job Calendar</CardTitle>
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
                <CardTitle className="text-lg">
                  Daily Schedule - {selectedDate?.toDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDate && getJobsForDate(selectedDate).length > 0 ? (
                  getJobsForDate(selectedDate).map((job) => (
                    <div key={job.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{job.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{job.time}</span>
                            <MapPin className="w-3 h-3 ml-2" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        <Badge className={job.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No jobs scheduled for this day</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedule.map((daySchedule, index) => (
                <div key={daySchedule.day_of_week} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium w-20">{daySchedule.day_of_week}</span>
                    <Switch 
                      checked={daySchedule.is_available} 
                      onCheckedChange={(checked) => toggleDayAvailability(index, checked)}
                    />
                  </div>
                  {daySchedule.is_available && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={daySchedule.start_time}
                        onChange={(e) => updateWorkingHours(index, 'start_time', e.target.value)}
                        className="w-24"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={daySchedule.end_time}
                        onChange={(e) => updateWorkingHours(index, 'end_time', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
