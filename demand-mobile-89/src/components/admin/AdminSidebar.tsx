
import React from 'react';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    UserCheck,
    Users,
    ShieldCheck,
    Tag,
    Gift,
    Settings,
    BarChart3,
    Database,
    Building2,
    Video,
    LogOut,
    ChevronRight
} from 'lucide-react';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    value: string;
    active: boolean;
    onClick: (value: string) => void;
}

const SidebarItem = ({ icon: Icon, label, value, active, onClick }: SidebarItemProps) => (
    <button
        onClick={() => onClick(value)}
        className={cn(
            "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
            active
                ? "bg-[#166534] text-white shadow-lg shadow-[#166534]/20"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
        )}
    >
        <div className="flex items-center gap-3">
            <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-400 group-hover:text-slate-900")} />
            <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
        </div>
        {active && <ChevronRight className="w-4 h-4 text-white/50" />}
    </button>
);

interface AdminSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
}

export const AdminSidebar = ({ activeTab, onTabChange, onLogout }: AdminSidebarProps) => {
    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', value: 'overview' },
        { icon: UserCheck, label: 'Verification', value: 'verification' },
        { icon: Users, label: 'User Management', value: 'users' },
        { icon: ShieldCheck, label: 'Roles', value: 'roles' },
        { icon: Building2, label: 'Properties', value: 'properties' },
        { icon: Tag, label: 'Promotions', value: 'promotions' },
        { icon: Gift, label: 'Rewards', value: 'rewards' },
        { icon: Video, label: 'Videos', value: 'videos' },
        { icon: LogOut, label: 'Logout', value: 'logout', action: onLogout },
    ];

    const systemItems = [
        { icon: Database, label: 'Backend Logs', value: 'management' },
        { icon: Settings, label: 'System Config', value: 'system' },
        { icon: BarChart3, label: 'Analytics', value: 'analytics' },
    ];

    return (
        <div className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-black/5 flex flex-col p-6 z-50">
            <div className="mb-10 px-4">
                <div className="flex items-center gap-3 mb-1">
                    <img
                        src="/gohandymate-logo.png"
                        alt="GoHandyMate"
                        className="w-9 h-9 object-contain flex-shrink-0"
                    />
                    <span className="text-lg font-black tracking-tighter text-slate-900 uppercase">Admin Hub</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Session</span>
                </div>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto scrollbar-hide">
                <div>
                    <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Management</p>
                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.value}
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                active={activeTab === item.value}
                                onClick={item.action ? item.action : onTabChange}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <p className="px-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">System Infrastructure</p>
                    <div className="space-y-1">
                        {systemItems.map((item) => (
                            <SidebarItem
                                key={item.value}
                                icon={item.icon}
                                label={item.label}
                                value={item.value}
                                active={activeTab === item.value}
                                onClick={onTabChange}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-6 border-t border-black/5">
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        AD
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-900 uppercase truncate">Administrator</p>
                        <p className="text-[9px] font-medium text-slate-500 truncate">admin@gohandymate.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
