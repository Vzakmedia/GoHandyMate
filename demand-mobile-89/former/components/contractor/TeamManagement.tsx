
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Users, Plus, Edit, Trash2, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContractorSync } from '@/hooks/useContractorSync';

interface TeamManagementProps {
  onBack: () => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  skills: string[];
  availability: string;
  status: 'active' | 'inactive' | 'on_leave';
  joinDate: string;
  hourlyRate?: number;
}

export const TeamManagement = ({ onBack }: TeamManagementProps) => {
  const { toast } = useToast();
  const { addTeamMember, updateTeamMember, removeTeamMember, getTeamMembers, loading } = useContractorSync();
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  
  // Load team members when component mounts
  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const result = await getTeamMembers();
      if (result?.success && result?.teamMembers) {
        // Transform database data to match component interface
        const transformedMembers = result.teamMembers.map((member: any) => ({
          id: member.id,
          name: member.name,
          role: member.role,
          email: member.email || '',
          phone: member.phone || '',
          skills: member.skills || [],
          availability: member.availability || 'Full-time',
          status: member.status || 'active',
          joinDate: member.join_date || new Date().toISOString().split('T')[0],
          hourlyRate: member.hourly_rate
        }));
        setTeamMembers(transformedMembers);
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    skills: '',
    availability: 'Full-time',
    hourlyRate: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role || !newMember.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const member: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newMember.name,
      role: newMember.role,
      email: newMember.email,
      phone: newMember.phone,
      skills: newMember.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      availability: newMember.availability,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      hourlyRate: newMember.hourlyRate ? parseFloat(newMember.hourlyRate) : undefined
    };

    try {
      await addTeamMember(member);
      setTeamMembers([...teamMembers, member]);
      setNewMember({
        name: '',
        role: '',
        email: '',
        phone: '',
        skills: '',
        availability: 'Full-time',
        hourlyRate: ''
      });
      setShowAddForm(false);
      
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeTeamMember(memberId);
      setTeamMembers(teamMembers.filter(member => member.id !== memberId));
      
      toast({
        title: "Success",
        description: "Team member removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  const toggleMemberStatus = async (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;

    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    
    try {
      await updateTeamMember(memberId, { status: newStatus });
      setTeamMembers(teamMembers.map(m => 
        m.id === memberId ? { ...m, status: newStatus } : m
      ));
      
      toast({
        title: "Success",
        description: `Team member ${newStatus === 'active' ? 'activated' : 'deactivated'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update team member status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Team Management
          </h2>
          <p className="text-gray-600">Manage your team members and their assignments</p>
        </div>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Team Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="John Smith"
                />
              </div>
              <div>
                <Label htmlFor="role">Role/Position *</Label>
                <Input
                  id="role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  placeholder="Lead Electrician"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="skills">Skills (comma separated)</Label>
                <Input
                  id="skills"
                  value={newMember.skills}
                  onChange={(e) => setNewMember({...newMember, skills: e.target.value})}
                  placeholder="Electrical, Installation, Troubleshooting"
                />
              </div>
              <div>
                <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={newMember.hourlyRate}
                  onChange={(e) => setNewMember({...newMember, hourlyRate: e.target.value})}
                  placeholder="35"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="availability">Availability</Label>
              <select
                id="availability"
                value={newMember.availability}
                onChange={(e) => setNewMember({...newMember, availability: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="On-call">On-call</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddMember} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Adding...' : 'Add Member'}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members List */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Team Members ({teamMembers.length})</h3>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {teamMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-lg">{member.name}</h4>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{member.availability}</span>
                      </div>
                      {member.hourlyRate && (
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">${member.hourlyRate}/hr</span>
                        </div>
                      )}
                    </div>
                    
                    {member.skills.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500 mb-1">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, skillIndex) => (
                            <Badge key={`${member.id}-skill-${skillIndex}`} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleMemberStatus(member.id)}
                    disabled={loading}
                  >
                    {member.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Team Members</h3>
            <p className="text-gray-600 mb-4">Start by adding your first team member</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
