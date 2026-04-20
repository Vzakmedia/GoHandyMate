
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  FileText, 
  Building2, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Wrench
} from "lucide-react";
import { useContractorMetrics } from "@/hooks/useContractorMetrics";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/features/auth';

interface ModernContractorOverviewProps {
  onNavigateToSection: (section: string) => void;
}

interface RecentProject {
  id: string;
  title: string;
  customer_id: string;
  status: string;
  budget: number;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

export const ModernContractorOverview = ({ onNavigateToSection }: ModernContractorOverviewProps) => {
  const { metrics, loading } = useContractorMetrics();
  const { user } = useAuth();
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [teamMemberCount, setTeamMemberCount] = useState(0);

  useEffect(() => {
    const fetchRecentProjects = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('job_requests')
        .select(`
          id,
          title,
          customer_id,
          status,
          budget,
          created_at
        `)
        .eq('assigned_to_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (data) {
        // Fetch customer names separately 
        const projectsWithCustomers = await Promise.all(
          data.map(async (project) => {
            const { data: customerData } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', project.customer_id)
              .single();
            
            return {
              ...project,
              profiles: customerData || { full_name: 'Unknown Customer' }
            };
          })
        );
        
        setRecentProjects(projectsWithCustomers);
      }
    };

    fetchRecentProjects();
  }, [user?.id]);

  const quickStats = [
    { 
      title: "Active Projects", 
      value: metrics.activeJobs.toString(), 
      change: `${metrics.activeJobs > 0 ? '+' : ''}${metrics.activeJobs}`, 
      color: "text-blue-600", 
      icon: Building2 
    },
    { 
      title: "Pending Quotes", 
      value: metrics.pendingQuotes.toString(), 
      change: `${metrics.pendingQuotes > 0 ? '+' : ''}${metrics.pendingQuotes}`, 
      color: "text-yellow-600", 
      icon: FileText 
    },
    { 
      title: "Monthly Revenue", 
      value: `$${metrics.monthlyRevenue.toLocaleString()}`, 
      change: metrics.monthlyRevenue > 0 ? "+$" + metrics.monthlyRevenue.toLocaleString() : "$0", 
      color: "text-green-600", 
      icon: DollarSign 
    },
    { 
      title: "Team Members", 
      value: teamMemberCount.toString(), 
      change: `${teamMemberCount > 0 ? '+' : ''}${teamMemberCount}`, 
      color: "text-purple-600", 
      icon: Users 
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_progress': return <Clock className="w-3 h-3" />;
      case 'planning': return <AlertCircle className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                  <p className={`text-lg sm:text-2xl font-bold ${stat.color} truncate`}>{stat.value}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1 hidden sm:flex">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50 self-end sm:self-auto`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Button 
              onClick={() => onNavigateToSection('quotes')}
              className="flex flex-col items-center justify-center h-16 sm:h-20 bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span>Quote</span>
            </Button>
            <Button 
              onClick={() => onNavigateToSection('projects')}
              variant="outline"
              className="flex flex-col items-center justify-center h-16 sm:h-20 text-xs"
            >
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span>Projects</span>
            </Button>
            <Button 
              onClick={() => onNavigateToSection('tools')}
              variant="outline"
              className="flex flex-col items-center justify-center h-16 sm:h-20 text-xs"
            >
              <Wrench className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span>Tools</span>
            </Button>
            <Button 
              onClick={() => onNavigateToSection('profile')}
              variant="outline"
              className="flex flex-col items-center justify-center h-16 sm:h-20 text-xs"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
              <span>Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Recent Projects</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigateToSection('projects')}
            className="text-xs px-2 py-1"
          >
            View All
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 sm:space-y-4">
            {recentProjects.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Building2 className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No recent projects found</p>
              </div>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="flex flex-col gap-2 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{project.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">
                        Client: {project.profiles?.full_name || 'Unknown Customer'}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600 text-sm flex-shrink-0">
                      ${project.budget?.toLocaleString() || '0'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-2">
                    <Badge className={`${getStatusColor(project.status)} text-xs`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-1 capitalize">{project.status.replace('_', ' ')}</span>
                    </Badge>
                    <div className="flex items-center text-xs text-gray-500 flex-shrink-0">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Created: </span>
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
