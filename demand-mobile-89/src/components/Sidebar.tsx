
import { Home, Search, MessageSquare, User, Wrench, DollarSign, Building2, BarChart3, LayoutDashboard, Briefcase, Settings, LogOut, ChevronRight, Menu, Crown } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/features/auth';
import { useNavigate } from 'react-router-dom';
import { HeaderLogo } from './header/HeaderLogo';
import { useCustomerUpgrade } from '@/hooks/useCustomerUpgrade';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onChangeRole?: () => void;
}

export const Sidebar = ({ activeTab, onTabChange, onChangeRole }: SidebarProps) => {
    const { userRole, setUserRole, setIsAuthenticated } = useUserRole();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { isUpgraded } = useCustomerUpgrade();

    const customerTabs = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'search', label: 'Services', icon: Search },
        { id: 'community', label: 'Community', icon: MessageSquare },
        // Properties tab - only shown for upgraded customers
        ...(isUpgraded ? [{ id: 'property', label: 'Properties', icon: Building2 }] : []),
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const handymanTabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'earnings', label: 'Earnings', icon: DollarSign },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    // CONTRACTOR - PENDING (commented out)
    // const contractorTabs = [
    //     { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    //     { id: 'projects', label: 'Projects', icon: Building2 },
    //     { id: 'quotes', label: 'Quotes', icon: DollarSign },
    //     { id: 'profile', label: 'Profile', icon: User },
    // ];

    // PROPERTY_MANAGER - Moved to customer upgrade features (commented out as standalone)
    // const propertyManagerTabs = [
    //     { id: 'properties', label: 'Properties', icon: Building2 },
    //     { id: 'jobs', label: 'Jobs', icon: Wrench },
    //     { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    //     { id: 'profile', label: 'Profile', icon: User },
    // ];

    const getTabsForRole = () => {
        switch (userRole) {
            case 'handyman': return handymanTabs;
            // case 'contractor': return contractorTabs; // CONTRACTOR - PENDING
            // case 'property_manager': return propertyManagerTabs; // PROPERTY_MANAGER - in customer upgrade
            default: return customerTabs;
        }
    };

    const tabs = getTabsForRole();
    const isHandyman = userRole === 'handyman';

    const handleSignOut = async () => {
        await signOut();
        setUserRole(null);
        setIsAuthenticated(false);
        onTabChange('home');
        navigate('/');
    };

    return (
        <aside className="hidden lg:flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 border-r w-64 bg-[#F8FAFC] border-slate-200">
            {/* Sidebar Header */}
            <div className="px-4 py-5 gap-6 flex flex-col">
                <div className="flex items-center gap-2.5 px-2">
                    <img
                        src="/gohandymate-logo.png"
                        alt="GoHandyMate"
                        className="w-9 h-9 object-contain flex-shrink-0"
                    />
                    <div className="flex flex-col">
                        <span className="text-[15px] font-semibold text-slate-900 leading-tight">GoHandyMate</span>
                        <span className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{isHandyman ? 'Handyman workspace' : 'Customer workspace'}</span>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-2 cursor-pointer space-y-1">
                <div className="px-3 mb-2 mt-2 uppercase">
                    <span className="text-[11px] font-bold text-slate-400/80 tracking-widest">
                        NAVIGATION
                    </span>
                </div>

                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] transition-all duration-200 group
                                ${isActive
                                    ? 'bg-emerald-600/10 text-emerald-700 font-semibold'
                                    : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900'}
                            `}
                        >
                            <div className={`flex items-center justify-center transition-colors ${isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-slate-700'}`}>
                                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className="text-[13.5px] tracking-tight">
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50">
                <div className="bg-white rounded-[16px] border border-slate-200 p-3.5 flex flex-col gap-3.5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex flex-shrink-0 items-center justify-center text-emerald-800 font-bold text-sm border border-emerald-200/50">
                            {user?.email?.charAt(0).toUpperCase() || (isHandyman ? 'JT' : 'GU')}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-bold text-slate-900 truncate leading-tight">
                                {user?.email?.split('@')[0] || (isHandyman ? 'Jack Thompson' : 'Guest User')}
                            </span>
                            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-widest truncate">{userRole || 'CUSTOMER'}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2.5 pt-1">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 py-1.5 bg-white border border-rose-200 text-rose-600 text-[11px] font-bold rounded-lg hover:bg-rose-50 transition-all shadow-sm"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Sign out
                        </button>
                        {onChangeRole && (
                            <button
                                onClick={onChangeRole}
                                className="w-full text-center text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-all underline-offset-2"
                            >
                                Switch to {isHandyman ? 'customer' : 'professional'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
};
