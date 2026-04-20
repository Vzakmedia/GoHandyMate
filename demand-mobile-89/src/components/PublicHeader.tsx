import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown, ArrowRight, LayoutDashboard, LogOut } from 'lucide-react';
import { AuthModal } from "@/features/auth";
import { HeaderAuthModal } from "./header/HeaderAuthModal";
import { useAppState } from '@/hooks/useAppState';
import { useAuth } from '@/features/auth';
import { supabase } from '@/integrations/supabase/client';

export const PublicHeader = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalRole, setAuthModalRole] = useState<'customer' | 'handyman'>('customer');
    const [authModalIsSignUp, setAuthModalIsSignUp] = useState(false);
    const [pendingRole, setPendingRole] = useState<'customer' | 'handyman' | null>(null);
    const { handleRoleSelect } = useAppState();
    const [isScrolled, setIsScrolled] = useState(false);

    const handleSignOut = () => {
        supabase.auth.signOut().catch(() => {});
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-')) localStorage.removeItem(key);
            });
            sessionStorage.clear();
        } catch (_) {}
        window.location.replace('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openAuthModal = (role: 'customer' | 'handyman', isSignUp: boolean) => {
        setAuthModalRole(role);
        setAuthModalIsSignUp(isSignUp);
        setPendingRole(role);
        setShowAuthModal(true);
    };

    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        if (pendingRole) {
            handleRoleSelect(pendingRole);
            switch (pendingRole) {
                case 'customer': navigate('/app?tab=home'); break;
                case 'handyman': navigate('/app?tab=search'); break;
                default: navigate('/app');
            }
            setPendingRole(null);
        }
    };

    const handleAuthClose = () => {
        setShowAuthModal(false);
        setPendingRole(null);
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-white border-b border-transparent'}`}>
                <div className="max-w-[1920px] mx-auto px-4 md:px-10 lg:px-16">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo - Left */}
                        <Link
                            to="/"
                            className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group"
                            onClick={() => {
                                if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <div className="transition-transform group-hover:scale-105 h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                                <img
                                    src="/gohandymate-logo.png"
                                    alt="GoHandyMate Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                            <span className="text-xl sm:text-2xl font-bold text-green-900 tracking-tight hidden xs:inline-block">
                                GoHandyMate
                            </span>
                        </Link>

                        {/* Menu - Center */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link
                                to="/"
                                className={`text-sm font-semibold transition-all hover:text-green-600 ${isActive('/') || isActive('/onboarding') ? 'text-green-600' : 'text-slate-600'}`}
                            >
                                Home
                            </Link>

                            {/* Company Mega Menu */}
                            <div className="group relative">
                                <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-green-600 py-6 transition-colors">
                                    Company <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                </button>

                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="w-[850px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex transform origin-top scale-95 group-hover:scale-100 transition-transform duration-200">
                                        {/* Featured Left */}
                                        <div className="w-1/3 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="font-bold text-slate-900">GoHandyMate</span>
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full tracking-wide">FEATURED</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">Discover Our Story</h3>
                                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                                    Learn about our mission to redefine reliability at home and how we're transforming the home services industry.
                                                </p>
                                            </div>
                                            <Link to="/about-us" className="text-sm font-bold text-green-600 flex items-center gap-1 hover:gap-2 transition-all w-fit">
                                                Read our story <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>

                                        {/* Links Right */}
                                        <div className="w-2/3 p-8 grid grid-cols-2 gap-y-8 gap-x-6">
                                            <Link to="/about-us" className="group/item block rounded-xl p-4 -m-4 hover:bg-slate-50 transition-colors">
                                                <h4 className="text-base font-bold text-slate-900 mb-1 group-hover/item:text-green-600 transition-colors">About Us</h4>
                                                <p className="text-sm text-slate-500 mb-3">Our mission, vision, and the team behind GoHandyMate.</p>
                                                <span className="text-xs font-semibold text-green-600 flex items-center gap-1 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">Learn more <ArrowRight className="w-3 h-3" /></span>
                                            </Link>
                                            <Link to="/careers" className="group/item block rounded-xl p-4 -m-4 hover:bg-slate-50 transition-colors">
                                                <h4 className="text-base font-bold text-slate-900 mb-1 group-hover/item:text-green-600 transition-colors">Careers</h4>
                                                <p className="text-sm text-slate-500 mb-3">Join our fast-growing team and build the future of home services.</p>
                                                <span className="text-xs font-semibold text-green-600 flex items-center gap-1 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">View openings <ArrowRight className="w-3 h-3" /></span>
                                            </Link>
                                            <Link to="/success-stories" className="group/item block rounded-xl p-4 -m-4 hover:bg-slate-50 transition-colors col-span-2">
                                                <h4 className="text-base font-bold text-slate-900 mb-1 group-hover/item:text-green-600 transition-colors">Success Stories</h4>
                                                <p className="text-sm text-slate-500 mb-3">Read inspiring stories from our customers and professionals who have transformed their homes and businesses.</p>
                                                <span className="text-xs font-semibold text-green-600 flex items-center gap-1 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">Read stories <ArrowRight className="w-3 h-3" /></span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link
                                to="/how-it-works"
                                className={`text-sm font-semibold transition-all hover:text-green-600 ${isActive('/how-it-works') ? 'text-green-600' : 'text-slate-600'}`}
                            >
                                How It Works
                            </Link>

                            <Link
                                to="/services"
                                className={`text-sm font-semibold transition-all hover:text-green-600 ${isActive('/services') ? 'text-green-600' : 'text-slate-600'}`}
                            >
                                Services
                            </Link>

                            {/* For Professional Mega Menu */}
                            <div className="group relative">
                                <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-green-600 py-6 transition-colors">
                                    For Professional <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                </button>

                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="w-[850px] bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex transform origin-top scale-95 group-hover:scale-100 transition-transform duration-200">
                                        {/* Featured Left */}
                                        <div className="w-1/3 bg-[#F4F7FF] p-8 border-r border-slate-100 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="font-bold text-slate-900">Pro Network</span>
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full tracking-wide">GROWTH</span>
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">Elevate Your Business</h3>
                                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                                    Access thousands of job opportunities, manage your schedule, and grow your client base with our pro tools.
                                                </p>
                                            </div>
                                            <Link to="/sign-up-pro" className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all w-fit">
                                                Apply now <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>

                                        {/* Links Right */}
                                        <div className="w-2/3 p-8 grid grid-cols-2 gap-y-8 gap-x-6">
                                            <Link to="/sign-up-pro" className="group/item block rounded-xl p-4 -m-4 hover:bg-slate-50 transition-colors">
                                                <h4 className="text-base font-bold text-slate-900 mb-1 group-hover/item:text-blue-600 transition-colors">Sign Up as Pro</h4>
                                                <p className="text-sm text-slate-500 mb-3">Create your professional profile and start accepting jobs today.</p>
                                                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">Join the network <ArrowRight className="w-3 h-3" /></span>
                                            </Link>
                                            <Link to="/pro-resources" className="group/item block rounded-xl p-4 -m-4 hover:bg-slate-50 transition-colors">
                                                <h4 className="text-base font-bold text-slate-900 mb-1 group-hover/item:text-blue-600 transition-colors">Pro Resources</h4>
                                                <p className="text-sm text-slate-500 mb-3">Guides, tips, and tools to help you succeed on GoHandyMate.</p>
                                                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">Explore resources <ArrowRight className="w-3 h-3" /></span>
                                            </Link>
                                            <Link to="/pro-community" className="group/item block rounded-xl p-4 -m-4 hover:bg-slate-50 transition-colors col-span-2">
                                                <h4 className="text-base font-bold text-slate-900 mb-1 group-hover/item:text-blue-600 transition-colors">Pro Community</h4>
                                                <p className="text-sm text-slate-500 mb-3">Connect with other professionals, share advice, and learn from the best in the industry.</p>
                                                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all">Join discussion <ArrowRight className="w-3 h-3" /></span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Buttons - Right */}
                        <div className="hidden lg:flex items-center space-x-4">
                            {user ? (
                                /* Signed-in state */
                                <>
                                    <Button
                                        onClick={() => navigate('/app')}
                                        className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-5 rounded-xl shadow-lg shadow-green-200 transition-colors duration-300"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Button>
                                    <Button
                                        onClick={handleSignOut}
                                        variant="outline"
                                        className="flex items-center gap-2 border-slate-300 text-slate-700 font-bold px-5 py-5 rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors duration-300"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </Button>
                                </>
                            ) : (
                                /* Guest state */
                                <>
                                    {/* "Get Started" Dropdown */}
                                    <div className="group relative">
                                        <Button
                                            variant="outline"
                                            className="hidden sm:flex items-center gap-2 border-slate-300 text-slate-800 font-bold px-6 py-5 rounded-xl transition-colors duration-300 group-hover:bg-slate-50"
                                        >
                                            Get Started <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                                        </Button>

                                        <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            <div className="w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden flex flex-col transform origin-top right scale-95 group-hover:scale-100 transition-transform duration-200 p-2">

                                                {/* PROFESSIONALS Section */}
                                                <div className="p-3">
                                                    <span className="text-xs font-bold text-slate-500 tracking-wider mb-2 block uppercase">Professionals</span>
                                                    <button
                                                        onClick={() => openAuthModal('handyman', false)}
                                                        className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-green-600 rounded-lg flex items-center justify-between transition-colors"
                                                    >
                                                        Log in <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => openAuthModal('handyman', true)}
                                                        className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-green-600 rounded-lg flex items-center justify-between transition-colors"
                                                    >
                                                        Sign up <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                <div className="h-px bg-slate-100 my-1 mx-3" />

                                                <div className="p-3">
                                                    <span className="text-xs font-bold text-slate-500 tracking-wider mb-2 block uppercase">Need a service</span>
                                                    <button
                                                        onClick={() => openAuthModal('customer', false)}
                                                        className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-green-600 rounded-lg flex items-center justify-between transition-colors"
                                                    >
                                                        Log in <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => openAuthModal('customer', true)}
                                                        className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-green-600 rounded-lg flex items-center justify-between transition-colors"
                                                    >
                                                        Sign up <ArrowRight className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => navigate('/professionals')}
                                        className="bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-5 rounded-xl shadow-lg shadow-green-200 transition-colors duration-300"
                                    >
                                        Find Pros
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <AuthModal
                isOpen={showAuthModal}
                onClose={handleAuthClose}
                onSuccess={handleAuthSuccess}
                defaultIsSignUp={authModalIsSignUp}
                defaultRole={authModalRole}
            />
        </>
    );
};
