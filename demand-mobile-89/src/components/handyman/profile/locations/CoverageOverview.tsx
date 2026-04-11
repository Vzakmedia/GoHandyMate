
import { Badge } from "@/components/ui/badge";
import { ResponsiveCard } from "@/components/ResponsiveCard";

interface CoverageOverviewProps {
  serviceAreasCount: number;
}

export const CoverageOverview = ({ serviceAreasCount }: CoverageOverviewProps) => {
  return (
    <ResponsiveCard title="Coverage Overview">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-blue-600">
              {serviceAreasCount}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Service Areas</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg sm:text-xl font-bold text-green-600">25mi</div>
            <div className="text-xs sm:text-sm text-gray-600">Max Radius</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Coverage Status</span>
            <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Response Time</span>
            <span className="font-medium">~30 min avg</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Travel Distance</span>
            <span className="font-medium">15-25 miles</span>
          </div>
        </div>
      </div>
    </ResponsiveCard>
  );
};
