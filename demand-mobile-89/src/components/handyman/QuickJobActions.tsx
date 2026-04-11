
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useHandymanData } from "@/hooks/useHandymanData";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign,
  ArrowRight,
  Zap,
  Loader2
} from "lucide-react";

interface QuickJobActionsProps {
  onNavigateToJobs: () => void;
  onNavigateToEarnings: () => void;
}

export const QuickJobActions = ({ 
  onNavigateToJobs, 
  onNavigateToEarnings 
}: QuickJobActionsProps) => {
  const { data: handymanData, loading } = useHandymanData();

  // Calculate real stats from handyman data
  const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
  const averageRate = activeSkills.length > 0 
    ? activeSkills.reduce((sum, skill) => sum + (Number(skill.hourly_rate) || 0), 0) / activeSkills.length 
    : 0;
  const activeServices = handymanData.servicePricing?.filter(service => service.is_active) || [];
  const workAreas = handymanData.workAreas || [];

  const weeklyEarnings = Math.round(averageRate * 15); // Estimated current week
  const todaysJobs = Math.max(0, Math.floor(activeServices.length / 7)); // Estimate jobs today

  // Mock urgent jobs based on user's skills
  const generateUrgentJobs = () => {
    if (activeSkills.length === 0) return [];
    
    const jobTypes = activeSkills.slice(0, 2).map(skill => ({
      skillName: skill.skill_name,
      rate: skill.hourly_rate
    }));

    return jobTypes.map((job, index) => ({
      id: index + 1,
      title: `${job.skillName} Service`,
      location: workAreas.length > 0 ? "Your Service Area" : "Nearby",
      pay: Math.round(Number(job.rate) * 2), // 2 hour job estimate
      urgency: index === 0 ? "Today" : "Tomorrow",
      distance: "2.3 miles"
    }));
  };

  const urgentJobs = generateUrgentJobs();

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-3 sm:p-0">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="cursor-pointer transition-shadow" onClick={onNavigateToEarnings}>
          <CardContent className="p-3 sm:p-4 text-center">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg sm:text-xl font-bold">${weeklyEarnings}</div>
            <div className="text-xs sm:text-sm text-gray-600">This Week Potential</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-shadow" onClick={onNavigateToEarnings}>
          <CardContent className="p-3 sm:p-4 text-center">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-lg sm:text-xl font-bold">{todaysJobs}</div>
            <div className="text-xs sm:text-sm text-gray-600">Potential Jobs Today</div>
          </CardContent>
        </Card>
      </div>

      {/* Profile-Based Job Opportunities */}
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mr-2" />
              Job Opportunities
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onNavigateToJobs} className="text-xs sm:text-sm">
              View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-3 sm:p-6 sm:pt-0">
          {urgentJobs.length > 0 ? (
            urgentJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base truncate">{job.title}</h4>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{job.location} • {job.distance}</span>
                    </div>
                  </div>
                  <div className="text-right ml-2 flex-shrink-0">
                    <div className="font-bold text-green-600 text-sm sm:text-base">${job.pay}</div>
                    <Badge 
                      variant={job.urgency === 'Today' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {job.urgency}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" className="w-full text-xs sm:text-sm">
                  Apply Now
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                No Job Opportunities Available
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Complete your profile setup to start seeing job opportunities
              </p>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <p>• Add your skills and hourly rates</p>
                <p>• Configure service pricing</p>
                <p>• Define your work areas</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        <Button 
          variant="outline" 
          onClick={onNavigateToJobs} 
          className="justify-start text-sm sm:text-base h-10 sm:h-11"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Browse All Jobs
        </Button>
        <Button 
          variant="outline" 
          onClick={onNavigateToEarnings} 
          className="justify-start text-sm sm:text-base h-10 sm:h-11"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          View Earnings
        </Button>
      </div>
    </div>
  );
};
