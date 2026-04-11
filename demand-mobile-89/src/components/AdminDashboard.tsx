import React, { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Users, CreditCard, TrendingUp, AlertCircle, Download, RefreshCw, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  user_role: string;
  subscription_plan: string;
  subscription_status: string;
  jobs_this_month: number;
  created_at: string;
  stripe_customer_id: string;
}

interface SubscriptionLog {
  id: string;
  user_id: string;
  plan_name: string;
  amount: number;
  status: string;
  created_at: string;
}

interface CronLog {
  id: string;
  job_name: string;
  status: string;
  execution_time: string;
  details: any;
}

const AdminDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<Profile[]>([]);
  const [subscriptionLogs, setSubscriptionLogs] = useState<SubscriptionLog[]>([]);
  const [cronLogs, setCronLogs] = useState<CronLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Check if user is admin - using email check since admin role is not in the user_role enum
  const isAdmin = profile?.email === 'admin@gohandymate.com' || profile?.email?.endsWith('@admin.gohandymate.com');

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardData();
    }
  }, [isAdmin]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Fetch subscription logs
      const { data: logsData, error: logsError } = await supabase
        .from('subscription_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;
      setSubscriptionLogs(logsData || []);

      // Fetch cron job logs
      const { data: cronData, error: cronError } = await supabase
        .from('cron_job_logs')
        .select('*')
        .order('execution_time', { ascending: false })
        .limit(20);

      if (cronError) throw cronError;
      setCronLogs(cronData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserSubscription = async (userId: string, plan: string, status: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: plan,
          subscription_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User subscription updated successfully.",
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: "Error",
        description: "Failed to update subscription.",
        variant: "destructive",
      });
    }
  };

  const resetUserJobCount = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ jobs_this_month: 0 })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Job count reset successfully.",
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error resetting job count:', error);
      toast({
        title: "Error",
        description: "Failed to reset job count.",
        variant: "destructive",
      });
    }
  };

  const triggerMonthlyReset = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('reset-monthly-jobs');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Monthly reset triggered successfully.",
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error triggering reset:', error);
      toast({
        title: "Error",
        description: "Failed to trigger monthly reset.",
        variant: "destructive",
      });
    }
  };

  const exportData = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.user_role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.subscription_status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    totalUsers: users.length,
    activeSubscriptions: users.filter(u => u.subscription_status === 'active').length,
    handymen: users.filter(u => u.user_role === 'handyman').length,
    contractors: users.filter(u => u.user_role === 'contractor').length,
    totalRevenue: subscriptionLogs
      .filter(log => log.status === 'succeeded')
      .reduce((sum, log) => sum + log.amount, 0) / 100, // Convert from cents
  };

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this dashboard.</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#166534]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">Infrastructure Hub</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            End-to-end system monitoring and multi-tenant resource management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoading(true);
              fetchDashboardData();
            }}
            className="h-10 px-6 rounded-xl border-black/5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Sync Hardware
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData(filteredUsers, 'users')}
            className="h-10 px-6 rounded-xl border-black/5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card className="rounded-[2rem] border border-black/5 shadow-sm bg-white overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Users</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{stats.totalUsers}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 shadow-sm bg-white overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Active Subs</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#166534] group-hover:scale-110 transition-transform duration-500">
              <CreditCard className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{stats.activeSubscriptions}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Paid plans active</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 shadow-sm bg-white overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Handymen</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform duration-500">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{stats.handymen}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Service providers</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 shadow-sm bg-white overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contractors</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{stats.contractors}</div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified experts</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border border-black/5 shadow-sm bg-[#166534] overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Total Revenue</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-8">
        <TabsList className="inline-flex gap-2 p-1.5 bg-white border border-black/5 rounded-2xl shadow-sm">
          <TabsTrigger
            value="users"
            className="rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#166534] data-[state=active]:text-white transition-all duration-300"
          >
            User Management
          </TabsTrigger>
          <TabsTrigger
            value="subscriptions"
            className="rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#166534] data-[state=active]:text-white transition-all duration-300"
          >
            Subscription Logs
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="rounded-xl px-6 py-2.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-[#166534] data-[state=active]:text-white transition-all duration-300"
          >
            System Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card className="rounded-[2.5rem] border border-black/5 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-black/5 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">Entity Registry</CardTitle>
                  <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Manage system-wide user accounts and platform permissions
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#166534]/5 text-[#166534] border-none text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 h-auto rounded-full">
                    {filteredUsers.length} TOTAL USERS
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Refined Filters */}
              <div className="p-8 pb-4 flex flex-wrap gap-4 items-center bg-white">
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by identity or email address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-12 bg-slate-50 border-black/5 rounded-xl focus:bg-white focus:ring-4 focus:ring-[#166534]/5 transition-all duration-300"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-44 h-12 bg-slate-50 border-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-black/5">
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="handyman">Handyman</SelectItem>
                      <SelectItem value="contractor">Contractor</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-44 h-12 bg-slate-50 border-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-black/5">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="px-8 pb-8">
                <div className="border border-black/5 rounded-[1.5rem] overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">User Identity</TableHead>
                        <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Authorization</TableHead>
                        <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Plan Level</TableHead>
                        <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Status</TableHead>
                        <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Metric</TableHead>
                        <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12 text-right">Operations</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-black/5">
                          <TableCell className="py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold group-hover:bg-[#166534]/5 group-hover:text-[#166534] transition-colors">
                                {getInitials(user.full_name || user.email)}
                              </div>
                              <div>
                                <div className="text-sm font-black text-slate-900 leading-none mb-1 uppercase tracking-tight">{user.full_name || 'Anonymous User'}</div>
                                <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-slate-100 text-slate-600 border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
                              {user.user_role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-700 uppercase">{user.subscription_plan || 'Free'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                user.subscription_status === 'active' ? "bg-green-500" : "bg-slate-300"
                              )} />
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                {user.subscription_status || 'inactive'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600">
                                {user.jobs_this_month || 0}
                              </div>
                              {user.jobs_this_month > 0 && (
                                <button
                                  onClick={() => resetUserJobCount(user.id)}
                                  className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2 pr-2">
                              <Select
                                onValueChange={(value) => {
                                  const [plan, status] = value.split('|');
                                  updateUserSubscription(user.id, plan, status);
                                }}
                              >
                                <SelectTrigger className="w-32 h-9 bg-slate-50 border-black/5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                  <SelectValue placeholder="MODIFY" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg border-black/5">
                                  <SelectItem value="starter|active">Starter</SelectItem>
                                  <SelectItem value="pro|active">Pro</SelectItem>
                                  <SelectItem value="elite|active">Elite</SelectItem>
                                  <SelectItem value="basic|active">Basic</SelectItem>
                                  <SelectItem value="business|active">Business</SelectItem>
                                  <SelectItem value="enterprise|active">Enterprise</SelectItem>
                                  <SelectItem value="|inactive" className="text-red-500">Suspend</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card className="rounded-[2.5rem] border border-black/5 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-black/5 p-8">
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">Financial Ledgers</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Real-time audit of subscription events and revenue capture
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="border border-black/5 rounded-[1.5rem] overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Audit Time</TableHead>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Service Plan</TableHead>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Value</TableHead>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Transmission</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptionLogs.map((log) => (
                      <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors border-black/5">
                        <TableCell className="py-4 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {new Date(log.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm font-black text-slate-900 uppercase tracking-tight">{log.plan_name}</TableCell>
                        <TableCell className="text-sm font-black text-[#166534]">${(log.amount / 100).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                            log.status === 'succeeded' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {log.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="rounded-[2.5rem] border border-black/5 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-black/5 p-8">
              <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight mb-1">Runtime Diagnostics</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                System automation health and cron job execution telemetry
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="border border-black/5 rounded-[1.5rem] overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Process Name</TableHead>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Status</TableHead>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Timecode</TableHead>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] h-12">Payload</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cronLogs.map((log) => (
                      <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors border-black/5">
                        <TableCell className="py-4 text-sm font-black text-slate-900 uppercase tracking-tight">{log.job_name}</TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                            log.status === 'completed' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          )}>
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {new Date(log.execution_time).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <pre className="text-[9px] bg-slate-50 p-2 rounded-lg max-w-xs truncate font-mono text-slate-500">
                            {JSON.stringify(log.details)}
                          </pre>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
