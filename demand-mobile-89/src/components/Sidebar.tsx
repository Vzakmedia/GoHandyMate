
import { Home, Search, MessageSquare, User, Wrench, DollarSign, Building2, BarChart3, LayoutDashboard, Briefcase, Settings, LogOut, ChevronRight, Menu, Crown, Hammer } from 'lucide-react';
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
        <aside className={`
            hidden lg:flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 border-r
            ${isHandyman ? 'w-64 bg-sidebar border-black/5' : 'w-72 bg-white border-slate-100'}
        `}>
            {/* Sidebar Header */}
            <div className={`${isHandyman ? 'px-4 py-5 gap-6' : 'p-8 pb-12'} flex flex-col`}>
                {isHandyman ? (
                    <div className="flex items-center gap-2.5 px-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <Hammer className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[15px] font-semibold text-sidebar-foreground leading-tight">GoHandyMate</span>
                            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Handyman workspace</span>
                        </div>
                    </div>
                ) : (
                    <HeaderLogo />
                )}
            </div>

            {/* Navigation Links */}
            <nav className={`flex-1 ${isHandyman ? 'px-3 cursor-pointer' : 'px-4'} space-y-1`}>
                <div className={`${isHandyman ? 'px-3 mb-2 mt-4' : 'px-4 mb-6 uppercase'}`}>
                    <span className={`text-[11px] font-bold ${isHandyman ? 'text-muted-foreground/60 tracking-widest' : 'text-slate-400 tracking-[0.2em]'}`}>
                        NAVIGATION
                    </span>
                </div>

                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    if (isHandyman) {
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`
                                    w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-success/10 text-success-foreground font-semibold'
                                        : 'text-muted-foreground hover:bg-black/5 hover:text-foreground'}
                                `}
                            >
                                <div className={`flex items-center justify-center transition-colors ${isActive ? 'text-success-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                    <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className="text-[13.5px] tracking-tight">
                                    {tab.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                w-full flex items-center justify-between group px-4 py-4 rounded-3xl transition-all duration-500
                                ${isActive
                                    ? 'bg-[#166534] text-white'
                                    : 'text-slate-500 hover:bg-[#FAFAF5] hover:text-[#166534]'}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`
                                  w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500
                                  ${isActive ? 'bg-white/20' : 'bg-slate-50 group-hover:bg-[#166534]/5'}
                                `}>
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                                </div>
                                <span className={`text-sm font-black uppercase tracking-tight ${isActive ? 'translate-x-1' : ''} transition-transform duration-500`}>
                                    {tab.label}
                                </span>
                            </div>
                            {isActive && (
                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-2" />
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Sidebar Footer */}
            <div className={isHandyman ? 'p-4 border-t border-black/5 bg-sidebar-background/50' : 'p-6 space-y-4'}>
                {isHandyman ? (
                    <div className="bg-white rounded-[16px] border border-black/5 p-3.5 flex flex-col gap-3.5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/20 flex flex-shrink-0 items-center justify-center text-accent-foreground font-bold text-sm">
                                {user?.email?.charAt(0).toUpperCase() || 'JT'}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[13px] font-bold text-foreground truncate leading-tight">
                                    {user?.email?.split('@')[0] || 'Jack Thompson'}
                                </span>
                                <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-widest truncate">HANDYMAN</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 py-1.5 bg-white border border-destructive text-destructive text-[11px] font-bold rounded-lg hover:bg-destructive/5 transition-all"
                            >
                                <LogOut className="w-3.5 h-3.5" /> Sign out
                            </button>
                            {onChangeRole && (
                                <button
                                    onClick={onChangeRole}
                                    className="w-full text-center text-[11px] font-bold text-success-foreground hover:opacity-75 transition-opacity"
                                >
                                    Switch to customer
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="p-6 bg-[#FAFAF5] rounded-[2rem] border border-black/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-[#fbbf24] flex items-center justify-center text-[#166534]">
                                    <User className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-[#0A0A0A] truncate uppercase tracking-tight">
                                        {user?.email?.split('@')[0] || 'Guest User'}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {userRole || 'Guest'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-black/5 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-3 h-3" /> Sign Out
                            </button>
                        </div>

                        {onChangeRole && (
                            <button
                                onClick={onChangeRole}
                                className="w-full py-4 text-[10px] font-black text-[#166534] uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                            >
                                Switch to {userRole === 'customer' ? 'Professional' : 'Customer'}
                            </button>
                        )}
                    </>
                )}
            </div>
        </aside>
    );
};
