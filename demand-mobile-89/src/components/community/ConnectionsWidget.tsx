import { useState } from 'react';
import { Users, UserPlus, Check, X, MessageCircle } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCommunityConnections } from '@/hooks/useCommunityConnections';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ConnectionsWidget = () => {
  const {
    connections,
    pendingRequests,
    suggestedConnections,
    loading,
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest
  } = useCommunityConnections();

  const [sendingRequests, setSendingRequests] = useState<Set<string>>(new Set());

  const handleSendRequest = async (userId: string) => {
    setSendingRequests(prev => new Set([...prev, userId]));
    await sendConnectionRequest(userId);
    setSendingRequests(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
          <Users className="w-4 h-4 mr-2" />
          Connections ({connections.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connections" className="text-xs">
              Connections
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs">
              Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="suggested" className="text-xs">
              Suggested
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="space-y-3 mt-4">
            {connections.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No connections yet. Start connecting with people!
              </p>
            ) : (
              connections.slice(0, 5).map((connection) => (
                <div key={connection.id} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={connection.profile?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                      {connection.profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {connection.profile?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {connection.profile?.user_role || 'User'}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="p-1">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
            {connections.length > 5 && (
              <Button variant="outline" size="sm" className="w-full">
                View All ({connections.length})
              </Button>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-3 mt-4">
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No pending requests
              </p>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={request.profile?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                      {request.profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {request.profile?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">wants to connect</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1 text-green-600 hover:text-green-700"
                      onClick={() => acceptConnectionRequest(request.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1 text-red-600 hover:text-red-700"
                      onClick={() => rejectConnectionRequest(request.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="suggested" className="space-y-3 mt-4">
            {suggestedConnections.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No suggestions available
              </p>
            ) : (
              suggestedConnections.slice(0, 5).map((person) => (
                <div key={person.id} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={person.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                      {person.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {person.full_name || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {person.user_role || 'User'} • {person.city || 'Location not set'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleSendRequest(person.id)}
                    disabled={sendingRequests.has(person.id)}
                  >
                    {sendingRequests.has(person.id) ? (
                      <div className="w-3 h-3 border border-green-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};