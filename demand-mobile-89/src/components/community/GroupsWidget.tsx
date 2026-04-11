import { useState } from 'react';
import { Users, Plus, Settings, UserMinus, UserPlus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCommunityGroups } from '@/hooks/useCommunityGroups';

export const GroupsWidget = () => {
  const {
    groups,
    userGroups,
    loading,
    createGroup,
    joinGroup,
    leaveGroup
  } = useCommunityGroups();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [joiningGroups, setJoiningGroups] = useState<Set<string>>(new Set());
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    location: '',
    is_public: true
  });

  const handleCreateGroup = async () => {
    if (!newGroupData.name.trim()) return;

    const success = await createGroup(newGroupData);
    if (success) {
      setNewGroupData({ name: '', description: '', location: '', is_public: true });
      setIsCreateDialogOpen(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    setJoiningGroups(prev => new Set([...prev, groupId]));
    await joinGroup(groupId);
    setJoiningGroups(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
      return newSet;
    });
  };

  const handleLeaveGroup = async (groupId: string) => {
    setJoiningGroups(prev => new Set([...prev, groupId]));
    await leaveGroup(groupId);
    setJoiningGroups(prev => {
      const newSet = new Set(prev);
      newSet.delete(groupId);
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Groups ({userGroups.length})
          </CardTitle>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    value={newGroupData.name}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter group name..."
                  />
                </div>
                <div>
                  <Label htmlFor="group-description">Description</Label>
                  <Textarea
                    id="group-description"
                    value={newGroupData.description}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your group..."
                  />
                </div>
                <div>
                  <Label htmlFor="group-location">Location (Optional)</Label>
                  <Input
                    id="group-location"
                    value={newGroupData.location}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Group location..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="group-public"
                    checked={newGroupData.is_public}
                    onCheckedChange={(checked) => setNewGroupData(prev => ({ ...prev, is_public: checked }))}
                  />
                  <Label htmlFor="group-public">Public Group</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGroup} className="bg-green-600 hover:bg-green-700">
                    Create Group
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="joined" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="joined" className="text-xs">
              My Groups
            </TabsTrigger>
            <TabsTrigger value="discover" className="text-xs">
              Discover
            </TabsTrigger>
          </TabsList>

          <TabsContent value="joined" className="space-y-3 mt-4">
            {userGroups.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                You haven't joined any groups yet. Discover groups or create your own!
              </p>
            ) : (
              userGroups.slice(0, 5).map((group) => (
                <div key={group.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{group.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500">{group.member_count} members</p>
                      {group.user_role && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-1">
                          {group.user_role}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {group.user_role === 'admin' && (
                      <Button size="sm" variant="ghost" className="p-1">
                        <Settings className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1 text-red-600 hover:text-red-700"
                      onClick={() => handleLeaveGroup(group.id)}
                      disabled={joiningGroups.has(group.id)}
                    >
                      <UserMinus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
            {userGroups.length > 5 && (
              <Button variant="outline" size="sm" className="w-full">
                View All ({userGroups.length})
              </Button>
            )}
          </TabsContent>

          <TabsContent value="discover" className="space-y-3 mt-4">
            {groups.filter(group => !group.is_member).length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No new groups to discover
              </p>
            ) : (
              groups.filter(group => !group.is_member).slice(0, 5).map((group) => (
                <div key={group.id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{group.name}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500">{group.member_count} members</p>
                      {group.location && (
                        <p className="text-xs text-gray-400">• {group.location}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleJoinGroup(group.id)}
                    disabled={joiningGroups.has(group.id)}
                  >
                    {joiningGroups.has(group.id) ? (
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