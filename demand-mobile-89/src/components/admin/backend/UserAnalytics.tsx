import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Users, 
  MapPin, 
  Building, 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  UserX, 
  UserCheck, 
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SpamUserManager } from './SpamUserManager';

interface UserDetail {
  id: string;
  full_name: string;
  email: string;
  user_role: string;
  account_status: string;
  created_at: string;
  phone?: string;
  subscription_plan?: string;
  subscription_status?: string;
}

interface CityGroup {
  city: string;
  total_users: number;
  users_by_role: {
    [role: string]: UserDetail[];
  };
}

interface StateGroup {
  state: string;
  total_users: number;
  cities: CityGroup[];
  users_by_role: {
    [role: string]: number;
  };
}

export const UserAnalytics = () => {
  const [usersByState, setUsersByState] = useState<StateGroup[]>([]);
  const [usersByRole, setUsersByRole] = useState<{ role: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchUserAnalytics();
  }, []);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch all users with location data
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, city, address, zip_code, user_role, full_name, email, created_at, phone, subscription_plan, subscription_status, account_status');

      if (usersError) throw usersError;

      console.log('All users data:', allUsers);

      // Helper function to extract location info
      const extractLocationInfo = (user: any) => {
        let state = 'Unknown';
        let city = 'Unknown';

        // Try to get state from address first
        if (user.address) {
          const addressParts = user.address.split(',');
          if (addressParts.length >= 2) {
            // Look for state abbreviation (2 letters) or state name
            const statePart = addressParts[addressParts.length - 2]?.trim();
            if (statePart && statePart.length === 2) {
              state = statePart.toUpperCase();
            } else if (statePart) {
              state = statePart;
            }
          }
          // Get city from address
          if (addressParts.length >= 3) {
            city = addressParts[addressParts.length - 3]?.trim() || 'Unknown';
          } else if (addressParts.length >= 1) {
            city = addressParts[0]?.trim() || 'Unknown';
          }
        }
        
        // Fallback to city field if available
        if (user.city && user.city !== 'Unknown') {
          if (user.city.includes(',')) {
            const cityParts = user.city.split(',');
            city = cityParts[0]?.trim() || city;
            state = cityParts[cityParts.length - 1]?.trim() || state;
          } else if (user.city.length === 2) {
            state = user.city.toUpperCase();
          } else {
            city = user.city;
          }
        }

        // Use zip code for additional state mapping if needed
        if (user.zip_code && state === 'Unknown') {
          // Basic zip code to state mapping for common ones
          const zipToState: { [key: string]: string } = {
            '20': 'MD', '21': 'MD', // Maryland
            '22': 'VA', '23': 'VA', '24': 'VA', // Virginia
            '10': 'NY', '11': 'NY', '12': 'NY', '13': 'NY', '14': 'NY', // New York
            '90': 'CA', '91': 'CA', '92': 'CA', '93': 'CA', '94': 'CA', '95': 'CA', // California
          };
          
          const zipPrefix = user.zip_code.toString().substring(0, 2);
          if (zipToState[zipPrefix]) {
            state = zipToState[zipPrefix];
          }
        }

        return { state, city };
      };

      // Process hierarchical data structure
      const stateGroups: { [key: string]: { 
        total: number; 
        cities: { [city: string]: { total: number; users_by_role: { [role: string]: UserDetail[] } } };
        users_by_role: { [role: string]: number };
      } } = {};
      const roleGroups: { [role: string]: number } = {};
      
      allUsers?.forEach((user) => {
        const { state, city } = extractLocationInfo(user);
        
        // Initialize state if not exists
        if (!stateGroups[state]) {
          stateGroups[state] = { total: 0, cities: {}, users_by_role: {} };
        }
        
        // Initialize city if not exists
        if (!stateGroups[state].cities[city]) {
          stateGroups[state].cities[city] = { total: 0, users_by_role: {} };
        }
        
        // Initialize role arrays if not exists
        if (!stateGroups[state].cities[city].users_by_role[user.user_role]) {
          stateGroups[state].cities[city].users_by_role[user.user_role] = [];
        }
        
        // Add user details
        const userDetail: UserDetail = {
          id: user.id,
          full_name: user.full_name || 'N/A',
          email: user.email,
          user_role: user.user_role,
          account_status: user.account_status || 'unknown',
          created_at: user.created_at,
          phone: user.phone,
          subscription_plan: user.subscription_plan,
          subscription_status: user.subscription_status
        };
        
        stateGroups[state].cities[city].users_by_role[user.user_role].push(userDetail);
        stateGroups[state].cities[city].total += 1;
        stateGroups[state].total += 1;
        stateGroups[state].users_by_role[user.user_role] = (stateGroups[state].users_by_role[user.user_role] || 0) + 1;
        
        // Role grouping
        roleGroups[user.user_role] = (roleGroups[user.user_role] || 0) + 1;
      });

      // Format state results with hierarchical structure
      const stateResults = Object.entries(stateGroups)
        .map(([state, data]) => ({
          state,
          total_users: data.total,
          cities: Object.entries(data.cities).map(([city, cityData]) => ({
            city,
            total_users: cityData.total,
            users_by_role: cityData.users_by_role
          })).sort((a, b) => b.total_users - a.total_users),
          users_by_role: data.users_by_role
        }))
        .sort((a, b) => b.total_users - a.total_users);

      const roleResults = Object.entries(roleGroups)
        .map(([role, count]) => ({ role, count }))
        .sort((a, b) => b.count - a.count);

      console.log('Processed hierarchical results:', { stateResults, roleResults });

      setUsersByState(stateResults);
      setUsersByRole(roleResults);

    } catch (error) {
      console.error('Error fetching user analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'customer': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'provider': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const toggleStateExpansion = (state: string) => {
    const newExpanded = new Set(expandedStates);
    if (newExpanded.has(state)) {
      newExpanded.delete(state);
    } else {
      newExpanded.add(state);
    }
    setExpandedStates(newExpanded);
  };

  const toggleCityExpansion = (cityKey: string) => {
    const newExpanded = new Set(expandedCities);
    if (newExpanded.has(cityKey)) {
      newExpanded.delete(cityKey);
    } else {
      newExpanded.add(cityKey);
    }
    setExpandedCities(newExpanded);
  };

  const handleSuspendUser = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          account_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`User ${newStatus === 'suspended' ? 'suspended' : 'reactivated'} successfully`);
      await fetchUserAnalytics(); // Refresh data
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      // Use the secure admin RPC function to delete user
      const { error } = await supabase.rpc('admin_delete_user', {
        user_id_to_delete: userId
      });

      if (error) throw error;

      toast.success('User successfully deleted from system');
      await fetchUserAnalytics(); // Refresh data
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user: ' + (error as any).message);
    }
  };

  const identifySpamUsers = (users: UserDetail[]) => {
    return users.filter(user => {
      const joinDate = new Date(user.created_at);
      const daysSinceJoin = (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Potential spam indicators
      const hasNoPhone = !user.phone;
      const hasGenericName = user.full_name.toLowerCase().includes('test') || 
                            user.full_name.toLowerCase().includes('user') ||
                            user.full_name === 'N/A';
      const recentlyJoined = daysSinceJoin < 1;
      const hasNoSubscription = !user.subscription_plan;
      
      return hasNoPhone && (hasGenericName || (recentlyJoined && hasNoSubscription));
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total States</CardTitle>
            <MapPin className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByState.length}</div>
            <p className="text-xs text-muted-foreground">
              With registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cities</CardTitle>
            <Building className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usersByState.reduce((total, state) => total + state.cities.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Cities with registered users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Types</CardTitle>
            <Users className="h-4 w-4 ml-auto text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersByRole.length}</div>
            <p className="text-xs text-muted-foreground">
              Different user roles
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hierarchy" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hierarchy">Geographic Hierarchy</TabsTrigger>
          <TabsTrigger value="spam">Spam Management</TabsTrigger>
          <TabsTrigger value="roles">By User Type</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users by Geographic Hierarchy</CardTitle>
              <CardDescription>
                Expandable view of users organized by state → city → role with detailed user information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersByState.map((state) => (
                  <div key={state.state} className="border rounded-lg overflow-hidden">
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-between p-4 h-auto hover:bg-muted/50"
                          onClick={() => toggleStateExpansion(state.state)}
                        >
                          <div className="flex items-center gap-3">
                            {expandedStates.has(state.state) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <div className="text-left">
                              <h3 className="font-semibold text-lg">{state.state}</h3>
                              <p className="text-sm text-muted-foreground">
                                {state.total_users} users across {state.cities.length} cities
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(state.users_by_role).map(([role, count]) => (
                              <Badge key={role} variant="outline" className={getRoleColor(role)}>
                                {role}: {count}
                              </Badge>
                            ))}
                          </div>
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="bg-muted/30">
                        <div className="p-4 space-y-3">
                          {state.cities.map((city) => (
                            <div key={`${city.city}-${state.state}`} className="border rounded-lg bg-background">
                              <Collapsible>
                                <CollapsibleTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between p-3 h-auto hover:bg-muted/50"
                                    onClick={() => toggleCityExpansion(`${city.city}-${state.state}`)}
                                  >
                                    <div className="flex items-center gap-3">
                                      {expandedCities.has(`${city.city}-${state.state}`) ? (
                                        <ChevronDown className="h-4 w-4" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4" />
                                      )}
                                      <Building className="h-4 w-4 text-green-600" />
                                      <div className="text-left">
                                        <h4 className="font-medium">{city.city}</h4>
                                        <p className="text-xs text-muted-foreground">
                                          {city.total_users} users
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {Object.entries(city.users_by_role).map(([role, users]) => (
                                        <Badge key={role} variant="outline" className={`${getRoleColor(role)} text-xs`}>
                                          {role}: {users.length}
                                        </Badge>
                                      ))}
                                    </div>
                                  </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="bg-muted/20">
                                  <div className="p-3 space-y-3">
                                    {Object.entries(city.users_by_role).map(([role, users]) => (
                                      <div key={role} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <Badge className={getRoleColor(role)}>
                                            {role.replace('_', ' ').toUpperCase()}
                                          </Badge>
                                          <span className="text-sm text-muted-foreground">
                                            ({users.length} users)
                                          </span>
                                        </div>
                                        <div className="grid gap-2 ml-4">
                                          {users.map((user) => {
                                            const isSpamSuspected = identifySpamUsers([user]).length > 0;
                                            return (
                                              <div key={user.id} className="p-3 bg-background border rounded-lg hover:shadow-sm transition-shadow">
                                                <div className="flex items-start justify-between">
                                                  <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                      <h5 className="font-medium">{user.full_name}</h5>
                                                      <Badge variant="outline" className={getStatusColor(user.account_status)}>
                                                        {user.account_status}
                                                      </Badge>
                                                      {isSpamSuspected && (
                                                        <Badge variant="destructive" className="text-xs">
                                                          <AlertTriangle className="h-3 w-3 mr-1" />
                                                          Spam Risk
                                                        </Badge>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                      <div className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        <span>{user.email}</span>
                                                      </div>
                                                      {user.phone && (
                                                        <div className="flex items-center gap-1">
                                                          <Phone className="h-3 w-3" />
                                                          <span>{user.phone}</span>
                                                        </div>
                                                      )}
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                      <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                                                      </div>
                                                      {user.subscription_plan && (
                                                        <div className="flex items-center gap-1">
                                                          <Shield className="h-3 w-3" />
                                                          <span>Plan: {user.subscription_plan}</span>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <div className="flex gap-2 ml-4">
                                                    <Button
                                                      size="sm"
                                                      variant={user.account_status === 'suspended' ? 'default' : 'outline'}
                                                      onClick={() => handleSuspendUser(user.id, user.account_status)}
                                                      className="text-xs"
                                                    >
                                                      {user.account_status === 'suspended' ? (
                                                        <>
                                                          <UserCheck className="h-3 w-3 mr-1" />
                                                          Reactivate
                                                        </>
                                                      ) : (
                                                        <>
                                                          <UserX className="h-3 w-3 mr-1" />
                                                          Suspend
                                                        </>
                                                      )}
                                                    </Button>
                                                    <AlertDialog>
                                                      <AlertDialogTrigger asChild>
                                                        <Button size="sm" variant="destructive" className="text-xs">
                                                          <Trash2 className="h-3 w-3 mr-1" />
                                                          Delete
                                                        </Button>
                                                      </AlertDialogTrigger>
                                                      <AlertDialogContent className="bg-background border shadow-lg">
                                                        <AlertDialogHeader>
                                                          <AlertDialogTitle>Delete User Account</AlertDialogTitle>
                                                          <AlertDialogDescription>
                                                            Are you sure you want to permanently delete <strong>{user.full_name}</strong> ({user.email})?
                                                            <br /><br />
                                                            <span className="text-destructive font-semibold">
                                                              This action cannot be undone. All user data will be permanently removed.
                                                            </span>
                                                          </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                          <AlertDialogAction
                                                            onClick={() => handleDeleteUser(user.id, user.email)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                          >
                                                            Delete Permanently
                                                          </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                      </AlertDialogContent>
                                                    </AlertDialog>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spam" className="space-y-4">
          <SpamUserManager />
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users by Role</CardTitle>
              <CardDescription>
                Distribution of users across different user types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {usersByRole.map((role) => (
                  <div key={role.role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleColor(role.role)}>
                        {role.role}
                      </Badge>
                      <span className="font-semibold capitalize">
                        {role.role.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">
                      {role.count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};