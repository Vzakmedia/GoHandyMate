
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Camera, MessageSquare, Star, Users } from "lucide-react";

interface GrowthTip {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  impact: string;
  color: string;
  isCompleted: boolean;
}

interface GrowthTipsProps {
  completedJobs: number;
  totalEarnings: number;
  activeSkills: number;
  rating: number;
}

export const GrowthTips = ({ completedJobs, totalEarnings, activeSkills, rating }: GrowthTipsProps) => {
  const growthTips: GrowthTip[] = [
    {
      icon: Camera,
      title: "Upload Quality Photos",
      description: completedJobs > 0 
        ? `Great! You've completed ${completedJobs} jobs. Keep showcasing your work quality`
        : "Add before/after photos to showcase your work quality",
      impact: "30% more bookings",
      color: "bg-blue-50 border-blue-200",
      isCompleted: completedJobs > 0
    },
    {
      icon: MessageSquare,
      title: "Quick Response Time",
      description: rating >= 4.5 
        ? "Excellent! Your quick responses are paying off"
        : "Respond to requests within 2 hours for better rankings",
      impact: "25% higher visibility",
      color: "bg-green-50 border-green-200",
      isCompleted: rating >= 4.5
    },
    {
      icon: Star,
      title: "Build Your Rating",
      description: rating >= 4.5 
        ? `Outstanding ${rating.toFixed(1)} star rating! Keep up the great work`
        : `Current rating: ${rating.toFixed(1)} stars. Follow up for more 5-star reviews`,
      impact: "40% more trust",
      color: "bg-yellow-50 border-yellow-200",
      isCompleted: rating >= 4.5
    },
    {
      icon: Users,
      title: "Expand Your Skills",
      description: activeSkills >= 3 
        ? `Perfect! ${activeSkills} active skills help you get diverse jobs`
        : `You have ${activeSkills} skills. Add more to access more opportunities`,
      impact: "60% revenue increase",
      color: "bg-purple-50 border-purple-200",
      isCompleted: activeSkills >= 3
    }
  ];

  const completedTips = growthTips.filter(tip => tip.isCompleted).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-600" />
          <span>Growth Tips & Best Practices</span>
          <Badge className="bg-green-100 text-green-700">
            {completedTips}/{growthTips.length} Completed
          </Badge>
        </CardTitle>
        <CardDescription>
          {totalEarnings > 0 
            ? `Based on your $${totalEarnings} total earnings and ${completedJobs} completed jobs`
            : "Proven strategies to increase your bookings and earnings"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {growthTips.map((tip, index) => (
            <div key={index} className={`p-4 rounded-lg border-2 ${tip.color} ${tip.isCompleted ? 'opacity-75' : ''}`}>
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <tip.icon className="w-6 h-6 mt-1 text-gray-700" />
                  {tip.isCompleted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <Star className="w-2 h-2 text-white fill-current" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    {tip.title}
                    {tip.isCompleted && (
                      <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                        Done
                      </Badge>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {tip.impact}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
