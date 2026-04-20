
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContractorMetrics } from "@/hooks/useContractorMetrics";
import { 
  Building2, 
  Calendar, 
  MapPin, 
  User, 
  DollarSign, 
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  FileText
} from "lucide-react";

export const ContractorProjects = () => {
  const { metrics, loading } = useContractorMetrics();
  const allProjects = Array.isArray(metrics.projectsData) ? metrics.projectsData : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': 
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'planning': 
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': 
      case 'urgent': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const activeProjects = allProjects.filter(p => ['in_progress', 'assigned', 'planning', 'pending'].includes(p.status));
  const completedProjects = allProjects.filter(p => p.status === 'completed');
  const scheduledProjects = allProjects.filter(p => p.status === 'scheduled');

  const ProjectCard = ({ project }: { project: any }) => (
    <div className={`p-3 sm:p-4 border rounded-lg space-y-3 border-l-4 ${getPriorityColor(project.priority || 'medium')}`}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-sm sm:text-base text-gray-900">{project.title || project.name}</h4>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm text-gray-600 mt-1 gap-1 sm:gap-0">
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{project.client || 'Client'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{project.location || 'Location TBD'}</span>
            </div>
            <Badge variant="outline" className="w-fit text-xs">
              {project.category || 'General'}
            </Badge>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-start sm:items-end gap-2">
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace('_', ' ')}
          </Badge>
          <div className="text-sm sm:text-lg font-semibold text-green-600">
            ${(project.budget || project.value || 0).toLocaleString()}
          </div>
        </div>
      </div>
      
      {project.status !== 'completed' && project.status !== 'scheduled' && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Progress</span>
            <span>{project.completion || 0}%</span>
          </div>
          <Progress value={project.completion || 0} className="h-2" />
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm text-gray-500 gap-2">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>
            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Start TBD'} - 
            {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'End TBD'}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-xs">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Project Management</h2>
          <p className="text-sm text-gray-600">Manage all your construction projects</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Select>
            <SelectTrigger className="w-full sm:w-32">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="renovation">Renovation</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active" className="text-xs sm:text-sm">
            Active ({activeProjects.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="text-xs sm:text-sm">
            Scheduled ({scheduledProjects.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Completed ({completedProjects.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading projects...</p>
              </div>
            ) : activeProjects.length > 0 ? (
              activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active projects found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading projects...</p>
              </div>
            ) : scheduledProjects.length > 0 ? (
              scheduledProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No scheduled projects found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-4">
          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading projects...</p>
              </div>
            ) : completedProjects.length > 0 ? (
              completedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No completed projects found.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{allProjects.length}</div>
            <p className="text-xs text-gray-600">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              ${allProjects.reduce((sum, p) => sum + (p.budget || p.value || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Combined value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Project Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ${allProjects.length > 0 ? Math.round(allProjects.reduce((sum, p) => sum + (p.budget || p.value || 0), 0) / allProjects.length).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-gray-600">Average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {allProjects.length > 0 ? Math.round((completedProjects.length / allProjects.length) * 100) : 0}%
            </div>
            <p className="text-xs text-gray-600">Success rate</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
