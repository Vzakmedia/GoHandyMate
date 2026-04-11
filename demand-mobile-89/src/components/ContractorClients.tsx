
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  DollarSign,
  Star,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  MessageSquare
} from "lucide-react";

export const ContractorClients = () => {
  const clients = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Downtown",
      joinDate: "2024-01-15",
      totalProjects: 3,
      totalSpent: 28500,
      status: "active",
      rating: 5,
      lastProject: "Kitchen Renovation",
      lastContact: "2024-06-20"
    },
    {
      id: 2,
      name: "Mike Smith",
      email: "mike.smith@email.com", 
      phone: "(555) 234-5678",
      address: "456 Oak Ave, Midtown",
      joinDate: "2024-02-20",
      totalProjects: 2,
      totalSpent: 15200,
      status: "active",
      rating: 4,
      lastProject: "Bathroom Remodel",
      lastContact: "2024-06-18"
    },
    {
      id: 3,
      name: "Lisa Wilson",
      email: "lisa.wilson@email.com",
      phone: "(555) 345-6789", 
      address: "789 Pine Rd, Suburbs",
      joinDate: "2024-03-10",
      totalProjects: 1,
      totalSpent: 5800,
      status: "active",
      rating: 5,
      lastProject: "Deck Construction",
      lastContact: "2024-06-15"
    },
    {
      id: 4,
      name: "Mary Brown",
      email: "mary.brown@email.com",
      phone: "(555) 456-7890",
      address: "321 Elm St, North Side", 
      joinDate: "2024-01-08",
      totalProjects: 2,
      totalSpent: 22500,
      status: "inactive",
      rating: 4,
      lastProject: "Basement Finishing",
      lastContact: "2024-05-20"
    },
    {
      id: 5,
      name: "Commercial Corp",
      email: "contact@commercialcorp.com",
      phone: "(555) 567-8901",
      address: "100 Business Blvd, Business District",
      joinDate: "2024-04-01",
      totalProjects: 1,
      totalSpent: 3200,
      status: "active",
      rating: 4,
      lastProject: "Roof Repair",
      lastContact: "2024-06-19"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const activeClients = clients.filter(c => c.status === 'active');
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgProjectValue = totalRevenue / clients.reduce((sum, c) => sum + c.totalProjects, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Client Management</h2>
          <p className="text-sm text-gray-600">Manage your client relationships and history</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Client Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-gray-600">{activeClients.length} active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Client Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Total lifetime value</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Project Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              ${Math.round(avgProjectValue).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">Per project</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {(clients.reduce((sum, c) => sum + c.rating, 0) / clients.length).toFixed(1)}
            </div>
            <div className="flex">
              {renderStars(Math.round(clients.reduce((sum, c) => sum + c.rating, 0) / clients.length))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clients..."
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
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="date">Join Date</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Client List */}
      <div className="grid gap-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-sm sm:text-base">{client.name}</h3>
                        <Badge className={getStatusColor(client.status)}>
                          {client.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(client.rating)}
                        <span className="text-xs text-gray-500 ml-1">({client.rating}/5)</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-green-600">
                        ${client.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {client.totalProjects} project{client.totalProjects !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-3 h-3" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{client.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Joined {new Date(client.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Last project: {client.lastProject} • Last contact: {new Date(client.lastContact).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="flex flex-row lg:flex-col gap-2">
                  <Button variant="outline" size="sm" className="text-xs flex-1 lg:flex-none">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs flex-1 lg:flex-none">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs flex-1 lg:flex-none">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
