import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Search, MapPin, UserPlus, MessageCircle, Star, Filter } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/features/auth';
import { useCommunityConnections } from '@/hooks/useCommunityConnections';
import { supabase } from '@/integrations/supabase/client';

interface PeopleDiscoveryProps {
  onBack: () => void;
}

interface SuggestedPerson {
  id: string;
  full_name: string;
  avatar_url?: string;
  city?: string;
  zip_code?: string;
  user_role?: string;
  mutual_connections?: number;
  shared_groups?: number;
  distance?: string;
  is_online?: boolean;
  rating?: number;
}

export const PeopleDiscovery = ({ onBack }: PeopleDiscoveryProps) => {
  const { user } = useAuth();
  const { sendConnectionRequest } = useCommunityConnections();
  const [people, setPeople] = useState<SuggestedPerson[]>([]);
  const [filteredPeople, setFilteredPeople] = useState<SuggestedPerson[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'location' | 'role' | 'online'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestedPeople();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [people, searchQuery, filterBy]);

  const fetchSuggestedPeople = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get existing connections to exclude
      const { data: existingConnections } = await supabase
        .from('user_connections')
        .select('connected_user_id, user_id')
        .or(`user_id.eq.${user.id},connected_user_id.eq.${user.id}`);

      const connectedUserIds = new Set([
        ...(existingConnections?.map(c => c.connected_user_id) || []),
        ...(existingConnections?.map(c => c.user_id) || []),
        user.id
      ]);

      // Fetch suggested people
      const { data: suggestedPeople } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, city, zip_code, user_role')
        .not('id', 'in', `(${Array.from(connectedUserIds).join(',')})`)
        .limit(50);

      if (suggestedPeople) {
        // Enhance with additional data
        const enhancedPeople = await Promise.all(
          suggestedPeople.map(async (person) => {
            // Get mutual connections count
            const { count: mutualConnections } = await supabase
              .from('user_connections')
              .select('*', { count: 'exact' })
              .eq('user_id', person.id)
              .in('connected_user_id', Array.from(connectedUserIds));

            // Get shared groups count
            const { count: sharedGroups } = await supabase
              .from('group_members')
              .select('*', { count: 'exact' })
              .eq('user_id', person.id);

            return {
              ...person,
              mutual_connections: mutualConnections || 0,
              shared_groups: sharedGroups || 0,
              is_online: Math.random() > 0.7, // Mock online status
              rating: 4 + Math.random(), // Mock rating
              distance: `${Math.floor(Math.random() * 10) + 1} miles away`
            };
          })
        );

        // Sort by relevance (mutual connections, shared groups, etc.)
        const sortedPeople = enhancedPeople.sort((a, b) => {
          const scoreA = (a.mutual_connections || 0) * 3 + (a.shared_groups || 0) * 2;
          const scoreB = (b.mutual_connections || 0) * 3 + (b.shared_groups || 0) * 2;
          return scoreB - scoreA;
        });

        setPeople(sortedPeople);
      }
    } catch (error) {
      console.error('Error fetching suggested people:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = people;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(person =>
        person.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.city?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'location':
        filtered = filtered.filter(person => person.city);
        break;
      case 'role':
        filtered = filtered.filter(person => person.user_role === 'handyman');
        break;
      case 'online':
        filtered = filtered.filter(person => person.is_online);
        break;
    }

    setFilteredPeople(filtered);
  };

  const handleConnect = async (personId: string) => {
    const success = await sendConnectionRequest(personId);
    if (success) {
      setPeople(prev => prev.filter(p => p.id !== personId));
    }
  };

  const getPriorityLabel = (person: SuggestedPerson) => {
    if (person.mutual_connections && person.mutual_connections > 0) {
      return { text: `${person.mutual_connections} mutual`, color: 'bg-blue-100 text-blue-700' };
    }
    if (person.shared_groups && person.shared_groups > 0) {
      return { text: `${person.shared_groups} shared groups`, color: 'bg-green-100 text-green-700' };
    }
    if (person.city) {
      return { text: 'Same area', color: 'bg-purple-100 text-purple-700' };
    }
    return null;
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
            <h1 className="text-lg font-semibold text-foreground">Discover People</h1>
            <p className="text-xs text-muted-foreground">
              Find and connect with people in your community
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-4 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search people by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All People</SelectItem>
                <SelectItem value="location">Same Area</SelectItem>
                <SelectItem value="role">Professionals</SelectItem>
                <SelectItem value="online">Online Now</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="ml-auto">
              {filteredPeople.length} found
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
          ) : filteredPeople.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No people found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setFilterBy('all');
              }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            filteredPeople.map((person) => {
              const priorityLabel = getPriorityLabel(person);
              
              return (
                <Card key={person.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={person.avatar_url} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {person.full_name?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {person.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground text-base mb-1">
                              {person.full_name}
                            </h3>
                            
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                              {person.city && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{person.city}</span>
                                </div>
                              )}
                              {person.distance && (
                                <>
                                  <span>•</span>
                                  <span>{person.distance}</span>
                                </>
                              )}
                              {person.rating && (
                                <>
                                  <span>•</span>
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{person.rating.toFixed(1)}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center space-x-2 mb-2">
                              {person.user_role && (
                                <Badge variant="outline" className="text-xs">
                                  {person.user_role}
                                </Badge>
                              )}
                              {priorityLabel && (
                                <Badge variant="secondary" className={`text-xs ${priorityLabel.color}`}>
                                  {priorityLabel.text}
                                </Badge>
                              )}
                              {person.is_online && (
                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                                  Online
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="p-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleConnect(person.id)}
                              className="px-4"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Connect
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};