
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock, 
  Star, 
  Calendar, 
  Target,
  Award,
  Lightbulb,
  Users,
  MapPin,
  ChartBar,
  ArrowUp
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface EarningsMetrics {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  thisWeek: number;
  avgPerJob: number;
  peakEarningHour: string;
  completionRate: number;
  responseTime: number;
}

interface OpportunityCard {
  id: string;
  title: string;
  description: string;
  potentialEarnings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  icon: any;
}

export const ProviderEarnings = () => {
  const [timeFilter, setTimeFilter] = useState("thisMonth");
  const [selectedMetric, setSelectedMetric] = useState("earnings");

  // Mock earnings data
  const earningsMetrics: EarningsMetrics = {
    totalEarnings: 12450,
    thisMonth: 2840,
    lastMonth: 2180,
    thisWeek: 685,
    avgPerJob: 95,
    peakEarningHour: "2-4 PM",
    completionRate: 96.8,
    responseTime: 12
  };

  // Daily earnings data for the past 30 days
  const dailyEarnings = [
    { date: "Day 1", earnings: 125, jobs: 2 },
    { date: "Day 2", earnings: 89, jobs: 1 },
    { date: "Day 3", earnings: 156, jobs: 3 },
    { date: "Day 4", earnings: 203, jobs: 2 },
    { date: "Day 5", earnings: 145, jobs: 2 },
    { date: "Day 6", earnings: 267, jobs: 4 },
    { date: "Day 7", earnings: 189, jobs: 2 },
    { date: "Day 8", earnings: 234, jobs: 3 },
    { date: "Day 9", earnings: 178, jobs: 2 },
    { date: "Day 10", earnings: 298, jobs: 4 },
    { date: "Day 11", earnings: 156, jobs: 2 },
    { date: "Day 12", earnings: 189, jobs: 2 },
    { date: "Day 13", earnings: 245, jobs: 3 },
    { date: "Day 14", earnings: 312, jobs: 4 },
    { date: "Day 15", earnings: 198, jobs: 2 },
    { date: "Day 16", earnings: 167, jobs: 2 },
    { date: "Day 17", earnings: 289, jobs: 3 },
    { date: "Day 18", earnings: 223, jobs: 3 },
    { date: "Day 19", earnings: 156, jobs: 2 },
    { date: "Day 20", earnings: 345, jobs: 4 },
    { date: "Day 21", earnings: 278, jobs: 3 },
    { date: "Day 22", earnings: 234, jobs: 3 },
    { date: "Day 23", earnings: 189, jobs: 2 },
    { date: "Day 24", earnings: 267, jobs: 3 },
    { date: "Day 25", earnings: 198, jobs: 2 },
    { date: "Day 26", earnings: 312, jobs: 4 },
    { date: "Day 27", earnings: 245, jobs: 3 },
    { date: "Day 28", earnings: 289, jobs: 3 },
    { date: "Day 29", earnings: 334, jobs: 4 },
    { date: "Day 30", earnings: 298, jobs: 3 }
  ];

  // Monthly comparison data
  const monthlyComparison = [
    { month: "Jan", earnings: 1890, jobs: 24 },
    { month: "Feb", earnings: 2120, jobs: 28 },
    { month: "Mar", earnings: 2350, jobs: 31 },
    { month: "Apr", earnings: 2180, jobs: 29 },
    { month: "May", earnings: 2640, jobs: 35 },
    { month: "Jun", earnings: 2840, jobs: 38 }
  ];

  // Hourly earnings distribution
  const hourlyEarnings = [
    { hour: "6 AM", earnings: 45 },
    { hour: "8 AM", earnings: 78 },
    { hour: "10 AM", earnings: 156 },
    { hour: "12 PM", earnings: 234 },
    { hour: "2 PM", earnings: 298 },
    { hour: "4 PM", earnings: 267 },
    { hour: "6 PM", earnings: 189 },
    { hour: "8 PM", earnings: 134 },
    { hour: "10 PM", earnings: 89 }
  ];

  // Service category breakdown
  const categoryEarnings = [
    { name: "Plumbing", value: 35, earnings: 994 },
    { name: "Electrical", value: 28, earnings: 795 },
    { name: "Handyman", value: 22, earnings: 625 },
    { name: "Painting", value: 15, earnings: 426 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Earning opportunities
  const earningOpportunities: OpportunityCard[] = [
    {
      id: '1',
      title: 'Expand Service Hours',
      description: 'Work during peak hours (2-4 PM) to increase earnings by 40%',
      potentialEarnings: 480,
      difficulty: 'easy',
      category: 'Schedule',
      icon: Clock
    },
    {
      id: '2',
      title: 'Add Emergency Services',
      description: 'Offer 24/7 emergency repairs for premium rates',
      potentialEarnings: 750,
      difficulty: 'medium',
      category: 'Service',
      icon: Award
    },
    {
      id: '3',
      title: 'Get Certified',
      description: 'Earn additional certifications to access higher-paying jobs',
      potentialEarnings: 920,
      difficulty: 'hard',
      category: 'Skills',
      icon: Star
    },
    {
      id: '4',
      title: 'Improve Response Time',
      description: 'Respond to requests faster to win more jobs',
      potentialEarnings: 340,
      difficulty: 'easy',
      category: 'Performance',
      icon: TrendingUp
    },
    {
      id: '5',
      title: 'Expand Service Area',
      description: 'Increase your service radius to access more customers',
      potentialEarnings: 560,
      difficulty: 'medium',
      category: 'Location',
      icon: MapPin
    },
    {
      id: '6',
      title: 'Bundle Services',
      description: 'Offer package deals to increase average job value',
      potentialEarnings: 640,
      difficulty: 'medium',
      category: 'Strategy',
      icon: Target
    }
  ];

  const getEarningsChange = () => {
    const change = ((earningsMetrics.thisMonth - earningsMetrics.lastMonth) / earningsMetrics.lastMonth) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    };
  };

  const earningsChange = getEarningsChange();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const chartConfig = {
    earnings: {
      label: "Earnings",
      color: "#3b82f6",
    },
    jobs: {
      label: "Jobs",
      color: "#10b981",
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings Overview</h1>
          <p className="text-gray-600">Track your income and discover new earning opportunities</p>
        </div>
        <div className="flex space-x-3">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="earnings">Earnings</SelectItem>
              <SelectItem value="jobs">Jobs</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="last3Months">Last 3 Months</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${earningsMetrics.totalEarnings.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-gray-600 mt-1">
              {earningsChange.isPositive ? (
                <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
              ) : (
                <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
              )}
              <span className={earningsChange.isPositive ? 'text-green-600' : 'text-red-600'}>
                {earningsChange.value}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earningsMetrics.thisMonth}</div>
            <p className="text-xs text-gray-600">
              ${earningsMetrics.avgPerJob} avg per job
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsMetrics.peakEarningHour}</div>
            <p className="text-xs text-gray-600">
              Highest earning window
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{earningsMetrics.completionRate}%</div>
            <p className="text-xs text-gray-600">
              {earningsMetrics.responseTime}min avg response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Earning Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Analysis</TabsTrigger>
          <TabsTrigger value="opportunities">Growth Opportunities</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Earnings (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailyEarnings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="earnings" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Monthly Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="earnings" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Earnings by Service Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryEarnings}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryEarnings.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryEarnings.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-600">{category.value}% of jobs</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${category.earnings}</div>
                      <div className="text-sm text-gray-600">this month</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hourly Earnings Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyEarnings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="earnings" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {earningOpportunities.map((opportunity) => {
              const IconComponent = opportunity.icon;
              return (
                <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      <Badge className={getDifficultyColor(opportunity.difficulty)}>
                        {opportunity.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{opportunity.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          +${opportunity.potentialEarnings}
                        </div>
                        <div className="text-xs text-gray-500">potential monthly increase</div>
                      </div>
                      <Badge variant="outline">{opportunity.category}</Badge>
                    </div>
                    <Button className="w-full" size="sm">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Earning Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Earning Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current: ${earningsMetrics.thisMonth}</span>
                <span className="text-sm font-medium">Goal: $3,500</span>
              </div>
              <Progress value={(earningsMetrics.thisMonth / 3500) * 100} className="h-3" />
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ArrowUp className="w-4 h-4 text-green-600" />
                <span>${3500 - earningsMetrics.thisMonth} more needed to reach your goal</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
