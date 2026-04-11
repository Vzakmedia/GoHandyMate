
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, RefreshCw } from "lucide-react";

interface PerformanceSummaryProps {
  activeSkills: number;
  workAreas: number;
  onRefresh: () => void;
}

export const PerformanceSummary = ({
  activeSkills,
  workAreas,
  onRefresh
}: PerformanceSummaryProps) => {
  return (
    <div className="mt-3 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl border-2 border-blue-100 relative overflow-hidden">
      <div className="flex items-start sm:items-center justify-between relative z-10 gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-slate-800 flex items-center space-x-1 sm:space-x-2">
            <span className="truncate">Performance Summary</span>
            <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">Current active metrics overview</p>
        </div>
        <div className="flex items-center">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 h-8 px-2 sm:px-3 text-xs sm:text-sm"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="mt-2 sm:mt-4 p-2 sm:p-3 bg-slate-50 rounded-lg border">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <h5 className="text-xs sm:text-sm font-medium text-slate-700">Live Statistics</h5>
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center text-xs sm:text-sm">
          <div>
            <div className="font-semibold text-slate-800 text-base sm:text-lg">{activeSkills}</div>
            <div className="text-slate-600">Service Categories</div>
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-base sm:text-lg">{workAreas}</div>
            <div className="text-slate-600">Work Areas</div>
          </div>
        </div>
      </div>
    </div>
  );
};
