
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, TrendingUp, LucideIcon } from "lucide-react";

interface PerformanceMetricCardProps {
  metric: string;
  value: number;
  target: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  progressColor: string;
  description: string;
  trend: string;
  isAnimating: boolean;
  animatedValue: number;
}

export const PerformanceMetricCard = ({
  metric,
  value,
  target,
  icon: IconComponent,
  color,
  bgColor,
  borderColor,
  progressColor,
  description,
  trend,
  isAnimating,
  animatedValue
}: PerformanceMetricCardProps) => {
  const actualPercentage = Math.min(100, value);
  const displayValue = isAnimating ? Math.round(animatedValue) : actualPercentage;
  const isExceeded = actualPercentage >= target;

  return (
    <div className={`p-3 sm:p-5 rounded-lg sm:rounded-xl border-2 ${borderColor} ${bgColor} transition-all duration-300 group relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2 sm:mb-4 relative z-10">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className={`p-2 sm:p-3 rounded-md sm:rounded-lg bg-white transition-transform duration-300 ${isAnimating ? 'animate-bounce' : ''}`}>
            <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${color}`} />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-slate-800">{metric}</h4>
            <p className="text-xs text-slate-600 hidden sm:block">{description}</p>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-lg sm:text-2xl font-bold ${color} transition-all duration-300`}>
            {displayValue}%
          </span>
          {trend === "up" && (
            <TrendingUp className="w-3 h-3 text-green-500 inline ml-1" />
          )}
        </div>
      </div>
      
      <div className="space-y-2 sm:space-y-3 relative z-10">
        <div className="relative">
          <div className="h-3 sm:h-4 bg-white/60 rounded-full overflow-hidden">
            <div 
              className={`h-full ${progressColor} transition-all duration-1000 ease-out relative overflow-hidden`}
              style={{ width: `${isAnimating ? animatedValue : actualPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform translate-x-[-100%] animate-pulse"></div>
            </div>
          </div>
          <div 
            className={`absolute top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full transition-all duration-1000 ${isAnimating ? 'animate-pulse' : ''}`}
            style={{ left: `${Math.max(4, Math.min(96, isAnimating ? animatedValue : actualPercentage))}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-slate-600">Target: {target}%</span>
          <div className="flex items-center space-x-1">
            {isExceeded ? (
              <>
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                <span className="text-green-600 font-medium text-xs sm:text-sm">Target Exceeded!</span>
              </>
            ) : (
              <span className="text-amber-600 font-medium text-xs sm:text-sm">
                {(target - actualPercentage).toFixed(1)}% to target
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
