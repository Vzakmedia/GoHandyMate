
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AddressInput } from '@/components/ui/address-input';
import { Calendar, Clock, Users, MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useContractorSync } from '@/hooks/useContractorSync';

export const ScheduleManager = () => {
  const { toast } = useToast();
  const { addProject, getProjects, loading } = useContractorSync();
  const [projects, setProjects] = useState([]);

  const [newProject, setNewProject] = useState({
    title: '',
    client: '',
    startDate: '',
    endDate: '',
    assignedTeam: '',
    location: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  // Load projects when component mounts
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const result = await getProjects();
      if (result?.success && result?.projects) {
        // Transform database data to match component interface
        const transformedProjects = result.projects.map((project: any) => ({
          id: project.id,
          title: project.title,
          client: project.client,
          startDate: project.start_date,
          endDate: project.end_date,
          location: project.location || '',
          assignedTeam: project.assigned_team || [],
          status: project.status || 'scheduled'
        }));
        setProjects(transformedProjects);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddProject = async () => {
    if (!newProject.title || !newProject.client || !newProject.startDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const projectData = {
      title: newProject.title,
      client: newProject.client,
      startDate: newProject.startDate,
      endDate: newProject.endDate || null,
      location: newProject.location,
      assignedTeam: newProject.assignedTeam.split(',').map(name => name.trim()).filter(name => name),
      status: 'scheduled'
    };

    try {
      const result = await addProject(projectData);
      if (result?.success) {
        // Reload projects to get the new one with its database ID
        await loadProjects();
        setNewProject({
          title: '',
          client: '',
          startDate: '',
          endDate: '',
          assignedTeam: '',
          location: ''
        });
        setShowAddForm(false);
        
        toast({
          title: "Success",
          description: "Project scheduled successfully",
        });
      } else {
        throw new Error(result?.error || 'Failed to add project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Schedule Manager</h2>
          <p className="text-gray-600">Manage project timelines and team schedules</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  placeholder="e.g., Kitchen Renovation"
                />
              </div>
              <div>
                <Label htmlFor="client">Client Name *</Label>
                <Input
                  id="client"
                  value={newProject.client}
                  onChange={(e) => setNewProject({...newProject, client: e.target.value})}
                  placeholder="Client name"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <AddressInput
                value={newProject.location}
                onChange={(value) => setNewProject({...newProject, location: value})}
                onAddressSelect={(details) => {
                  setNewProject({...newProject, location: details.formatted_address});
                }}
                placeholder="Start typing project address..."
              />
            </div>
            <div>
              <Label htmlFor="team">Assigned Team (comma separated)</Label>
              <Input
                id="team"
                value={newProject.assignedTeam}
                onChange={(e) => setNewProject({...newProject, assignedTeam: e.target.value})}
                placeholder="John Doe, Jane Smith"
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAddProject}>Add Project</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">Client: {project.client}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                    </div>
                    {project.endDate && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{project.assignedTeam.length} team members</span>
                    </div>
                    {project.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="truncate">{project.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {project.assignedTeam.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500 mb-1">Assigned Team:</p>
                      <div className="flex flex-wrap gap-1">
                        {project.assignedTeam.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Scheduled</h3>
            <p className="text-gray-600 mb-4">Start by adding your first project to the schedule</p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
