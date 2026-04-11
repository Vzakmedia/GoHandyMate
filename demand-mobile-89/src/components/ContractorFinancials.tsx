
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Receipt, 
  CreditCard, 
  Calendar,
  Download,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export const ContractorFinancials = () => {
  const monthlyData = [
    { month: 'Jan', revenue: 42000, expenses: 28000, profit: 14000 },
    { month: 'Feb', revenue: 45000, expenses: 31000, profit: 14000 },
    { month: 'Mar', revenue: 38000, expenses: 26000, profit: 12000 },
    { month: 'Apr', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'May', revenue: 48000, expenses: 32000, profit: 16000 },
    { month: 'Jun', revenue: 55000, expenses: 36000, profit: 19000 },
  ];

  const expenseBreakdown = [
    { name: 'Materials', value: 18500, color: '#3b82f6' },
    { name: 'Labor', value: 12000, color: '#10b981' },
    { name: 'Equipment', value: 3200, color: '#f59e0b' },
    { name: 'Insurance', value: 1500, color: '#ef4444' },
    { name: 'Marketing', value: 800, color: '#8b5cf6' },
  ];

  const invoices = [
    {
      id: 'INV-001',
      client: 'Sarah Johnson',
      project: 'Kitchen Renovation',
      amount: 15500,
      status: 'paid',
      dueDate: '2024-06-15',
      paidDate: '2024-06-14'
    },
    {
      id: 'INV-002', 
      client: 'Mike Smith',
      project: 'Bathroom Remodel',
      amount: 8200,
      status: 'pending',
      dueDate: '2024-07-01',
      paidDate: null
    },
    {
      id: 'INV-003',
      client: 'Lisa Wilson', 
      project: 'Deck Construction',
      amount: 5800,
      status: 'overdue',
      dueDate: '2024-06-20',
      paidDate: null
    },
    {
      id: 'INV-004',
      client: 'Mary Brown',
      project: 'Basement Finishing',
      amount: 12500,
      status: 'paid',
      dueDate: '2024-06-10',
      paidDate: '2024-06-08'
    }
  ];

  const expenses = [
    { date: '2024-06-21', description: 'Lumber & Materials - Home Depot', amount: 2400, category: 'Materials' },
    { date: '2024-06-20', description: 'Subcontractor - Electrical Work', amount: 1800, category: 'Labor' },
    { date: '2024-06-19', description: 'Tool Rental - Equipment Depot', amount: 320, category: 'Equipment' },
    { date: '2024-06-18', description: 'Business Insurance Premium', amount: 450, category: 'Insurance' },
    { date: '2024-06-17', description: 'Google Ads - Marketing Campaign', amount: 180, category: 'Marketing' }
  ];

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Calendar className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      default: return <Receipt className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Financial Management</h2>
          <p className="text-sm text-gray-600">Track revenue, expenses, and profitability</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="text-xs sm:text-sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">$55,000</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12.5%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">$36,000</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+8.3%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">$19,000</div>
            <div className="flex items-center text-xs text-blue-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+18.7%</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-purple-600">34.5%</div>
            <div className="flex items-center text-xs text-purple-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+2.1%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">Revenue & Profit Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
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
            <CardTitle className="text-base sm:text-lg">Expense Breakdown</CardTitle>
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

      {/* Financial Tabs */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices" className="text-xs sm:text-sm">
            Invoices & Payments
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm">
            Expenses & Costs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4 mt-4">
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-3 sm:p-4 border rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm sm:text-base">{invoice.id}</span>
                      <Badge className={getInvoiceStatusColor(invoice.status)}>
                        {getInvoiceStatusIcon(invoice.status)}
                        <span className="ml-1">{invoice.status}</span>
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">{invoice.client} - {invoice.project}</p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      {invoice.paidDate && ` • Paid: ${new Date(invoice.paidDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-semibold text-green-600">
                      ${invoice.amount.toLocaleString()}
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4 mt-4">
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <div key={index} className="p-3 sm:p-4 border rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm sm:text-base">{expense.description}</h4>
                    <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      <Badge variant="outline" className="text-xs">
                        {expense.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-red-600">
                    -${expense.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
