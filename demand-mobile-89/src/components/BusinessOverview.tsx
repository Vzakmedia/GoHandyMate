
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  Building2
} from "lucide-react";

export const BusinessOverview = () => {
  // Mock project data
  const activeProjects = [
    {
      id: 1,
      name: "Kitchen Renovation - Johnson Residence",
      client: "Sarah Johnson",
      location: "Downtown",
      startDate: "2024-06-15",
      endDate: "2024-07-20",
      value: 15500,
      status: "in_progress",
      completion: 65,
      nextMilestone: "Cabinet Installation"
    },
    {
      id: 2,
      name: "Bathroom Remodel - Smith Home",
      client: "Mike Smith",
      location: "Midtown",
      startDate: "2024-06-20",
      endDate: "2024-07-15",
      value: 8200,
      status: "in_progress",
      completion: 30,
      nextMilestone: "Plumbing Rough-in"
    },
    {
      id: 3,
      name: "Deck Construction - Wilson Property",
      client: "Lisa Wilson",
      location: "Suburbs",
      startDate: "2024-06-25",
      endDate: "2024-07-10",
      value: 5800,
      status: "planning",
      completion: 10,
      nextMilestone: "Permit Approval"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "project_update",
      description: "Completed electrical rough-in for Johnson Kitchen",
      timestamp: "2 hours ago",
      project: "Kitchen Renovation"
    },
    {
      id: 2,
      type: "quote_sent",
      description: "Quote sent to Mary Brown for basement finishing",
      timestamp: "4 hours ago",
      amount: 12500
    },
    {
      id: 3,
      type: "payment_received",
      description: "Payment received from Smith project milestone",
      timestamp: "1 day ago",
      amount: 2500
    },
    {
      id: 4,
      type: "inspection_scheduled",
      description: "City inspection scheduled for Wilson deck foundation",
      timestamp: "2 days ago",
      project: "Deck Construction"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project_update':
        return <Building2 className="w-4 h-4" />;
      case 'quote_sent':
        return <DollarSign className="w-4 h-4" />;
      case 'payment_received':
        return <CheckCircle className="w-4 h-4" />;
      case 'inspection_scheduled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Active Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeProjects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{project.client}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('_', ' ')}
                  </Badge>
                  <div className="text-lg font-semibold text-green-600 mt-1">
                    ${project.value.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.completion}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600">
                  Next: {project.nextMilestone}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</span>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                {activity.amount && (
                  <p className="text-sm font-semibold text-green-600">
                    ${activity.amount.toLocaleString()}
                  </p>
                )}
                {activity.project && (
                  <p className="text-xs text-gray-500">
                    Project: {activity.project}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
