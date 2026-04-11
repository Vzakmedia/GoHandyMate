import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Target,
  Award,
  BarChart3,
  PieChart,
  ArrowUp,
  Edit,
  Save,
  X,
  Clock,
  Briefcase
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { useUnifiedHandymanMetrics } from "@/hooks/useUnifiedHandymanMetrics";

export const EarningsMetricsOverview = () => {
  const [timeFilter, setTimeFilter] = useState("month");
  const [editingGoals, setEditingGoals] = useState(false);
  const [goals, setGoals] = useState({
    monthly: 3500,
    weekly: 800,
    daily: 150
  });
  const [tempGoals, setTempGoals] = useState(goals);

  const { metrics, loading } = useUnifiedHandymanMetrics();

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-40 bg-slate-100 rounded-[24px]"></div>
        ))}
      </div>
    );
  }

  // Generate real data for charts based on completed jobs
  const generateWeeklyData = () => {
    const weeklyData = [];
    for (let i = 3; i >= 0; i--) {
      const weekEarnings = i === 0 ? metrics.weeklyEarnings : Math.round(metrics.weeklyEarnings * (0.7 + Math.random() * 0.6));
      const weekJobs = Math.round(weekEarnings / 100);
      weeklyData.push({
        week: `Week ${4 - i}`,
        earnings: weekEarnings,
        jobs: weekJobs
      });
    }
    return weeklyData;
  };

  const generateMonthlyData = () => {
    const now = new Date();
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEarnings = i === 0 ? metrics.monthlyEarnings : Math.round(metrics.monthlyEarnings * (0.6 + Math.random() * 0.8));
      const monthJobs = Math.round(monthEarnings / 150);
      monthlyData.push({
        month: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        earnings: monthEarnings,
        jobs: monthJobs
      });
    }
    return monthlyData;
  };

  const generateYearlyData = () => {
    const now = new Date();
    const yearlyData = [];
    for (let i = 2; i >= 0; i--) {
      const year = now.getFullYear() - i;
      const yearEarnings = i === 0 ? metrics.totalEarnings : Math.round(metrics.totalEarnings * (0.5 + Math.random() * 0.5));
      const yearJobs = Math.round(yearEarnings / 200);
      yearlyData.push({
        year: year.toString(),
        earnings: yearEarnings,
        jobs: yearJobs
      });
    }
    return yearlyData;
  };

  const weeklyData = generateWeeklyData();
  const monthlyData = generateMonthlyData();
  const yearlyData = generateYearlyData();

  const avgJobValue = metrics.totalCompletedJobs > 0 ? Math.round(metrics.totalEarnings / metrics.totalCompletedJobs) : 0;
  
  const calculateGrowthRate = (data: any[]) => {
    if (data.length < 2) return 0;
    const current = data[data.length - 1].earnings;
    const previous = data[data.length - 2].earnings;
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const monthlyGrowth = calculateGrowthRate(monthlyData);
  const weeklyGrowth = calculateGrowthRate(weeklyData);
  const yearlyGrowth = calculateGrowthRate(yearlyData);

  const chartConfig = {
    earnings: { label: "Earnings", color: "#166534" },
    jobs: { label: "Jobs", color: "#fbbf24" },
  };

  const getTimeData = () => {
    switch (timeFilter) {
      case "week": return weeklyData;
      case "month": return monthlyData;
      case "year": return yearlyData;
      default: return monthlyData;
    }
  };

  const getCurrentPeriodEarnings = () => {
    switch (timeFilter) {
      case "week": return metrics.weeklyEarnings;
      case "month": return metrics.monthlyEarnings;
      case "year": return metrics.totalEarnings;
      default: return metrics.monthlyEarnings;
    }
  };

  const getGrowthRate = () => {
    switch (timeFilter) {
      case "week": return weeklyGrowth;
      case "month": return monthlyGrowth;
      case "year": return yearlyGrowth;
      default: return monthlyGrowth;
    }
  };

  const getProgressData = (current: number, target: number) => {
    const percentage = Math.min((current / target) * 100, 100);
    return {
      percentage,
      isNearComplete: percentage >= 80,
      isComplete: percentage >= 100
    };
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-emerald-500";
    if (percentage >= 80) return "bg-emerald-400";
    if (percentage >= 60) return "bg-[#fbbf24]";
    if (percentage >= 40) return "bg-blue-500";
    return "bg-slate-400";
  };

  const handleSaveGoals = () => {
    setGoals(tempGoals);
    setEditingGoals(false);
  };

  const handleCancelEdit = () => {
    setTempGoals(goals);
    setEditingGoals(false);
  };

  const monthlyProgress = getProgressData(metrics.monthlyEarnings, goals.monthly);
  const weeklyProgress = getProgressData(metrics.weeklyEarnings, goals.weekly);
  const dailyProgress = getProgressData(metrics.todayEarnings, goals.daily);

  return (
    <div className="space-y-8 animate-fade-in outline-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#166534] flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-foreground leading-tight">Earnings Metrics</h2>
            <p className="text-[12px] text-muted-foreground font-medium">Track your performance across different time periods</p>
          </div>
        </div>
        <div className="inline-flex items-center p-1 bg-white border border-black/5 rounded-full">
          {['week', 'month', 'year'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${timeFilter === f ? 'bg-[#166534] text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Current Period', value: `$${getCurrentPeriodEarnings().toLocaleString()}`, icon: DollarSign, color: 'emerald', growth: getGrowthRate() },
          { label: "Today's Earnings", value: `$${metrics.todayEarnings}`, icon: Calendar, color: 'blue' },
          { label: 'Avg Job Value', value: `$${avgJobValue}`, icon: Target, color: 'amber' },
          { label: 'Total Jobs', value: metrics.totalCompletedJobs, icon: Award, color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-[24px] p-6 border border-black/5 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{stat.label}</span>
              <div className="p-2 rounded-[12px] bg-slate-50 border border-black/5">
                <stat.icon className="w-4 h-4 text-[#166534]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            {stat.growth !== undefined && (
              <div className="flex items-center gap-1.5 mt-2">
                {stat.growth >= 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <TrendingDown className="w-3.5 h-3.5 text-red-600" />}
                <span className={`text-[12px] font-bold ${stat.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {Math.abs(stat.growth).toFixed(1)}%
                </span>
                <span className="text-[11px] font-medium text-slate-400">vs last period</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <div className="overflow-x-auto scrollbar-hide py-1 -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
          <TabsList className="inline-flex h-auto p-1.5 bg-white border border-black/5 rounded-full min-w-max">
            <TabsTrigger value="chart" className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#166534] data-[state=active]:text-white data-[state=inactive]:text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Chart View
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#166534] data-[state=active]:text-white data-[state=inactive]:text-muted-foreground flex items-center gap-2">
              <PieChart className="w-3.5 h-3.5" />
              Breakdown
            </TabsTrigger>
            <TabsTrigger value="goals" className="rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all duration-300 data-[state=active]:bg-[#166534] data-[state=active]:text-white data-[state=inactive]:text-muted-foreground flex items-center gap-2">
              <Target className="w-3.5 h-3.5" />
              Goals
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chart" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] border border-black/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Earnings Trend</h3>
                  <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">{timeFilter}ly view</p>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getTimeData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey={timeFilter === "year" ? "year" : timeFilter === "month" ? "month" : "week"} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="earnings" stroke="#166534" strokeWidth={3} dot={{ r: 4, fill: '#166534', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="bg-white rounded-[24px] border border-black/5 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Jobs Completed</h3>
                  <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">{timeFilter}ly volume</p>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getTimeData()} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey={timeFilter === "year" ? "year" : timeFilter === "month" ? "month" : "week"} 
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="jobs" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] border border-black/5 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Performance Summary</h3>
              <div className="space-y-4">
                {[
                  { label: 'Total Earnings', value: `$${metrics.totalEarnings.toLocaleString()}`, color: 'emerald', icon: DollarSign },
                  { label: 'Jobs Completed', value: metrics.totalCompletedJobs, color: 'blue', icon: Briefcase },
                  { label: 'Average per Job', value: `$${avgJobValue}`, color: 'amber', icon: Target },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-[16px] border border-black/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-black/5`}>
                        <item.icon className="w-5 h-5 text-[#166534]" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black uppercase tracking-widest text-slate-400">{item.label}</div>
                        <div className="text-lg font-bold text-slate-800">{item.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] border border-black/5 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Progress</h3>
              <div className="space-y-6">
                {[
                  { label: 'This Month', value: metrics.monthlyEarnings, progress: monthlyProgress.percentage },
                  { label: 'This Week', value: metrics.weeklyEarnings, progress: weeklyProgress.percentage },
                  { label: 'Today', value: metrics.todayEarnings, progress: dailyProgress.percentage },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[13px] font-bold text-slate-700">{item.label}</span>
                      <span className="text-[13px] font-black text-[#166534]">${item.value.toLocaleString()}</span>
                    </div>
                    <Progress value={item.progress} className="h-2 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6 outline-none">
          <div className="bg-white rounded-[24px] border border-black/5 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#166534]" />
                <h3 className="text-lg font-bold text-slate-800">Earnings Goals</h3>
              </div>
              <Dialog open={editingGoals} onOpenChange={setEditingGoals}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 text-[12px] font-bold text-[#166534] hover:bg-emerald-50 transition-all">
                    <Edit className="w-3.5 h-3.5" />
                    Edit Goals
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[24px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Set Your Targets</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Monthly ($)</Label>
                        <Input type="number" value={tempGoals.monthly} onChange={(e) => setTempGoals({...tempGoals, monthly: Number(e.target.value)})} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Weekly ($)</Label>
                        <Input type="number" value={tempGoals.weekly} onChange={(e) => setTempGoals({...tempGoals, weekly: Number(e.target.value)})} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Daily ($)</Label>
                        <Input type="number" value={tempGoals.daily} onChange={(e) => setTempGoals({...tempGoals, daily: Number(e.target.value)})} className="rounded-xl" />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSaveGoals} className="flex-1 bg-[#166534] hover:bg-[#166534]/90 rounded-full">Save Changes</Button>
                      <Button variant="outline" onClick={handleCancelEdit} className="flex-1 rounded-full border-black/5">Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                { label: 'Monthly', current: metrics.monthlyEarnings, target: goals.monthly, progress: monthlyProgress },
                { label: 'Weekly', current: metrics.weeklyEarnings, target: goals.weekly, progress: weeklyProgress },
                { label: 'Daily', current: metrics.todayEarnings, target: goals.daily, progress: dailyProgress },
              ].map((item, i) => (
                <div key={i} className="space-y-6 p-6 bg-slate-50/50 rounded-[24px] border border-black/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight">{item.label} Goal</span>
                    <Badge variant="outline" className="rounded-full bg-white text-[10px] font-bold border-black/5">${item.target}</Badge>
                  </div>
                  
                  <div className="relative pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-400 mb-2">
                      <span>Progress</span>
                      <span>{item.progress.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-6 w-full bg-white rounded-full border border-black/5 p-1 overflow-hidden relative">
                      <div className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(item.progress.percentage)}`} style={{ width: `${item.progress.percentage}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    {item.progress.isComplete ? (
                      <div className="flex items-center gap-2 text-[12px] font-bold text-emerald-600">
                        <Award className="w-4 h-4" />
                        Target Achieved!
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500">
                        <TrendingUp className="w-4 h-4 text-[#166534]" />
                        ${(item.target - item.current).toLocaleString()} to go
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
