
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity } from "lucide-react";

interface PerformanceHeaderProps {
  isAnimating: boolean;
}

export const PerformanceHeader = ({ isAnimating }: PerformanceHeaderProps) => {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Performance Analytics
            </span>
          </CardTitle>
          <p className="text-slate-600 mt-1">Real-time performance metrics and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <Activity className={`w-4 h-4 ${isAnimating ? 'text-green-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-xs ${isAnimating ? 'text-green-600' : 'text-slate-500'}`}>
              {isAnimating ? 'Updating...' : 'Live'}
            </span>
          </div>
          <Badge className="bg-green-100 text-green-700 px-3 py-1">
            Real-Time Data
          </Badge>
        </div>
      </div>
    </CardHeader>
  );
};
