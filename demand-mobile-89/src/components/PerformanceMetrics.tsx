
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Lightbulb, ArrowUp, TrendingUp, TrendingDown, Info } from "lucide-react";

interface PerformanceMetric {
  label: string;
  value: number;
  target: number;
  status: 'excellent' | 'good' | 'needs_improvement';
  tip: string;
}

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
}

export const PerformanceMetrics = ({ metrics }: PerformanceMetricsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs_improvement': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'good': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      case 'needs_improvement': return <TrendingDown className="w-4 h-4 text-orange-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>Performance Metrics</span>
        </CardTitle>
        <CardDescription>Track your key performance indicators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{metric.label}</span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(metric.status)}
                  <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                    {metric.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.value}{metric.label === 'Avg Job Value' ? '$' : '%'}</span>
                  <span className="text-gray-500">Target: {metric.target}{metric.label === 'Avg Job Value' ? '$' : '%'}</span>
                </div>
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
              </div>
              <p className="text-xs text-gray-600 flex items-center space-x-1">
                <Lightbulb className="w-3 h-3" />
                <span>{metric.tip}</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
