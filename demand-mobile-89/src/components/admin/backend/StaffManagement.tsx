import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Users, Plus, Edit, Trash2, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  user_id: string;
  staff_role: string;
  department: string;
  permissions: string[];
  is_active: boolean;
  hired_date: string;
  manager_id?: string;
  access_level: number;
  notes?: string;
  profiles?: {
    full_name: string;
    email: string;
  } | null;
}

const STAFF_ROLES = [
  'super_admin',
  'admin',
  'manager', 
  'supervisor',
  'support_agent',
  'moderator',
  'analyst'
];

const DEPARTMENTS = [
  'general',
  'customer_service',
  'technical_support',
  'operations',
  'marketing',
  'finance',
  'hr'
];

const PERMISSIONS = [
  'user_management',
  'content_moderation',
  'financial_access',
  'system_settings',
  'analytics_view',
  'promotion_management',
  'reward_management',
  'staff_management',
  'verification_access',
  'support_access'
];

export const StaffManagement = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    staff_role: 'support_agent',
    department: 'general',
    permissions: [] as string[],
    access_level: 1,
    notes: ''
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_members')
        .select(`
          *,
          profiles:user_id (full_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStaff((data as any) || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to fetch staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStaff) {
        // Update existing staff member
        const { error } = await supabase
          .from('staff_members')
          .update({
            staff_role: formData.staff_role as any,
            department: formData.department,
            permissions: formData.permissions as any,
            access_level: formData.access_level,
            notes: formData.notes
          })
          .eq('id', editingStaff.id);

        if (error) throw error;
        toast.success('Staff member updated successfully');
      } else {
        // Find user by email
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', formData.email)
          .single();

        if (profileError || !profiles) {
          toast.error('User not found with that email');
          return;
        }

        // Create new staff member
        const { error } = await supabase
          .from('staff_members')
          .insert({
            user_id: profiles.id,
            staff_role: formData.staff_role as any,
            department: formData.department,
            permissions: formData.permissions as any,
            access_level: formData.access_level,
            notes: formData.notes
          });

        if (error) throw error;
        toast.success('Staff member added successfully');
      }

      setIsDialogOpen(false);
      setEditingStaff(null);
      setFormData({
        email: '',
        staff_role: 'support_agent',
        department: 'general',
        permissions: [],
        access_level: 1,
        notes: ''
      });
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast.error('Failed to save staff member');
    }
  };

  const toggleStaffStatus = async (staffId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('staff_members')
        .update({ is_active: !isActive })
        .eq('id', staffId);

      if (error) throw error;
      toast.success(`Staff member ${!isActive ? 'activated' : 'deactivated'}`);
      fetchStaff();
    } catch (error) {
      console.error('Error updating staff status:', error);
      toast.error('Failed to update staff status');
    }
  };

  const deleteStaff = async (staffId: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      const { error } = await supabase
        .from('staff_members')
        .delete()
        .eq('id', staffId);

      if (error) throw error;
      toast.success('Staff member deleted successfully');
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff member:', error);
      toast.error('Failed to delete staff member');
    }
  };

  const handleEdit = (staffMember: StaffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      email: staffMember.profiles?.email || '',
      staff_role: staffMember.staff_role,
      department: staffMember.department,
      permissions: staffMember.permissions,
      access_level: staffMember.access_level,
      notes: staffMember.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked 
        ? [...prev.permissions, permission]
        : prev.permissions.filter(p => p !== permission)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="text-2xl font-bold">Staff Management</h3>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStaff(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Staff Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingStaff && (
                <div>
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter user email"
                    required
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="staff_role">Role</Label>
                  <Select value={formData.staff_role} onValueChange={(value) => setFormData(prev => ({ ...prev, staff_role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_ROLES.map(role => (
                        <SelectItem key={role} value={role}>
                          {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map(dept => (
                        <SelectItem key={dept} value={dept}>
                          {dept.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="access_level">Access Level</Label>
                <Input
                  id="access_level"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.access_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, access_level: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {PERMISSIONS.map(permission => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={formData.permissions.includes(permission)}
                        onCheckedChange={(checked) => handlePermissionChange(permission, checked as boolean)}
                      />
                      <Label htmlFor={permission} className="text-sm">
                        {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStaff ? 'Update' : 'Add'} Staff Member
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {staff.map(staffMember => (
          <Card key={staffMember.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {staffMember.is_active ? (
                      <UserCheck className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{staffMember.profiles?.full_name || 'Unknown'}</h4>
                    <p className="text-sm text-muted-foreground">{staffMember.profiles?.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={staffMember.staff_role === 'super_admin' ? 'destructive' : 'secondary'}>
                      {staffMember.staff_role.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      {staffMember.department.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline">
                      Level {staffMember.access_level}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(staffMember)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant={staffMember.is_active ? "destructive" : "default"}
                    onClick={() => toggleStaffStatus(staffMember.id, staffMember.is_active)}
                  >
                    {staffMember.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteStaff(staffMember.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {staffMember.permissions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {staffMember.permissions.map(permission => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {staffMember.notes && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-1">Notes:</p>
                  <p className="text-sm text-muted-foreground">{staffMember.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};