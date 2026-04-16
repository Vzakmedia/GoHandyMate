import { Bell, Megaphone, RefreshCw, User, ShieldCheck, Zap } from "lucide-react";
import { useAuth } from '@/features/auth';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface DashboardTopbarProps {
    profileName?: string;
    userRole: string;
    onChangeRole?: () => void;
}

export const DashboardTopbar = ({ profileName, userRole, onChangeRole }: DashboardTopbarProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const initials = profileName
        ? profileName.split(' ').map(n => n[0]).join('').toUpperCase()
        : user?.email?.charAt(0).toUpperCase() || (userRole === 'handyman' ? 'H' : 'C');

    const shortName = profileName
        ? (profileName.split(' ')[0] + (profileName.split(' ')[1] ? ` ${profileName.split(' ')[1][0]}.` : ''))
        : user?.email?.split('@')[0] || (userRole === 'handyman' ? 'Handyman' : 'Customer');

    const isHandyman = userRole === 'handyman';

    return (
        <header className="bg-white/80 backdrop-blur-xl border-b border-black/5 px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 z-[100] transition-all duration-500 animate-fade-in outline-none">
            {/* Left Section: Logo & Status */}
            <div className="flex items-center gap-4">
                <img
                    src="/gohandymate-logo.png"
                    alt="GoHandyMate"
                    className="w-9 h-9 object-contain flex-shrink-0 lg:hidden"
                />
                <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 group cursor-default">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                        {isHandyman ? 'Handyman Dashboard' : 'Customer Dashboard'}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-1 group-hover:scale-110 transition-transform" />
                </div>
            </div>

            {/* Right Section: Actions & Profile */}
            <div className="flex items-center gap-4 lg:gap-6">
                {isHandyman && (
                    <button 
                      onClick={() => navigate('/business-advertising')}
                      className="hidden sm:flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 hover:-translate-y-0.5 transition-all active:scale-95 group"
                    >
                        <Megaphone className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                        Market ads
                    </button>
                )}

                <button className="relative w-11 h-11 flex items-center justify-center rounded-2xl border border-black/5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all duration-300 group">
                    <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-2 ring-rose-500/20"></span>
                </button>

                <div className="h-8 w-px bg-black/5 mx-1 hidden md:block"></div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-2xl border border-black/5 bg-white transition-all duration-500 group/profile">
                        <div className="w-9 h-9 rounded-xl bg-[#166534] flex items-center justify-center text-white text-[12px] font-black group-hover/profile:scale-105 transition-transform duration-500">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-900 tracking-tight lowercase first-letter:uppercase">{shortName}</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                {isHandyman ? 'Senior pro' : 'Customer'}
                            </span>
                        </div>
                    </div>

                    {onChangeRole && (
                        <button
                            onClick={onChangeRole}
                            className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-black/5 bg-white text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 group/role"
                        >
                            <RefreshCw className="w-3.5 h-3.5 group-hover/role:rotate-180 transition-transform duration-700" />
                            Switch
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
