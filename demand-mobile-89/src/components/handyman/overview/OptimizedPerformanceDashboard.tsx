
import React, { useState, useCallback, useEffect, memo, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { PerformanceHeader } from "./performance/PerformanceHeader";
import { PerformanceMetricCard } from "./performance/PerformanceMetricCard";
import { PerformanceSummary } from "./performance/PerformanceSummary";
import type { PerformanceMetrics } from "./types";
import {
  Target,
  Users,
  Clock,
  Wrench,
  TrendingUp,
  CheckCircle2,
  Zap,
  Star,
  BarChart3
} from "lucide-react";
import { createProgressAnimation, defaultAnimationConfig } from "@/utils/animationHelpers";
import { formatPerformanceDescription } from "@/utils/performanceCalculations";

interface OptimizedPerformanceDashboardProps {
  performanceMetrics: PerformanceMetrics;
  activeSkills: number;
  workAreas: number;
}

interface AnimatedValues {
  jobCompletion: number;
  customerSatisfaction: number;
  responseTime: number;
  skillUtilization: number;
}

// Memoized components to prevent unnecessary re-renders
const MemoizedPerformanceHeader = memo(PerformanceHeader);
const MemoizedPerformanceMetricCard = memo(PerformanceMetricCard);
const MemoizedPerformanceSummary = memo(PerformanceSummary);

export const OptimizedPerformanceDashboard = memo(({
  performanceMetrics,
  activeSkills,
  workAreas
}: OptimizedPerformanceDashboardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<AnimatedValues>({
    jobCompletion: 0,
    customerSatisfaction: 0,
    responseTime: 0,
    skillUtilization: 0
  });

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);

    // Reset animated values
    setAnimatedValues({
      jobCompletion: 0,
      customerSatisfaction: 0,
      responseTime: 0,
      skillUtilization: 0
    });

    // Create animation using utility
    const cleanup = createProgressAnimation(
      {
        jobCompletion: performanceMetrics.jobCompletion,
        customerSatisfaction: performanceMetrics.customerSatisfaction,
        responseTime: performanceMetrics.responseTime,
        skillUtilization: performanceMetrics.skillUtilization
      },
      defaultAnimationConfig,
      (values) => {
        setAnimatedValues({
          jobCompletion: values.jobCompletion || 0,
          customerSatisfaction: values.customerSatisfaction || 0,
          responseTime: values.responseTime || 0,
          skillUtilization: values.skillUtilization || 0
        });
      },
      () => setIsAnimating(false)
    );

    return cleanup;
  }, [performanceMetrics]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanup = triggerAnimation();
      return cleanup;
    }, 300);

    return () => clearTimeout(timer);
  }, [triggerAnimation]);

  // Memoize metrics array to prevent recreation on every render
  const metrics = useMemo(() => [
    {
      metric: "Job Completion Rate",
      value: performanceMetrics.jobCompletion,
      target: 85,
      icon: Target,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200 hover:border-emerald-300",
      progressColor: "bg-gradient-to-r from-emerald-400 to-emerald-600",
      description: formatPerformanceDescription("Job Completion Rate", performanceMetrics.jobCompletion),
      trend: "up" as const
    },
    {
      metric: "Customer Satisfaction",
      value: performanceMetrics.customerSatisfaction,
      target: 90,
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200 hover:border-blue-300",
      progressColor: "bg-gradient-to-r from-blue-400 to-blue-600",
      description: formatPerformanceDescription("Customer Satisfaction", performanceMetrics.customerSatisfaction),
      trend: "up" as const
    },
    {
      metric: "Response Time",
      value: performanceMetrics.responseTime,
      target: 80,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200 hover:border-purple-300",
      progressColor: "bg-gradient-to-r from-purple-400 to-purple-600",
      description: formatPerformanceDescription("Response Time", performanceMetrics.responseTime),
      trend: "up" as const
    },
    {
      metric: "Skill Utilization",
      value: performanceMetrics.skillUtilization,
      target: 75,
      icon: Wrench,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200 hover:border-amber-300",
      progressColor: "bg-gradient-to-r from-amber-400 to-amber-600",
      description: formatPerformanceDescription("Skill Utilization", performanceMetrics.skillUtilization),
      trend: "up" as const
    }
  ], [performanceMetrics]);

  return (
    <Card className="overflow-hidden bg-white/50 backdrop-blur-sm rounded-[2rem] sm:rounded-[3rem] border border-black/5 transition-all duration-500">
      <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
        {/* Enhanced Header */}
        <div className="text-center space-y-2 sm:space-y-3">
          <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
            <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
              Performance Analytics
            </h2>
          </div>
          <div className="w-12 h-0.5 sm:w-16 sm:h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
        </div>

        {/* Metrics Grid - Enhanced Responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {metrics.map((metric, index) => (
            <div key={metric.metric} className="transition-all duration-300">
              <MemoizedPerformanceMetricCard
                {...metric}
                isAnimating={isAnimating}
                animatedValue={animatedValues[metric.metric.toLowerCase().replace(/\s+/g, '') as keyof AnimatedValues] || 0}
              />
            </div>
          ))}
        </div>

        {/* Enhanced Summary Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-gray-100 backdrop-blur-sm">
          <MemoizedPerformanceSummary
            activeSkills={activeSkills}
            workAreas={workAreas}
            onRefresh={triggerAnimation}
          />
        </div>
      </div>
    </Card>
  );
});

OptimizedPerformanceDashboard.displayName = 'OptimizedPerformanceDashboard';
