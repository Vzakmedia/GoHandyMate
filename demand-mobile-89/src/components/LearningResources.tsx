
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, FileText, Star, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LearningResourcesProps {
  completedJobs: number;
  skillsCount: number;
}

export const LearningResources = ({ completedJobs, skillsCount }: LearningResourcesProps) => {
  const navigate = useNavigate();

  // Personalized learning resources based on user data
  const getPersonalizedResources = () => {
    const resources = [];

    if (completedJobs < 5) {
      resources.push({
        id: 'getting-started',
        title: "Getting Started as a Handyman",
        description: "Essential tips for your first jobs",
        type: "video",
        icon: Play,
        priority: "high",
        reason: "You're just starting out"
      });
    }

    if (skillsCount < 3) {
      resources.push({
        id: 'expanding-skills',
        title: "Expanding Your Service Skills",
        description: "Learn high-demand handyman skills",
        type: "guide",
        icon: FileText,
        priority: "high",
        reason: `You have ${skillsCount} skills configured`
      });
    }

    if (completedJobs >= 5 && completedJobs < 20) {
      resources.push({
        id: 'customer-relationships',
        title: "Building Customer Relationships",
        description: "Turn one-time clients into repeat customers",
        type: "article",
        icon: Users,
        priority: "medium",
        reason: `${completedJobs} jobs completed - time to focus on retention`
      });
    }

    if (completedJobs >= 10) {
      resources.push({
        id: 'premium-pricing',
        title: "Premium Service Pricing",
        description: "Strategies to increase your hourly rates",
        type: "video",
        icon: TrendingUp,
        priority: "medium",
        reason: "Ready for advanced pricing strategies"
      });
    }

    // Always include these general resources
    resources.push(
      {
        id: 'customer-service',
        title: "Customer Service Excellence",
        description: "5-minute read on customer satisfaction",
        type: "article",
        icon: BookOpen,
        priority: "low",
        reason: "Universal best practice"
      },
      {
        id: 'safety-insurance',
        title: "Safety & Insurance Guide",
        description: "Protect yourself and your business",
        type: "guide",
        icon: FileText,
        priority: "medium",
        reason: "Essential for all handymen"
      }
    );

    return resources.slice(0, 4); // Limit to 4 resources
  };

  const resources = getPersonalizedResources();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'guide': return FileText;
      default: return BookOpen;
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'video': return 'Watch';
      case 'guide': return 'Download';
      default: return 'Read';
    }
  };

  const handleResourceClick = (resourceId: string) => {
    navigate(`/learning/${resourceId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          <span>Learning Resources</span>
        </CardTitle>
        {completedJobs > 0 && (
          <p className="text-sm text-gray-600">
            Personalized for your progress: {completedJobs} jobs completed, {skillsCount} skills active
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {resources.map((resource, index) => {
          const IconComponent = resource.icon;
          const TypeIconComponent = getTypeIcon(resource.type);
          
          return (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3 flex-1">
                <div className="p-2 bg-green-50 rounded-lg">
                  <IconComponent className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{resource.title}</h4>
                    <Badge className={getPriorityColor(resource.priority)}>
                      {resource.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{resource.reason}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <TypeIconComponent className="w-3 h-3" />
                  <span className="capitalize">{resource.type}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleResourceClick(resource.id)}
                >
                  {getActionText(resource.type)}
                </Button>
              </div>
            </div>
          );
        })}

        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Learning Progress</span>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">
                {completedJobs > 0 ? 'Intermediate' : 'Beginner'} Level
              </span>
            </div>
          </div>
          {completedJobs > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Complete {Math.max(0, 20 - completedJobs)} more jobs to reach Advanced level
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
