
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Star, Calendar, TrendingUp, Award } from "lucide-react";

interface AchievementsGoalsProps {
  stats: {
    responseRate: number;
    clientRetention: number;
    avgJobValue: number;
    rating: number;
  };
  completedJobs: number;
  totalEarnings: number;
  activeJobs: number;
}

export const AchievementsGoals = ({ stats, completedJobs, totalEarnings, activeJobs }: AchievementsGoalsProps) => {
  // Real achievements based on actual data
  const achievements = [
    {
      id: 1,
      title: "First Job Complete",
      description: "Complete your first job",
      icon: Trophy,
      unlocked: completedJobs >= 1,
      progress: Math.min(100, (completedJobs / 1) * 100)
    },
    {
      id: 2,
      title: "Job Master",
      description: "Complete 10 jobs",
      icon: Target,
      unlocked: completedJobs >= 10,
      progress: Math.min(100, (completedJobs / 10) * 100)
    },
    {
      id: 3,
      title: "Five Star Hero",
      description: "Achieve 4.5+ star rating",
      icon: Star,
      unlocked: stats.rating >= 4.5,
      progress: Math.min(100, (stats.rating / 4.5) * 100)
    },
    {
      id: 4,
      title: "Earnings Milestone",
      description: "Earn $1,000 total",
      icon: Award,
      unlocked: totalEarnings >= 1000,
      progress: Math.min(100, (totalEarnings / 1000) * 100)
    }
  ];

  // Real goals based on current performance
  const goals = [
    {
      label: "Monthly Jobs",
      current: completedJobs,
      target: Math.max(5, completedJobs + 3),
      unit: "jobs"
    },
    {
      label: "Customer Rating",
      current: stats.rating,
      target: 4.8,
      unit: "stars"
    },
    {
      label: "Response Rate",
      current: stats.responseRate,
      target: 95,
      unit: "%"
    },
    {
      label: "Average Job Value",
      current: stats.avgJobValue,
      target: Math.max(150, stats.avgJobValue + 50),
      unit: "$"
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span>Achievements & Goals</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Achievements */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Achievements</h4>
            <Badge className="bg-yellow-100 text-yellow-700">
              {unlockedAchievements}/{achievements.length} Unlocked
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 text-center ${
                    achievement.unlocked 
                      ? 'bg-yellow-50 border-yellow-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`mx-auto mb-2 p-2 rounded-full w-fit ${
                    achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-4 h-4 ${
                      achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <h5 className="font-medium text-sm">{achievement.title}</h5>
                  <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                  {!achievement.unlocked && (
                    <Progress value={achievement.progress} className="h-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Goals */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Current Goals</h4>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="space-y-3">
            {goals.map((goal, index) => {
              const percentage = Math.min(100, (goal.current / goal.target) * 100);
              const isCompleted = percentage >= 100;
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.label}</span>
                    <span className="text-gray-600">
                      {goal.unit === '$' ? '$' : ''}{goal.current.toFixed(goal.unit === 'stars' ? 1 : 0)}{goal.unit !== '$' ? goal.unit : ''} / {goal.unit === '$' ? '$' : ''}{goal.target.toFixed(goal.unit === 'stars' ? 1 : 0)}{goal.unit !== '$' ? goal.unit : ''}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {isCompleted ? (
                      <span className="text-green-600 flex items-center">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Goal achieved!
                      </span>
                    ) : (
                      <span>
                        {goal.unit === '$' ? '$' : ''}{(goal.target - goal.current).toFixed(goal.unit === 'stars' ? 1 : 0)}{goal.unit !== '$' ? goal.unit : ''} to goal
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{activeJobs}</div>
              <div className="text-xs text-gray-600">Active Jobs</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">${totalEarnings}</div>
              <div className="text-xs text-gray-600">Total Earned</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
