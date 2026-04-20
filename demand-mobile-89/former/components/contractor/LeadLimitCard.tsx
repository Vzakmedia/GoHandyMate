
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "lucide-react";

interface LeadLimitCardProps {
  jobsThisMonth: number;
  leadLimit: number;
  canAcceptJob: () => boolean;
}

export const LeadLimitCard = ({ jobsThisMonth, leadLimit, canAcceptJob }: LeadLimitCardProps) => {
  const progressPercentage = leadLimit === -1 ? 0 : Math.min((jobsThisMonth / leadLimit) * 100, 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Monthly Lead Limit</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Leads this month:</span>
            <span className="font-medium">
              {jobsThisMonth} / {leadLimit === -1 ? "Unlimited" : leadLimit}
            </span>
          </div>
          {leadLimit !== -1 && (
            <Progress value={progressPercentage} className="h-2" />
          )}
          {!canAcceptJob() && leadLimit !== -1 && (
            <p className="text-sm text-orange-600">
              You've reached your monthly lead limit. Upgrade for more opportunities!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
