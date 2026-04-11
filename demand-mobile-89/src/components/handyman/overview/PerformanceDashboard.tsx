
import { useState, useCallback, useEffect } from "react";
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
  Star
} from "lucide-react";

interface PerformanceDashboardProps {
  performanceMetrics: PerformanceMetrics;
  activeSkills: number;
  workAreas: number;
}

export const PerformanceDashboard = ({ 
  performanceMetrics, 
  activeSkills, 
  workAreas 
}: PerformanceDashboardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
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

    // Animate to target values
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setAnimatedValues({
        jobCompletion: performanceMetrics.jobCompletion * easeOutQuart,
        customerSatisfaction: performanceMetrics.customerSatisfaction * easeOutQuart,
        responseTime: performanceMetrics.responseTime * easeOutQuart,
        skillUtilization: performanceMetrics.skillUtilization * easeOutQuart
      });
      
      if (step >= steps) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, stepDuration);
  }, [performanceMetrics]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerAnimation();
    }, 500);

    return () => clearTimeout(timer);
  }, [triggerAnimation]);

  const metrics = [
    {
      metric: "Job Completion Rate",
      value: performanceMetrics.jobCompletion,
      target: 85,
      icon: Target,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      progressColor: "bg-gradient-to-r from-emerald-400 to-emerald-600",
      description: "Successfully completed projects",
      trend: "up" as const
    },
    {
      metric: "Customer Satisfaction",
      value: performanceMetrics.customerSatisfaction,
      target: 90,
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200", 
      progressColor: "bg-gradient-to-r from-blue-400 to-blue-600",
      description: "Average customer rating",
      trend: "up" as const
    },
    {
      metric: "Response Time",
      value: performanceMetrics.responseTime,
      target: 80,
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      progressColor: "bg-gradient-to-r from-purple-400 to-purple-600",
      description: "Quick response to inquiries",
      trend: "up" as const
    },
    {
      metric: "Skill Utilization",
      value: performanceMetrics.skillUtilization,
      target: 75,
      icon: Wrench,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      progressColor: "bg-gradient-to-r from-amber-400 to-amber-600",
      description: "Active skills being used",
      trend: "up" as const
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-blue-100">
      <PerformanceHeader isAnimating={isAnimating} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <PerformanceMetricCard
            key={metric.metric}
            {...metric}
            isAnimating={isAnimating}
            animatedValue={animatedValues[metric.metric.toLowerCase().replace(/\s+/g, '') as keyof typeof animatedValues] || 0}
          />
        ))}
      </div>

      <PerformanceSummary 
        activeSkills={activeSkills}
        workAreas={workAreas}
        onRefresh={triggerAnimation}
      />
    </Card>
  );
};
