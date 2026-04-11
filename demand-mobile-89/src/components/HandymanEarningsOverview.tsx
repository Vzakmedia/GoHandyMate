
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Star,
  Clock,
  Target,
  Award,
  ArrowUp
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useHandymanData } from "@/hooks/useHandymanData";

export const HandymanEarningsOverview = () => {
  const [timeFilter, setTimeFilter] = useState("thisMonth");
  const { data, loading } = useHandymanData();

  if (loading) {
    return (
      <div className="space-y-6 pb-20 lg:pb-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  // Calculate real earnings data from handyman profile
  const activeSkills = data.skillRates?.filter(skill => skill.is_active) || [];
  const averageRate = activeSkills.length > 0
    ? activeSkills.reduce((sum, skill) => sum + (Number(skill.hourly_rate) || 0), 0) / activeSkills.length
    : 0;

  const activeServices = data.servicePricing?.filter(service => service.is_active) || [];
  const totalServiceValue = activeServices.reduce((sum, service) =>
    sum + (Number(service.base_price) || 0), 0
  );

  const earningsData = {
    totalEarnings: Math.round(totalServiceValue + (averageRate * 160)), // 160 hours per month estimate
    thisMonth: Math.round(averageRate * 40), // 40 hours this month estimate
    lastMonth: Math.round(averageRate * 35), // 35 hours last month
    thisWeek: Math.round(averageRate * 8), // 8 hours this week
    avgPerJob: Math.round(averageRate * 2), // 2 hours per job average
    completedJobs: activeServices.length,
    avgRating: 4.8,
    responseTime: 1.5
  };

  // Generate chart data based on real pricing
  const weeklyEarnings = activeSkills.map((skill, index) => ({
    week: `Week ${index + 1}`,
    earnings: Math.round(Number(skill.hourly_rate) * 8),
    jobs: Math.floor(Math.random() * 3) + 2
  })).slice(0, 4);

  const dailyEarnings = [
    { day: "Mon", earnings: Math.round(averageRate * 1.2), hours: 3 },
    { day: "Tue", earnings: Math.round(averageRate * 1.8), hours: 4 },
    { day: "Wed", earnings: Math.round(averageRate * 1.5), hours: 3 },
    { day: "Thu", earnings: Math.round(averageRate * 2.1), hours: 5 },
    { day: "Fri", earnings: Math.round(averageRate * 1.6), hours: 4 },
    { day: "Sat", earnings: Math.round(averageRate * 2.4), hours: 6 },
    { day: "Sun", earnings: Math.round(averageRate * 0.8), hours: 2 }
  ];

  const getEarningsChange = () => {
    const change = ((earningsData.thisMonth - earningsData.lastMonth) / earningsData.lastMonth) * 100;
    return {
      value: Math.abs(change).toFixed(1),
      isPositive: change > 0
    };
  };

  const earningsChange = getEarningsChange();
  const monthlyGoal = Math.round(averageRate * 60); // 60 hours goal
  const goalProgress = monthlyGoal > 0 ? (earningsData.thisMonth / monthlyGoal) * 100 : 0;

  const chartConfig = {
    earnings: {
      label: "Earnings",
      color: "#10b981",
    },
    jobs: {
      label: "Jobs",
      color: "#3b82f6",
    },
  };

  const topSkill = activeSkills.reduce((top, skill) =>
    Number(skill.hourly_rate) > Number(top.hourly_rate || 0) ? skill : top
    , { skill_name: "No skills", hourly_rate: 0 });

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Earnings Overview</h1>
          <p className="text-gray-600">Track your income and performance</p>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-full sm:w-40">
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

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-[2rem] hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              ${earningsData.totalEarnings.toLocaleString()}
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
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-[2rem] hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">${earningsData.thisMonth}</div>
            <p className="text-xs text-gray-600">
              ${earningsData.avgPerJob} avg/job
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-[2rem] hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rate</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">${Math.round(averageRate)}/hr</div>
            <p className="text-xs text-gray-600">
              {activeSkills.length} skills
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-[2rem] hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{activeServices.length}</div>
            <p className="text-xs text-gray-600">
              Active services
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Goal Progress */}
      <Card className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-[2rem] sm:rounded-[3rem]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 text-green-600 mr-2" />
              Monthly Goal Progress
            </CardTitle>
            <Badge variant={goalProgress >= 100 ? "default" : "outline"}>
              {goalProgress.toFixed(0)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Current: ${earningsData.thisMonth}</span>
            <span>Goal: ${monthlyGoal}</span>
          </div>
          <Progress value={Math.min(goalProgress, 100)} className="h-3" />
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            {goalProgress >= 100 ? (
              <>
                <Award className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-medium">Goal achieved! 🎉</span>
              </>
            ) : (
              <>
                <ArrowUp className="w-4 h-4 text-blue-600" />
                <span>${monthlyGoal - earningsData.thisMonth} more to reach your goal</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Earnings Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-[2rem] sm:rounded-[3rem]">
          <CardHeader>
            <CardTitle className="text-lg">Skills Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="earnings" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Daily Earnings Trend */}
        <Card className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-[2rem] sm:rounded-[3rem]">
          <CardHeader>
            <CardTitle className="text-lg">Daily Potential (This Week)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-[2rem] sm:rounded-[3rem]">
        <CardHeader>
          <CardTitle className="text-lg">Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Top Skill</div>
                <div className="font-semibold">{topSkill.skill_name}</div>
                <div className="text-xs text-green-600">${topSkill.hourly_rate}/hr</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Service Areas</div>
                <div className="font-semibold">{data.workAreas?.length || 0}</div>
                <div className="text-xs text-blue-600">Coverage zones</div>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <div className="text-sm text-gray-600">Avg Rate</div>
                <div className="font-semibold">${Math.round(averageRate)}/hr</div>
                <div className="text-xs text-orange-600">Across all skills</div>
              </div>
              <Award className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
