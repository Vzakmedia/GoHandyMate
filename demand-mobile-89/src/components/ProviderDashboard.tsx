
import { useAuth } from '@/features/auth';
import { useHandymanData } from "@/hooks/useHandymanData";
import { DashboardOverview } from "@/components/handyman/DashboardOverview";
import { QuickJobActions } from "@/components/handyman/QuickJobActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, TrendingUp, Loader2 } from "lucide-react";

export const ProviderDashboard = () => {
  const { profile } = useAuth();
  const { data: handymanData, loading } = useHandymanData();

  const handleNavigateToJobs = () => {
    console.log('Navigate to jobs');
  };

  const handleNavigateToEarnings = () => {
    console.log('Navigate to earnings');
  };

  // Calculate metrics from handyman data (focusing on services, not rates)
  const activeSkills = handymanData.skillRates?.filter(skill => skill.is_active) || [];
  const activeServices = handymanData.servicePricing?.filter(service => service.is_active) || [];
  const workAreas = handymanData.workAreas || [];

  // Estimate earnings based on active services instead of hourly rates
  const estimatedWeeklyEarnings = activeServices.length * 150; // Estimated per service per week
  const estimatedMonthlyEarnings = activeServices.length * 600; // Estimated per service per month

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading your dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.full_name || 'Professional'}!
        </h1>
        <p className="opacity-90">
          Here's your dashboard overview with real-time data from your profile settings.
        </p>
        {activeSkills.length === 0 && activeServices.length === 0 && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg">
            <p className="text-sm">
              <strong>Get Started:</strong> Add your skills and service pricing in your profile to start seeing live data and receiving jobs.
            </p>
          </div>
        )}
      </div>

      {/* Real-time Dashboard Overview */}
      <DashboardOverview />

      {/* Live Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeSkills.length}</div>
            <p className="text-xs text-gray-600">
              Skills configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeServices.length}</div>
            <p className="text-xs text-gray-600">
              Services offered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${estimatedWeeklyEarnings}</div>
            <p className="text-xs text-gray-600">
              Based on services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${estimatedMonthlyEarnings}</div>
            <p className="text-xs text-gray-600">
              Estimated earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Earnings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Track your income and payment history
            </p>
            <Button 
              onClick={handleNavigateToEarnings}
              className="w-full"
              variant="outline"
            >
              View Earnings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Jobs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Browse and manage your job opportunities
            </p>
            <Button 
              onClick={handleNavigateToJobs}
              className="w-full"
              variant="outline"
            >
              View Jobs
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <span>Profile</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Update your skills, pricing, and service areas
            </p>
            <Button 
              className="w-full"
              variant="outline"
            >
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Job Actions */}
      <QuickJobActions
        onNavigateToJobs={handleNavigateToJobs}
        onNavigateToEarnings={handleNavigateToEarnings}
      />
    </div>
  );
};
