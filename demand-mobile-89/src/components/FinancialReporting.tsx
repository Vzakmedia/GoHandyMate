
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Download, Calendar, Building, Percent } from 'lucide-react';

export const FinancialReporting = () => {
  const financialData = [
    { month: 'Jan', revenue: 125000, royalties: 12500, expenses: 85000, profit: 27500 },
    { month: 'Feb', revenue: 142000, royalties: 14200, expenses: 92000, profit: 35800 },
    { month: 'Mar', revenue: 138000, royalties: 13800, expenses: 89000, profit: 35200 },
    { month: 'Apr', revenue: 156000, royalties: 15600, expenses: 98000, profit: 42400 },
    { month: 'May', revenue: 168000, royalties: 16800, expenses: 105000, profit: 46200 },
    { month: 'Jun', revenue: 175000, royalties: 17500, expenses: 110000, profit: 47500 },
  ];

  const royaltyBreakdown = [
    { region: 'Northern CA', revenue: 68500, royalty: 6850, rate: 10 },
    { region: 'Southern TX', revenue: 52300, royalty: 5230, rate: 10 },
    { region: 'Metro Atlanta', revenue: 41200, royalty: 4120, rate: 10 },
    { region: 'Central FL', revenue: 35800, royalty: 3580, rate: 10 },
  ];

  const expenseBreakdown = [
    { name: 'Marketing', value: 25000, color: '#3b82f6' },
    { name: 'Operations', value: 35000, color: '#10b981' },
    { name: 'Technology', value: 15000, color: '#f59e0b' },
    { name: 'Support', value: 20000, color: '#ef4444' },
    { name: 'Admin', value: 15000, color: '#8b5cf6' },
  ];

  const quarterlyMetrics = [
    { quarter: 'Q1 2024', revenue: 405000, growth: 12.5, franchises: 8 },
    { quarter: 'Q2 2024', revenue: 499000, growth: 23.2, franchises: 12 },
    { quarter: 'Q3 2024', revenue: 587000, growth: 17.6, franchises: 15 },
    { quarter: 'Q4 2024 (Est)', revenue: 665000, growth: 13.3, franchises: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Financial Reporting & Royalty Tracking</h2>
        <div className="flex space-x-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>Total Revenue</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">$175K</p>
            <p className="text-sm text-gray-600">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Percent className="w-5 h-5 text-blue-600" />
              <span>Royalties</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">$17.5K</p>
            <p className="text-sm text-gray-600">10% commission rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span>Net Profit</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">$47.5K</p>
            <p className="text-sm text-gray-600">27.1% margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Building className="w-5 h-5 text-orange-600" />
              <span>Active Franchises</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">15</p>
            <p className="text-sm text-gray-600">+3 this quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Profit Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit Trends</CardTitle>
            <CardDescription>Monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Current month expenses by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Royalty Breakdown by Region */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Percent className="w-5 h-5 text-blue-600" />
            <span>Royalty Breakdown by Region</span>
          </CardTitle>
          <CardDescription>Revenue and royalty collection per franchise region</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {royaltyBreakdown.map((region, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{region.region}</h3>
                  <Badge variant="outline">{region.rate}% rate</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">${region.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Royalty Collected</p>
                    <p className="text-xl font-bold text-blue-600">${region.royalty.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Collection Status</p>
                    <Badge variant="default" className="bg-green-100 text-green-800">Collected</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quarterly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Quarterly Performance</span>
          </CardTitle>
          <CardDescription>Quarterly revenue growth and franchise expansion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {quarterlyMetrics.map((quarter, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">{quarter.quarter}</h3>
                  <Badge variant={quarter.growth > 15 ? 'default' : 'secondary'}>
                    {quarter.growth > 0 ? '+' : ''}{quarter.growth}% growth
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-xl font-bold">${quarter.revenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Franchises</p>
                    <p className="text-xl font-bold">{quarter.franchises}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg per Franchise</p>
                    <p className="text-xl font-bold">${Math.round(quarter.revenue / quarter.franchises).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
