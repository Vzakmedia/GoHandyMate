import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Shield, UserPlus, Edit2, Trash2 } from 'lucide-react';

interface StaffMember {
  id: string;
  user_id: string;
  staff_role: string;
  department: string;
  permissions: string[];
  is_active: boolean;
  access_level: number;
  created_at: string;
  profiles?: {
    email: string;
    full_name: string;
  };
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  user_role: string;
  account_status: string;
}

export const RoleManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const availableRoles = [
    'super_admin',
    'admin', 
    'manager',
    'moderator',
    'support_agent',
    'analyst'
  ];

  const availableDepartments = [
    'operations',
    'support',
    'marketing',
    'finance',
    'technology',
    'management'
  ];

  const availablePermissions = [
    'user_management',
    'content_moderation', 
    'analytics_view',
    'support_access',
    'promotion_management',
    'reward_management',
    'financial_access',
    'system_settings',
    'staff_management',
    'verification_access'
  ];

  useEffect(() => {
    fetchStaffMembers();
    fetchAvailableUsers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select(`
          *,
          profiles!inner(email, full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaffMembers((data as any) || []);
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, user_role, account_status')
        .eq('account_status', 'active')
        .order('full_name');

      if (error) throw error;
      
      // Filter out users who are already staff members
      const existingStaffUserIds = staffMembers.map(s => s.user_id);
      const filteredUsers = (data || []).filter(user => !existingStaffUserIds.includes(user.id));
      
      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const addStaffMember = async () => {
    if (!selectedUser || !selectedRole || !selectedDepartment) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('staff_members')
        .insert({
          user_id: selectedUser,
          staff_role: selectedRole as any,
          department: selectedDepartment,
          permissions: selectedPermissions as any,
          is_active: true,
          access_level: getAccessLevelForRole(selectedRole),
          hired_date: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff member added successfully"
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchStaffMembers();
      fetchAvailableUsers();
    } catch (error) {
      console.error('Error adding staff member:', error);
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive"
      });
    }
  };

  const getAccessLevelForRole = (role: string): number => {
    const levels: Record<string, number> = {
      'super_admin': 10,
      'admin': 8,
      'manager': 6,
      'moderator': 4,
      'support_agent': 2,
      'analyst': 1
    };
    return levels[role] || 1;
  };

  const toggleStaffStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff status updated successfully"
      });

      fetchStaffMembers();
    } catch (error) {
      console.error('Error updating staff status:', error);
      toast({
        title: "Error",
        description: "Failed to update staff status",
        variant: "destructive"
      });
    }
  };

  const deleteStaffMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff member removed successfully"
      });

      fetchStaffMembers();
      fetchAvailableUsers();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive"
      });
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'super_admin': 'bg-red-100 text-red-800',
      'admin': 'bg-purple-100 text-purple-800',
      'manager': 'bg-blue-100 text-blue-800',
      'moderator': 'bg-green-100 text-green-800',
      'support_agent': 'bg-yellow-100 text-yellow-800',
      'analyst': 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission) 
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const resetForm = () => {
    setSelectedUser('');
    setSelectedRole('');
    setSelectedDepartment('');
    setSelectedPermissions([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Role & Staff Management</h2>
          <p className="text-muted-foreground">Manage staff roles and permissions across the platform</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Staff Member</DialogTitle>
              <DialogDescription>
                Assign a user to a staff role with specific permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user">Select User</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map(role => (
                      <SelectItem key={role} value={role}>
                        {role.replace('_', ' ').toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDepartments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                  {availablePermissions.map(permission => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={selectedPermissions.includes(permission)}
                        onCheckedChange={() => handlePermissionToggle(permission)}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addStaffMember}>Add Staff Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Staff Members</TabsTrigger>
          <TabsTrigger value="overview">Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="grid gap-4">
            {staffMembers.map((staff) => (
              <Card key={staff.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{staff.profiles?.full_name}</h4>
                        <Badge className={getRoleColor(staff.staff_role)}>
                          {staff.staff_role.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {staff.department}
                        </Badge>
                        {!staff.is_active && (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{staff.profiles?.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {staff.permissions.slice(0, 3).map(permission => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                        {staff.permissions.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{staff.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStaffStatus(staff.id, staff.is_active)}
                    >
                      {staff.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteStaffMember(staff.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {staffMembers.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No staff members found. Add your first staff member to get started.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRoles.map(role => {
              const roleStaffCount = staffMembers.filter(s => s.staff_role === role && s.is_active).length;
              return (
                <Card key={role}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{role.replace('_', ' ').toUpperCase()}</span>
                      <Badge variant="secondary">{roleStaffCount} active</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Access Level: {getAccessLevelForRole(role)}
                    </p>
                    <div className="space-y-1">
                      {availablePermissions.slice(0, 3).map(permission => (
                        <div key={permission} className="text-xs bg-muted p-1 rounded">
                          {permission.replace('_', ' ')}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};