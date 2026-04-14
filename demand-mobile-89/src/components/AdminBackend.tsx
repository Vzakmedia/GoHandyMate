import React, { useState } from 'react';
import { useAuth } from '@/features/auth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminVerificationPanel } from '@/components/AdminVerificationPanel';
import { AdminAutomationPanel } from '@/components/AdminAutomationPanel';
import AdminDashboard from '@/components/AdminDashboard';
import { CombinedVideoManager } from '@/components/admin/CombinedVideoManager';
import { PropertyManagementAdmin } from '@/components/admin/property/PropertyManagementAdmin';
import { AdminAccessControl } from '@/components/admin/backend/AdminAccessControl';
import { AdminOverviewCards } from '@/components/admin/backend/AdminOverviewCards';
import { AdminQuickActions } from '@/components/admin/backend/AdminQuickActions';
import { RoleManagement } from '@/components/admin/backend/RoleManagement';
import { PromotionManagement } from '@/components/admin/backend/PromotionManagement';
import { RewardManagement } from '@/components/admin/backend/RewardManagement';
import { SystemConfiguration } from '@/components/admin/backend/SystemConfiguration';
import { UserAnalytics } from '@/components/admin/backend/UserAnalytics';
import { UserManagement } from '@/components/admin/backend/UserManagement';
import { SpamUserManager } from '@/components/admin/backend/SpamUserManager';
import {
  BarChart3,
  Users,
  Settings,
  Video,
  Shield,
  Building2,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';

export const AdminBackend = () => {
  console.log('AdminBackend: Component rendering');

  const { user, profile, loading: authLoading, signOut } = useAuth();
  const { setUserRole, setIsAuthenticated } = useUserRole();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  console.log('AdminBackend: Auth state', {
    user: user?.email,
    loading: authLoading,
    userExists: !!user
    // removed signOut log as it's a function
  });

  const handleBackToRoles = () => {
    console.log('Admin backend: Going back to role selection');
    // Reset user role and authentication state
    setUserRole(null);
    setIsAuthenticated(false);
    // Navigate to home page (this will trigger the welcome screen)
    navigate('/');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const isAdmin = profile?.user_role === 'admin';

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAFAF5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#166534] border-t-transparent mx-auto mb-6"></div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Authenticating Admin...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <AdminAccessControl
        user={user}
        authLoading={authLoading}
        onBackToRoles={handleBackToRoles}
      />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <AdminOverviewCards onTabChange={setActiveTab} />
            <AdminQuickActions onTabChange={setActiveTab} />
          </div>
        );
      case 'verification':
        return <div className="animate-in fade-in duration-500"><AdminVerificationPanel /></div>;
      case 'users':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <UserManagement />
            <SpamUserManager />
          </div>
        );
      case 'roles':
        return <div className="animate-in fade-in duration-500"><RoleManagement /></div>;
      case 'properties':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Property Management</h2>
              <p className="text-slate-500 text-sm mb-6">Manage property registrations and property manager accounts</p>
              <PropertyManagementAdmin />
            </div>
          </div>
        );
      case 'automation':
        return <div className="animate-in fade-in duration-500"><AdminAutomationPanel /></div>;
      case 'videos':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">Video Management</h2>
              <p className="text-slate-500 text-sm mb-6">Upload and manage both demo videos and training videos</p>
              <CombinedVideoManager />
            </div>
          </div>
        );
      case 'promotions':
        return <div className="animate-in fade-in duration-500"><PromotionManagement /></div>;
      case 'rewards':
        return <div className="animate-in fade-in duration-500"><RewardManagement /></div>;
      case 'system':
        return <div className="animate-in fade-in duration-500"><SystemConfiguration /></div>;
      case 'management':
        return <div className="animate-in fade-in duration-500"><AdminDashboard /></div>;
      case 'analytics':
        return <div className="animate-in fade-in duration-500"><UserAnalytics /></div>;
      default:
        return <AdminOverviewCards onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAF5]">
      {/* Redesigned Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-72 p-10 max-w-[1600px]">
        {/* Custom Header within Content Area */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-black/5 flex items-center justify-center shadow-sm">
              <Shield className="w-6 h-6 text-[#166534]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-black text-[#166534] uppercase tracking-[0.2em]">Secure Dashboard</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{activeTab}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">System Control</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group hidden xl:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                placeholder="Search resources..."
                className="pl-11 pr-4 h-11 w-64 bg-white rounded-xl border border-black/5 text-sm focus:ring-4 focus:ring-[#166534]/5 focus:border-[#166534]/20 outline-none transition-all duration-300"
              />
            </div>
            <button className="w-11 h-11 rounded-xl bg-white border border-black/5 flex items-center justify-center text-slate-400 hover:text-[#166534] hover:bg-slate-50 transition-all duration-300 relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <button
              onClick={handleBackToRoles}
              className="h-11 px-6 rounded-xl bg-white border border-black/5 text-[10px] font-black uppercase tracking-widest text-[#166534] hover:bg-slate-50 transition-all duration-300"
            >
              Switch Role
            </button>
          </div>
        </header>

        {/* Dynamic Section Content */}
        <div className="pb-20">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
