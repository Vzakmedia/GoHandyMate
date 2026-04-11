import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, Plus, Clock, Star, Filter } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';

interface CommunityEventsProps {
  onBack: () => void;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  organizer_avatar?: string;
  attendees_count: number;
  max_attendees?: number;
  category: 'social' | 'educational' | 'sports' | 'volunteer' | 'business';
  is_attending?: boolean;
  created_at: string;
}

export const CommunityEvents = ({ onBack }: CommunityEventsProps) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CommunityEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'attending' | 'this-week' | 'social' | 'educational'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunityEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, searchQuery, filterBy]);

  const fetchCommunityEvents = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - in real app would fetch from community_events table
      const mockEvents: CommunityEvent[] = [
        {
          id: '1',
          title: 'Neighborhood Cleanup Drive',
          description: 'Join us for a community cleanup event to make our neighborhood cleaner and greener!',
          date: '2024-01-20',
          time: '9:00 AM',
          location: 'Central Park Area',
          organizer: 'Sarah Johnson',
          organizer_avatar: '',
          attendees_count: 24,
          max_attendees: 50,
          category: 'volunteer',
          is_attending: false,
          created_at: '2024-01-10T00:00:00Z'
        },
        {
          id: '2',
          title: 'Home Improvement Workshop',
          description: 'Learn essential DIY skills from local handymen and contractors.',
          date: '2024-01-22',
          time: '2:00 PM',
          location: 'Community Center',
          organizer: 'Mike Rodriguez',
          organizer_avatar: '',
          attendees_count: 18,
          max_attendees: 30,
          category: 'educational',
          is_attending: true,
          created_at: '2024-01-08T00:00:00Z'
        },
        {
          id: '3',
          title: 'Block Party BBQ',
          description: 'Annual neighborhood block party with food, music, and fun activities for the whole family.',
          date: '2024-01-25',
          time: '5:00 PM',
          location: 'Maple Street Block',
          organizer: 'Community Association',
          organizer_avatar: '',
          attendees_count: 67,
          max_attendees: 100,
          category: 'social',
          is_attending: false,
          created_at: '2024-01-05T00:00:00Z'
        },
        {
          id: '4',
          title: 'Local Business Networking',
          description: 'Connect with local entrepreneurs and business owners in our community.',
          date: '2024-01-28',
          time: '7:00 PM',
          location: 'Coffee & Co.',
          organizer: 'Emily Chen',
          organizer_avatar: '',
          attendees_count: 15,
          max_attendees: 25,
          category: 'business',
          is_attending: false,
          created_at: '2024-01-12T00:00:00Z'
        },
        {
          id: '5',
          title: 'Community Garden Planting',
          description: 'Help plant seasonal vegetables and flowers in our community garden.',
          date: '2024-01-30',
          time: '10:00 AM',
          location: 'Community Garden',
          organizer: 'Green Neighbors',
          organizer_avatar: '',
          attendees_count: 12,
          max_attendees: 20,
          category: 'volunteer',
          is_attending: true,
          created_at: '2024-01-09T00:00:00Z'
        }
      ];

      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = events;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'attending':
        filtered = filtered.filter(event => event.is_attending);
        break;
      case 'this-week': {
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
        filtered = filtered.filter(event => new Date(event.date) <= oneWeekFromNow);
        break;
      }
      case 'social':
        filtered = filtered.filter(event => event.category === 'social');
        break;
      case 'educational':
        filtered = filtered.filter(event => event.category === 'educational');
        break;
    }

    setFilteredEvents(filtered);
  };

  const handleAttendEvent = async (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            is_attending: !event.is_attending,
            attendees_count: event.is_attending ? event.attendees_count - 1 : event.attendees_count + 1
          }
        : event
    ));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'social': return 'bg-pink-100 text-pink-700';
      case 'educational': return 'bg-blue-100 text-blue-700';
      case 'sports': return 'bg-green-100 text-green-700';
      case 'volunteer': return 'bg-purple-100 text-purple-700';
      case 'business': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-full bg-background rounded-b-[2rem] sm:rounded-b-[3rem]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b">
        <div className="flex items-center space-x-3 p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground">Community Events</h1>
            <p className="text-xs text-muted-foreground">
              Discover and join local happenings
            </p>
          </div>
          <Button size="sm" className="px-4">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="attending">Attending</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="ml-auto">
              {filteredEvents.length} events
            </Badge>
          </div>
        </div>
      </div>

      <div className="pb-20">
        {/* Content */}
        <div className="p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Event Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-3">
                          <div className="text-center bg-primary/10 rounded-lg p-2 min-w-[50px]">
                            <div className="text-lg font-bold text-primary">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="text-xs text-primary uppercase">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-base mb-1">
                              {event.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {event.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{event.attendees_count} attending</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className={`text-xs ${getCategoryColor(event.category)}`}>
                                {event.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {formatDate(event.date)}
                              </Badge>
                              {event.is_attending && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  ✓ Attending
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-3">
                        <Button
                          size="sm"
                          variant={event.is_attending ? "outline" : "default"}
                          onClick={() => handleAttendEvent(event.id)}
                          className="px-4"
                        >
                          {event.is_attending ? 'Cancel' : 'Attend'}
                        </Button>
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={event.organizer_avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {event.organizer.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground">
                        Organized by {event.organizer}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};