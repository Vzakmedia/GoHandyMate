
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Play, FileText, Clock, Users, Star, Shield } from "lucide-react";

const learningResources = {
  'getting-started': {
    title: "Getting Started as a Handyman",
    type: "video",
    priority: "high",
    description: "Essential tips for your first jobs",
    content: "This comprehensive video guide covers everything you need to know when starting your handyman career.",
    sections: [
      "Setting up your toolkit",
      "Pricing your first jobs",
      "Customer communication basics",
      "Safety protocols",
      "Building your reputation"
    ],
    duration: "25 minutes",
    icon: Play
  },
  'customer-service': {
    title: "Customer Service Excellence",
    type: "article",
    priority: "low",
    description: "5-minute read on customer satisfaction",
    content: "Learn the key principles of outstanding customer service that will set you apart from the competition.",
    sections: [
      "First impressions matter",
      "Clear communication strategies",
      "Managing expectations",
      "Handling complaints professionally",
      "Following up after completion"
    ],
    duration: "5 minutes",
    icon: Users
  },
  'safety-insurance': {
    title: "Safety & Insurance Guide",
    type: "guide",
    priority: "medium",
    description: "Protect yourself and your business",
    content: "A comprehensive guide to staying safe on the job and protecting your business with proper insurance.",
    sections: [
      "Personal protective equipment",
      "Job site safety protocols",
      "Liability insurance basics",
      "Workers compensation",
      "Risk assessment techniques"
    ],
    duration: "15 minutes",
    icon: Shield
  },
  'expanding-skills': {
    title: "Expanding Your Service Skills",
    type: "guide",
    priority: "high",
    description: "Learn high-demand handyman skills",
    content: "Discover which skills are in highest demand and how to develop them to grow your business.",
    sections: [
      "Market research for skills",
      "Plumbing basics",
      "Electrical safety",
      "Carpentry techniques",
      "HVAC fundamentals"
    ],
    duration: "30 minutes",
    icon: FileText
  },
  'customer-relationships': {
    title: "Building Customer Relationships",
    type: "article",
    priority: "medium",
    description: "Turn one-time clients into repeat customers",
    content: "Learn proven strategies to build lasting relationships with customers and create a steady stream of repeat business.",
    sections: [
      "Building trust and rapport",
      "Exceeding expectations",
      "Follow-up strategies",
      "Referral programs",
      "Customer loyalty techniques"
    ],
    duration: "8 minutes",
    icon: Users
  },
  'premium-pricing': {
    title: "Premium Service Pricing",
    type: "video",
    priority: "medium",
    description: "Strategies to increase your hourly rates",
    content: "Advanced pricing strategies that allow you to command premium rates while delivering exceptional value.",
    sections: [
      "Value-based pricing",
      "Market positioning",
      "Premium service delivery",
      "Rate increase strategies",
      "Justifying higher prices"
    ],
    duration: "20 minutes",
    icon: Star
  }
};

export const LearningResourcesPage = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  
  const resource = resourceId ? learningResources[resourceId as keyof typeof learningResources] : null;

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Resource Not Found</h1>
            <p className="text-gray-600 mb-6">The learning resource you're looking for doesn't exist.</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = resource.icon;
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getActionText = (type: string) => {
    switch (type) {
      case 'video': return 'Watch Now';
      case 'guide': return 'Download Guide';
      default: return 'Read Article';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Growth Hub
          </Button>
          
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <IconComponent className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">{resource.title}</h1>
                <Badge className={getPriorityColor(resource.priority)}>
                  {resource.priority} priority
                </Badge>
              </div>
              <p className="text-lg text-gray-600 mb-4">{resource.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{resource.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="capitalize">{resource.type}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-6">{resource.content}</p>
                
                {/* Mock content area */}
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <IconComponent className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    {resource.type === 'video' ? 'Video Content' : 
                     resource.type === 'guide' ? 'Downloadable Guide' : 'Article Content'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {resource.type === 'video' ? 'Interactive video player would be embedded here' :
                     resource.type === 'guide' ? 'PDF download and preview would be available here' :
                     'Full article content would be displayed here'}
                  </p>
                  <Button size="lg">
                    {getActionText(resource.type)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {resource.sections.map((section, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{section}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Bookmark Resource
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Share with Team
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Mark as Completed
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
